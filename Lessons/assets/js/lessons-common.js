/* ==========================================================================
   Lessons Common JS — Slide Deck & Assessment Controller
   ========================================================================== */

let currentSlide = 1;
let totalSlides = 0;

// ========== Base64 Decoder Helper ==========
function decodeBase64(str) {
    if (!str) return "";
    try {
        return decodeURIComponent(escape(atob(str)));
    } catch (e) {
        return str;
    }
}

// ========== Dynamic Split-Screen Layout & Sidebar Initializer ==========
function initLessonLayout() {
    const presentation = document.querySelector('.presentation');
    if (!presentation) return;

    totalSlides = document.querySelectorAll('.slide').length;

    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'lesson-layout-wrapper';

    // Create sidebar
    const sidebar = document.createElement('aside');
    sidebar.className = 'lesson-sidebar';
    sidebar.innerHTML = `
        <div class="sidebar-header">
            <span class="sidebar-title-jp">目次</span>
            <span class="sidebar-title-en">Table of Contents</span>
        </div>
        <ul class="sidebar-list"></ul>
    `;

    // Move elements into wrapper
    presentation.parentNode.insertBefore(wrapper, presentation);
    wrapper.appendChild(sidebar);
    wrapper.appendChild(presentation);

    // Build sidebar item index list
    const sidebarList = sidebar.querySelector('.sidebar-list');
    const slides = document.querySelectorAll('.slide');
    
    // Create mobile dropdown select
    let selectHtml = `<select id="mobileSlideSelect" class="mobile-slide-select" onchange="goToSlide(Number(this.value))">`;
    
    slides.forEach((slide, index) => {
        const slideNum = index + 1;
        let title = `Slide ${slideNum}`;

        // Find headers in slides to extract titles
        const header = slide.querySelector('.slide-header h2') ||
                       slide.querySelector('.quiz-header h2') ||
                       slide.querySelector('.title-slide h1') ||
                       slide.querySelector('.summary-card h2');

        if (header) {
            const tempNode = header.cloneNode(true);
            tempNode.querySelectorAll('rt').forEach(rt => rt.remove());
            title = tempNode.textContent.trim();
        }

        // Clean up redundant titles
        if (title.toLowerCase().startsWith('lesson')) {
            const jpTitle = slide.querySelector('.lesson-title-jp');
            if (jpTitle) {
                const tempJp = jpTitle.cloneNode(true);
                tempJp.querySelectorAll('rt').forEach(rt => rt.remove());
                title = `${title} — ${tempJp.textContent.trim()}`;
            }
        }

        const li = document.createElement('li');
        li.className = 'sidebar-item';
        li.setAttribute('data-slide-target', slideNum);
        li.innerHTML = `
            <button onclick="goToSlide(${slideNum})" class="sidebar-btn" type="button">
                <span class="slide-num-badge">${slideNum}</span>
                <span class="slide-title-text">${title}</span>
            </button>
        `;
        sidebarList.appendChild(li);

        // Build mobile select option
        let selectTitle = title;
        if (selectTitle.includes(' — ')) {
            const parts = selectTitle.split(' — ');
            selectTitle = parts[1] || parts[0];
        }
        selectHtml += `<option value="${slideNum}">${slideNum}. ${selectTitle}</option>`;
    });

    selectHtml += `</select>`;

    // Insert mobile select dropdown into progress bar area
    const progressText = document.querySelector('.progress-text');
    if (progressText) {
        const selectContainer = document.createElement('span');
        selectContainer.className = 'mobile-slide-select-container';
        selectContainer.innerHTML = selectHtml;
        progressText.insertBefore(selectContainer, progressText.firstChild);
    }
}

