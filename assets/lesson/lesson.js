(function () {
  let currentSlide = 1;
  let touchStartX = 0;
  let touchStartY = 0;

  function slideNumbers() {
    return Array.from(document.querySelectorAll('[data-slide]'))
      .map(slide => Number(slide.dataset.slide))
      .filter(Number.isFinite)
      .sort((a, b) => a - b);
  }

  function totalSlides() {
    const numbers = slideNumbers();
    return numbers.length ? numbers[numbers.length - 1] : 1;
  }

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  }

  function updateSlide(options) {
    const total = totalSlides();
    currentSlide = Math.min(Math.max(currentSlide, 1), total);

    document.querySelectorAll('.slide').forEach(slide => {
      slide.classList.remove('active');
    });

    const active = document.querySelector(`[data-slide="${currentSlide}"]`);
    if (active) active.classList.add('active');

    setText('currentSlide', currentSlide);
    setText('totalSlides', total);

    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
      const progress = total > 1 ? ((currentSlide - 1) / (total - 1)) * 100 : 100;
      progressFill.style.width = `${progress}%`;
    }

    const previousButton = document.getElementById('prevBtn');
    if (previousButton) previousButton.disabled = currentSlide === 1;

    const nextButton = document.getElementById('nextBtn');
    if (nextButton) nextButton.disabled = currentSlide === total;

    if (!options || options.scroll !== false) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function nextSlide() {
    if (currentSlide < totalSlides()) {
      currentSlide += 1;
      updateSlide();
    }
  }

  function prevSlide() {
    if (currentSlide > 1) {
      currentSlide -= 1;
      updateSlide();
    }
  }

  function goToSlide(slideNumber) {
    currentSlide = Number(slideNumber) || 1;
    updateSlide();
  }

  function restartPresentation() {
    currentSlide = 1;
    updateSlide();

    if (typeof window.MJRLessonOnRestart === 'function') {
      window.MJRLessonOnRestart();
    }
  }

  function togglePanel(button) {
    if (!button) return;

    const content = button.nextElementSibling;
    button.classList.toggle('open');
    if (content) content.classList.toggle('open');
  }

  function isTypingTarget(target) {
    if (!target || target === document.body) return false;
    if (target.isContentEditable) return true;
    return Boolean(target.closest('input, textarea, select, button, [contenteditable="true"]'));
  }

  function onKeyDown(event) {
    if (isTypingTarget(event.target)) return;

    if (event.key === 'ArrowRight' || event.key === ' ') {
      event.preventDefault();
      nextSlide();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      prevSlide();
    }
  }

  function onTouchStart(event) {
    const touch = event.changedTouches[0];
    touchStartX = touch.screenX;
    touchStartY = touch.screenY;
  }

  function onTouchEnd(event) {
    const touch = event.changedTouches[0];
    const diffX = touchStartX - touch.screenX;
    const diffY = touchStartY - touch.screenY;

    if (Math.abs(diffX) < 50 || Math.abs(diffX) < Math.abs(diffY) * 1.2) return;
    if (diffX > 0) nextSlide();
    else prevSlide();
  }

  const API = {
    updateSlide,
    nextSlide,
    prevSlide,
    goToSlide,
    restartPresentation,
    toggleRef: togglePanel,
    toggleMNN: togglePanel
  };

  window.MJRLesson = API;
  Object.assign(window, API);

  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('touchstart', onTouchStart, { passive: true });
  document.addEventListener('touchend', onTouchEnd, { passive: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => updateSlide());
  } else {
    updateSlide();
  }
})();
