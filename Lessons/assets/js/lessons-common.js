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

// ========== Declarative Section Assessments ==========
const LessonAssessment = (() => {
    const sectionStates = new WeakMap();

    function normalizeTypedAnswer(value) {
        return String(value ?? '').trim();
    }

    function isQuestionAnswered(question, answer) {
        if (question.kind === 'typed-group') {
            return Array.isArray(answer)
                && answer.length === question.fields.length
                && answer.every(value => normalizeTypedAnswer(value) !== '');
        }
        if (question.kind === 'typed') return normalizeTypedAnswer(answer) !== '';
        return answer !== undefined && answer !== null && String(answer) !== '';
    }

    function evaluateQuestion(question, answer) {
        if (question.kind === 'typed-group') {
            const values = Array.isArray(answer) ? answer : [];
            const correct = question.fields.every((field, index) => (
                field.accepted.includes(normalizeTypedAnswer(values[index]))
            ));
            return {
                correct,
                display: question.fields.map(field => field.display).join(' ～ '),
                explanation: question.explanation || ''
            };
        }
        if (question.kind === 'typed') {
            const normalized = normalizeTypedAnswer(answer);
            return {
                correct: question.accepted.includes(normalized),
                display: question.display,
                explanation: question.explanation || ''
            };
        }
        return {
            correct: String(answer) === String(question.correct),
            display: question.display || '',
            explanation: question.explanation || ''
        };
    }

    function createSectionState(questions) {
        const questionMap = new Map(questions.map(question => [question.id, {
            ...question,
            accepted: Array.isArray(question.accepted) ? [...question.accepted] : [],
            fields: Array.isArray(question.fields)
                ? question.fields.map(field => ({
                    ...field,
                    accepted: Array.isArray(field.accepted) ? [...field.accepted] : []
                }))
                : []
        }]));

        const state = {
            answers: {},
            locked: false,
            select(questionId, value) {
                if (!state.locked && questionMap.has(questionId)) state.answers[questionId] = value;
                return state;
            },
            submit() {
                for (const question of questionMap.values()) {
                    if (!isQuestionAnswered(question, state.answers[question.id])) {
                        return { status: 'incomplete', firstUnanswered: question.id };
                    }
                }

                const results = {};
                for (const question of questionMap.values()) {
                    results[question.id] = evaluateQuestion(question, state.answers[question.id]);
                }
                state.locked = true;
                return { status: 'reviewed', locked: true, results };
            },
            reset() {
                state.answers = {};
                state.locked = false;
                return state;
            }
        };

        return state;
    }

    function parseAcceptedAnswers(input) {
        try {
            const parsed = JSON.parse(input.dataset.accepted || '[]');
            return Array.isArray(parsed) ? parsed.map(value => String(value)) : [];
        } catch (error) {
            console.error('Invalid data-accepted JSON for lesson question.', error);
            return [];
        }
    }

    function questionModel(questionElement) {
        const inputs = [...questionElement.querySelectorAll('[data-answer-input]')];
        const feedback = questionElement.querySelector('[data-feedback]');
        if (inputs.length > 1) {
            return {
                id: questionElement.dataset.questionId,
                kind: 'typed-group',
                fields: inputs.map(input => ({
                    accepted: parseAcceptedAnswers(input),
                    display: input.dataset.displayAnswer || ''
                })),
                explanation: feedback?.dataset.explanation || ''
            };
        }
        if (inputs.length === 1) {
            const input = inputs[0];
            return {
                id: questionElement.dataset.questionId,
                kind: 'typed',
                accepted: parseAcceptedAnswers(input),
                display: input.dataset.displayAnswer || '',
                explanation: feedback?.dataset.explanation || ''
            };
        }

        const options = [...questionElement.querySelectorAll('[data-answer]')];
        const correctOption = options.find(option => option.dataset.correct === 'true');
        return {
            id: questionElement.dataset.questionId,
            kind: 'choice',
            correct: correctOption?.dataset.value ?? correctOption?.textContent.trim() ?? '',
            display: correctOption?.textContent.trim() || '',
            explanation: feedback?.dataset.explanation || ''
        };
    }

    function getSectionState(section) {
        if (!sectionStates.has(section)) {
            const questions = [...section.querySelectorAll('[data-question-id]')].map(questionModel);
            sectionStates.set(section, createSectionState(questions));
        }
        return sectionStates.get(section);
    }

    function instructionElement(section) {
        let instruction = section.querySelector('[data-assessment-instruction]');
        if (!instruction) {
            instruction = document.createElement('p');
            instruction.className = 'assessment-instruction';
            instruction.dataset.assessmentInstruction = '';
            instruction.setAttribute('role', 'status');
            instruction.setAttribute('aria-live', 'polite');
            const submit = section.querySelector('[data-assessment-submit]');
            submit?.before(instruction);
        }
        return instruction;
    }

    function optionValue(option) {
        return option.dataset.value ?? option.textContent.trim();
    }

    function selectChoice(option) {
        const section = option.closest('[data-assessment-section]');
        const question = option.closest('[data-question-id]');
        if (!section || !question || section.hasAttribute('data-locked')) return;

        question.querySelectorAll('[data-answer]').forEach(candidate => {
            candidate.removeAttribute('data-selected');
            candidate.setAttribute('aria-pressed', 'false');
        });
        option.dataset.selected = '';
        option.setAttribute('aria-pressed', 'true');
        getSectionState(section).select(question.dataset.questionId, optionValue(option));
        instructionElement(section).textContent = '';
    }

    function syncTypedAnswers(section, state) {
        section.querySelectorAll('[data-question-id]').forEach(question => {
            const inputs = [...question.querySelectorAll('[data-answer-input]')];
            if (inputs.length === 1) state.select(question.dataset.questionId, inputs[0].value);
            if (inputs.length > 1) {
                state.select(question.dataset.questionId, inputs.map(input => input.value));
            }
        });
    }

    function renderFeedback(question, result) {
        const feedback = question.querySelector('[data-feedback]');
        if (!feedback) return;
        const answerLine = result.correct
            ? '<strong>Correct.</strong>'
            : `<strong>Not quite.</strong>${result.display ? ` Correct answer: <strong>${result.display}</strong>.` : ''}`;
        feedback.classList.add('show');
        feedback.classList.toggle('correct-feedback', result.correct);
        feedback.classList.toggle('incorrect-feedback', !result.correct);
        feedback.innerHTML = `${answerLine}${result.explanation ? `<div class="fb-explain">${result.explanation}</div>` : ''}`;
    }

    function renderReviewedSection(section, results) {
        section.dataset.locked = '';
        section.querySelectorAll('[data-question-id]').forEach(question => {
            const result = results[question.dataset.questionId];
            question.toggleAttribute('data-correct', result.correct);
            question.toggleAttribute('data-incorrect', !result.correct);
            question.querySelectorAll('[data-answer]').forEach(option => {
                option.disabled = true;
                if (option.dataset.correct === 'true') option.dataset.reviewedCorrect = '';
                if (option.hasAttribute('data-selected') && option.dataset.correct !== 'true') {
                    option.dataset.reviewedIncorrect = '';
                }
            });
            question.querySelectorAll('[data-answer-input]').forEach(input => {
                input.disabled = true;
            });
            renderFeedback(question, result);
        });

        const submit = section.querySelector('[data-assessment-submit]');
        const reset = section.querySelector('[data-assessment-reset]');
        if (submit) submit.hidden = true;
        if (reset) reset.hidden = false;
        instructionElement(section).textContent = 'Answers reviewed. Read each explanation, or try the section again.';
    }

    function submitSection(section) {
        const state = getSectionState(section);
        syncTypedAnswers(section, state);
        const outcome = state.submit();
        if (outcome.status === 'incomplete') {
            instructionElement(section).textContent = 'Answer every question before checking this section.';
            const question = section.querySelector(`[data-question-id="${outcome.firstUnanswered}"]`);
            if (question) {
                question.setAttribute('tabindex', '-1');
                question.focus();
            }
            return outcome;
        }
        renderReviewedSection(section, outcome.results);
        return outcome;
    }

    function resetSection(section) {
        getSectionState(section).reset();
        section.removeAttribute('data-locked');
        section.querySelectorAll('[data-question-id]').forEach(question => {
            question.removeAttribute('data-correct');
            question.removeAttribute('data-incorrect');
            question.removeAttribute('tabindex');
            question.querySelectorAll('[data-answer]').forEach(option => {
                option.disabled = false;
                option.removeAttribute('data-selected');
                option.removeAttribute('data-reviewed-correct');
                option.removeAttribute('data-reviewed-incorrect');
                option.setAttribute('aria-pressed', 'false');
            });
            question.querySelectorAll('[data-answer-input]').forEach(input => {
                input.disabled = false;
                input.value = '';
                input.style.removeProperty('border-color');
                input.style.removeProperty('background');
            });
            const feedback = question.querySelector('[data-feedback]');
            if (feedback) {
                feedback.classList.remove('show', 'correct-feedback', 'incorrect-feedback');
                feedback.innerHTML = '';
            }
        });

        const submit = section.querySelector('[data-assessment-submit]');
        const reset = section.querySelector('[data-assessment-reset]');
        if (submit) submit.hidden = false;
        if (reset) reset.hidden = true;
        instructionElement(section).textContent = '';
        const heading = section.querySelector('h2, h3, [data-assessment-heading]');
        if (heading) {
            heading.setAttribute('tabindex', '-1');
            heading.focus();
        }
    }

    function setDisclosureExpanded(toggle, panel, expanded) {
        toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        toggle.classList.toggle('open', expanded);
        panel.hidden = !expanded;
        panel.classList.toggle('open', expanded);
    }

    function handleClick(event) {
        const disclosure = event.target.closest('[data-disclosure-toggle]');
        if (disclosure) {
            const panelId = disclosure.getAttribute('aria-controls');
            const panel = panelId ? document.getElementById(panelId) : null;
            if (panel) {
                setDisclosureExpanded(
                    disclosure,
                    panel,
                    disclosure.getAttribute('aria-expanded') !== 'true'
                );
            }
            return;
        }

        const option = event.target.closest('[data-answer]');
        if (option) return selectChoice(option);

        const submit = event.target.closest('[data-assessment-submit]');
        if (submit) {
            const section = submit.closest('[data-assessment-section]');
            if (section) submitSection(section);
            return;
        }

        const reset = event.target.closest('[data-assessment-reset]');
        if (reset) {
            const section = reset.closest('[data-assessment-section]');
            if (section) resetSection(section);
        }
    }

    function init() {
        document.querySelectorAll('[data-disclosure-toggle]').forEach(toggle => {
            const panelId = toggle.getAttribute('aria-controls');
            const panel = panelId ? document.getElementById(panelId) : null;
            if (panel) {
                setDisclosureExpanded(toggle, panel, toggle.getAttribute('aria-expanded') === 'true');
            }
        });
        document.addEventListener('click', handleClick);
    }

    return {
        createSectionState,
        evaluateQuestion,
        isQuestionAnswered,
        normalizeTypedAnswer,
        resetSection,
        setDisclosureExpanded,
        submitSection,
        init
    };
})();

window.LessonAssessment = LessonAssessment;

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
    LessonAssessment.init();

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