// ========== Slide Transitions & State Updates ==========
function updateSlide() {
    document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
    const active = document.querySelector(`[data-slide="${currentSlide}"]`);
    if (active) active.classList.add('active');

    // Update progress numbers
    const curEl = document.getElementById('currentSlide');
    const totEl = document.getElementById('totalSlides');
    if (curEl) curEl.textContent = currentSlide;
    if (totEl) totEl.textContent = totalSlides;

    // Update progress bar fill
    const progressFill = document.getElementById('progressFill');
    if (progressFill && totalSlides > 1) {
        const progress = ((currentSlide - 1) / (totalSlides - 1)) * 100;
        progressFill.style.width = progress + '%';
    }

    // Update navigation buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (prevBtn) prevBtn.disabled = currentSlide === 1;
    if (nextBtn) nextBtn.disabled = currentSlide === totalSlides;

    // Synchronize active item in sidebar index
    document.querySelectorAll('.sidebar-item').forEach(item => {
        if (Number(item.getAttribute('data-slide-target')) === currentSlide) {
            item.classList.add('active');
            // Auto scroll sidebar list to keep active item in view if needed
            item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        } else {
            item.classList.remove('active');
        }
    });

    // Synchronize mobile dropdown select
    const mobileSelect = document.getElementById('mobileSlideSelect');
    if (mobileSelect) {
        mobileSelect.value = currentSlide;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function nextSlide() {
    if (currentSlide < totalSlides) {
        currentSlide++;
        updateSlide();
    }
}

function prevSlide() {
    if (currentSlide > 1) {
        currentSlide--;
        updateSlide();
    }
}

function goToSlide(n) {
    if (n >= 1 && n <= totalSlides) {
        currentSlide = n;
        updateSlide();
    }
}

function restartPresentation() {
    currentSlide = 1;
    updateSlide();
}

// ========== Collapsible Ref Toggles ==========
function toggleRef(button) {
    const content = button.nextElementSibling;
    button.classList.toggle('open');
    content.classList.toggle('open');
}

// ========== Multiple Choice Assessments ==========
function checkMC(qId, clickedOption) {
    const feedbackEl = document.getElementById(qId + '-feedback');
    const optionsContainer = document.getElementById(qId + '-options');
    const options = optionsContainer.querySelectorAll('.mc-option');
    const answerData = window.mcAnswers ? window.mcAnswers[qId] : null;

    if (!answerData) return;

    const clickedLetter = clickedOption.querySelector('.option-letter').textContent.trim();

    // Disable all options
    options.forEach(opt => opt.classList.add('disabled'));

    const correctLetter = decodeBase64(answerData.correct).trim();
    const explanation = decodeBase64(answerData.explanation);

    // Mark correct and incorrect options
    options.forEach(opt => {
        const letter = opt.querySelector('.option-letter').textContent.trim();
        if (letter === correctLetter) {
            opt.classList.add('correct-choice');
        } else if (opt === clickedOption && clickedLetter !== correctLetter) {
            opt.classList.add('incorrect-choice');
        }
    });

    // Show feedback
    const isCorrect = clickedLetter === correctLetter;
    feedbackEl.className = 'feedback-area show ' + (isCorrect ? 'correct-feedback' : 'incorrect-feedback');
    feedbackEl.innerHTML = `
        <span class="fb-icon">${isCorrect ? '🎉' : '😅'}</span>
        <span class="fb-answer">${isCorrect ? 'Correct!' : 'Not quite!'}</span>
        <div class="fb-explain">${explanation}</div>
    `;
}

// ========== Fill in the Blank Assessments ==========
function checkFillBlank(qId) {
    const input = document.getElementById(qId + '-input');
    const feedbackEl = document.getElementById(qId + '-feedback');
    const userAnswer = input.value.trim();

    if (!userAnswer) {
        feedbackEl.className = 'feedback-area show incorrect-feedback';
        feedbackEl.innerHTML = `<span class="fb-icon">✍️</span> <span class="fb-answer">Please type your answer first!</span>`;
        return;
    }

    const data = window.fillAnswers ? window.fillAnswers[qId] : null;
    if (!data) return;

    const accepted = data.accepted.map(a => decodeBase64(a));
    const display = decodeBase64(data.display);
    const explanation = decodeBase64(data.explanation);

    const isCorrect = accepted.includes(userAnswer);

    input.style.borderColor = isCorrect ? 'var(--success)' : 'var(--error)';
    input.style.background = isCorrect ? 'var(--success-light)' : 'var(--error-light)';

    feedbackEl.className = 'feedback-area show ' + (isCorrect ? 'correct-feedback' : 'incorrect-feedback');
    feedbackEl.innerHTML = `
        <span class="fb-icon">${isCorrect ? '🎉' : '😅'}</span>
        <span class="fb-answer">${isCorrect ? 'Correct!' : 'Not quite!'} The answer is: <strong>${display}</strong></span>
        <div class="fb-explain">${explanation}</div>
    `;
}

// ========== Initialize and Keybinds ==========
document.addEventListener('DOMContentLoaded', () => {
    initLessonLayout();
    updateSlide();

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
        }
    });
});
