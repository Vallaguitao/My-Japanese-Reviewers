/**
 * Dynamic DRY Lesson Renderer Engine
 * Parses JSON lesson specifications, dynamically generates presentation slides,
 * manages slide deck navigation, and binds Japanese TTS Web Speech API audio.
 */
(function () {
  'use strict';

  let currentSlide = 1;
  let totalSlides = 0;

  // Extract lesson parameter from URL (e.g. ?lesson=n5_lesson_1)
  const urlParams = new URLSearchParams(window.location.search);
  const lessonId = urlParams.get('lesson') || 'n5_lesson_1';

  /**
   * Fetch lesson JSON data or fallback to offline script data (supports file:// protocol)
   */
  function loadAndRenderLesson() {
    const container = document.getElementById('slide-container');
    if (!container) return;

    const globalKey = 'LESSON_DATA_' + lessonId.replace(/[^a-zA-Z0-9_]/g, '_');

    if (window[globalKey]) {
      renderLesson(window[globalKey]);
      return;
    }

    fetch(`Lessons/data/${lessonId}.json`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load lesson specification (${response.status} ${response.statusText})`);
        }
        return response.json();
      })
      .then(data => {
        renderLesson(data);
      })
      .catch(err => {
        console.warn('Fetch fallback to window data:', err);
        if (window[globalKey]) {
          renderLesson(window[globalKey]);
        } else {
          container.innerHTML = `
            <div class="slide active">
              <div class="content-card" style="text-align: center; padding: 40px 20px;">
                <h2 style="color: var(--error, #e53e3e); margin-bottom: 16px;">⚠️ Unable to Load Lesson</h2>
                <p style="color: var(--text-secondary); margin-bottom: 24px;">Could not fetch lesson spec for ID: <strong>${lessonId}</strong></p>
                <p style="font-size: 0.9rem; color: var(--text-muted);">${err.message}</p>
                <a href="index.html" class="start-btn" style="display: inline-block; margin-top: 24px; text-decoration: none;">Return to Home</a>
              </div>
            </div>
          `;
        }
      });
  }

  /**
   * Render presentation slides from lesson JSON object
   * @param {Object} lessonData
   */
  function renderLesson(lessonData) {
    const container = document.getElementById('slide-container');
    if (!container || !lessonData || !Array.isArray(lessonData.slides)) return;

    // Update Header Metadata
    const badgeEl = document.getElementById('lessonBadge');
    const titleEl = document.getElementById('lessonTitle');
    const breadcrumbEl = document.getElementById('breadcrumbLesson');
    const documentTitle = document.querySelector('title');

    const badgeText = lessonData.level ? `${lessonData.level} L${lessonData.lessonNumber || 1}` : `L${lessonData.lessonNumber || 1}`;
    if (badgeEl) badgeEl.textContent = badgeText;
    if (titleEl) titleEl.innerHTML = lessonData.title || `Lesson ${lessonData.lessonNumber || 1}`;
    if (breadcrumbEl) breadcrumbEl.textContent = lessonData.title || `Lesson ${lessonData.lessonNumber || 1}`;
    if (documentTitle) documentTitle.textContent = `${lessonData.title || 'Lesson'} | Japanese Reviewers`;

    // Render HTML for each slide
    totalSlides = lessonData.slides.length;
    let slidesHtml = '';

    lessonData.slides.forEach((slide, index) => {
      const slideNum = index + 1;
      const isActive = slideNum === 1 ? ' active' : '';

      if (slide.type === 'title') {
        slidesHtml += renderTitleSlide(slide, lessonData, slideNum, isActive);
      } else if (slide.type === 'grammar') {
        slidesHtml += renderGrammarSlide(slide, slideNum, isActive);
      } else if (slide.type === 'vocabulary') {
        slidesHtml += renderVocabularySlide(slide, slideNum, isActive);
      } else {
        // Fallback for custom or unrecognized slide types
        slidesHtml += renderGenericSlide(slide, slideNum, isActive);
      }
    });

    container.innerHTML = slidesHtml;

    // Initialize Layout & Controls
    initLessonLayout();
    updateSlide();

    // Automatically trigger Japanese TTS binding for all rendered ruby/jp-speech elements
    if (typeof window.bindJapaneseTTS === 'function') {
      window.bindJapaneseTTS();
    }
  }

  function renderTitleSlide(slide, lessonData, slideNum, isActive) {
    const bookName = slide.book || lessonData.book || 'みんなの日本語 初級 I';
    const titleJpHtml = slide.reading
      ? `<ruby>${slide.titleJp || ''}<rt>${slide.reading}</rt></ruby>`
      : (slide.titleJp || '');

    const grammarItems = (slide.grammarSummary || []).map((item, idx) => `
      <div class="grammar-item">
        <span class="grammar-number">${idx + 1}</span>
        <span>${item}</span>
      </div>
    `).join('');

    return `
      <div class="slide${isActive}" data-slide="${slideNum}">
        <div class="title-slide">
          <div class="book-badge">${bookName}</div>
          <h1>${lessonData.title || slide.title || 'Lesson 1'}</h1>
          <div class="lesson-title-jp">${titleJpHtml} ${slide.subtitle ? `— ${slide.subtitle}` : ''}</div>
          <div class="lesson-subtitle">${slide.description || lessonData.subtitle || ''}</div>

          <div class="title-card">
            <h2>📚 Grammar Points</h2>
            <div class="grammar-list">
              ${grammarItems}
            </div>
          </div>

          <button class="start-btn pulse" onclick="nextSlide()">
            🎯 Let's Begin!
          </button>
        </div>
      </div>
    `;
  }

  function renderGrammarSlide(slide, slideNum, isActive) {
    const examplesHtml = (slide.examples || []).map((ex, i) => `
      <div class="example-box">
        <div class="example-label">📝 Example ${i + 1}</div>
        <div class="example-japanese">${ex.ruby || ex.jp}</div>
        <div class="example-english">${ex.en}</div>
      </div>
    `).join('');

    return `
      <div class="slide${isActive}" data-slide="${slideNum}">
        <div class="content-card">
          <div class="slide-header">
            <span class="grammar-badge">${slide.badge || `Grammar ${slideNum - 1}`}</span>
            <div>
              <h2>${slide.title}</h2>
              <span class="jp-title">${slide.jpTitle || ''}</span>
            </div>
          </div>

          ${slide.structure ? `
            <div class="structure-box">
              <div class="label">📐 Structure</div>
              <div class="structure-formula">${slide.structure}</div>
            </div>
          ` : ''}

          ${slide.explanation ? `
            <div class="explanation">
              <h3>📖 How it works</h3>
              <p>${slide.explanation}</p>
            </div>
          ` : ''}

          ${examplesHtml}

          ${slide.keyPoint ? `
            <div class="key-point">
              <strong>💡 Key Point:</strong> ${slide.keyPoint}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  function renderVocabularySlide(slide, slideNum, isActive) {
    const vocabCardsHtml = (slide.vocabList || []).map(v => `
      <div class="vocab-card jp-speech" data-jp-audio="${v.jp}">
        <div class="vocab-jp">
          <ruby>${v.jp}<rt>${v.furigana || ''}</rt></ruby>
        </div>
        ${v.romaji ? `<div class="vocab-romaji">${v.romaji}</div>` : ''}
        <div class="vocab-en">${v.en}</div>
      </div>
    `).join('');

    return `
      <div class="slide${isActive}" data-slide="${slideNum}">
        <div class="content-card">
          <div class="slide-header">
            <span class="grammar-badge">${slide.badge || 'Vocabulary'}</span>
            <div>
              <h2>${slide.title || 'Lesson Vocabulary'}</h2>
              <span class="jp-title">${slide.jpTitle || ''}</span>
            </div>
          </div>

          <div class="vocab-grid">
            ${vocabCardsHtml}
          </div>
        </div>
      </div>
    `;
  }

  function renderGenericSlide(slide, slideNum, isActive) {
    return `
      <div class="slide${isActive}" data-slide="${slideNum}">
        <div class="content-card">
          <div class="slide-header">
            <span class="grammar-badge">${slide.badge || `Slide ${slideNum}`}</span>
            <div>
              <h2>${slide.title || `Slide ${slideNum}`}</h2>
            </div>
          </div>
          <div class="explanation">
            <p>${slide.content || ''}</p>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Build sidebar table of contents and mobile dropdown select
   */
  function initLessonLayout() {
    const presentation = document.querySelector('.presentation');
    if (!presentation) return;

    // Remove existing sidebar wrapper if present to avoid duplication on re-renders
    const existingWrapper = document.querySelector('.lesson-layout-wrapper');
    if (existingWrapper) {
      existingWrapper.replaceWith(presentation);
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'lesson-layout-wrapper';

    const sidebar = document.createElement('aside');
    sidebar.className = 'lesson-sidebar';
    sidebar.innerHTML = `
      <div class="sidebar-header">
        <span class="sidebar-title-jp">目次</span>
        <span class="sidebar-title-en">Table of Contents</span>
      </div>
      <ul class="sidebar-list"></ul>
    `;

    presentation.parentNode.insertBefore(wrapper, presentation);
    wrapper.appendChild(sidebar);
    wrapper.appendChild(presentation);

    const sidebarList = sidebar.querySelector('.sidebar-list');
    const slides = document.querySelectorAll('.slide');

    let selectHtml = `<select id="mobileSlideSelect" class="mobile-slide-select" onchange="goToSlide(Number(this.value))">`;

    slides.forEach((slide, index) => {
      const slideNum = index + 1;
      let title = `Slide ${slideNum}`;

      const header = slide.querySelector('.slide-header h2') ||
                     slide.querySelector('.title-slide h1');

      if (header) {
        const tempNode = header.cloneNode(true);
        tempNode.querySelectorAll('rt').forEach(rt => rt.remove());
        title = tempNode.textContent.trim();
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

      selectHtml += `<option value="${slideNum}">${slideNum}. ${title}</option>`;
    });

    selectHtml += `</select>`;

    const progressText = document.querySelector('.progress-text');
    if (progressText) {
      const existingSelect = progressText.querySelector('.mobile-slide-select-container');
      if (existingSelect) existingSelect.remove();

      const selectContainer = document.createElement('span');
      selectContainer.className = 'mobile-slide-select-container';
      selectContainer.innerHTML = selectHtml;
      progressText.insertBefore(selectContainer, progressText.firstChild);
    }
  }

  /**
   * Update current slide state, progress fill meter, buttons, and sidebar
   */
  function updateSlide() {
    document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
    const active = document.querySelector(`[data-slide="${currentSlide}"]`);
    if (active) active.classList.add('active');

    const curEl = document.getElementById('currentSlide');
    const totEl = document.getElementById('totalSlides');
    if (curEl) curEl.textContent = currentSlide;
    if (totEl) totEl.textContent = totalSlides;

    const progressFill = document.getElementById('progressFill');
    if (progressFill && totalSlides > 1) {
      const progress = ((currentSlide - 1) / (totalSlides - 1)) * 100;
      progressFill.style.width = progress + '%';
    }

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (prevBtn) prevBtn.disabled = currentSlide === 1;
    if (nextBtn) nextBtn.disabled = currentSlide === totalSlides;

    document.querySelectorAll('.sidebar-item').forEach(item => {
      if (Number(item.getAttribute('data-slide-target')) === currentSlide) {
        item.classList.add('active');
        item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else {
        item.classList.remove('active');
      }
    });

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

  // Expose slide navigation functions globally for inline onclick handlers
  window.nextSlide = nextSlide;
  window.prevSlide = prevSlide;
  window.goToSlide = goToSlide;

  // Keyboard arrow listeners
  document.addEventListener('keydown', function (e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    }
  });

  // Initialize engine on DOMReady
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAndRenderLesson);
  } else {
    loadAndRenderLesson();
  }
})();
