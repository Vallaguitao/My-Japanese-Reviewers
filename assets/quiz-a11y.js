(function () {
  const liveSelectors = [
    '.score-banner',
    '.feedback',
    '.feedback-card',
    '.result-card',
    '#score-banner',
    '#final-screen'
  ];
  const stateSelectors = [
    '.nav-dot',
    '.tab',
    '.tab-btn',
    '.choice',
    '.choice-btn',
    '.option-btn',
    '.mc-option'
  ];
  let queued = false;

  function textOf(node) {
    return (node.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function baseLabel(node) {
    if (!node.dataset.a11yBaseLabel) {
      node.dataset.a11yBaseLabel = node.getAttribute('aria-label') || textOf(node);
    }
    return node.dataset.a11yBaseLabel;
  }

  function setAttr(node, name, value) {
    if (node.getAttribute(name) !== value) node.setAttribute(name, value);
  }

  function removeAttr(node, name) {
    if (node.hasAttribute(name)) node.removeAttribute(name);
  }

  function setChoiceState(node) {
    const correct = node.classList.contains('correct') || node.classList.contains('correct-reveal');
    const wrong = node.classList.contains('wrong') || node.classList.contains('wrong-reveal') || node.classList.contains('incorrect');
    const selected = node.classList.contains('selected');
    const disabled = node.disabled || node.classList.contains('locked');
    const label = baseLabel(node);

    setAttr(node, 'aria-pressed', selected ? 'true' : 'false');

    if (disabled) setAttr(node, 'aria-disabled', 'true');
    else removeAttr(node, 'aria-disabled');

    if (correct) setAttr(node, 'aria-label', `${label}. Correct answer.`);
    else if (wrong) setAttr(node, 'aria-label', `${label}. Incorrect answer. Review the explanation.`);
    else setAttr(node, 'aria-label', label);
  }

  function setNavigationState(node) {
    const active = node.classList.contains('active');

    if (node.classList.contains('nav-dot')) {
      if (active) setAttr(node, 'aria-current', 'step');
      else removeAttr(node, 'aria-current');
      return;
    }

    if (node.classList.contains('tab') || node.classList.contains('tab-btn')) {
      setAttr(node, 'aria-pressed', active ? 'true' : 'false');
    }
  }

  function enhance() {
    document.querySelectorAll(liveSelectors.join(',')).forEach(node => {
      if (!node.hasAttribute('aria-live')) setAttr(node, 'aria-live', 'polite');
      if (!node.hasAttribute('role')) setAttr(node, 'role', 'status');
    });

    document.querySelectorAll(stateSelectors.join(',')).forEach(node => {
      if (node.matches('button') && !node.hasAttribute('type')) setAttr(node, 'type', 'button');
      if (node.matches('.choice, .choice-btn, .option-btn, .mc-option')) setChoiceState(node);
      if (node.matches('.nav-dot, .tab, .tab-btn')) setNavigationState(node);
    });
  }

  function scheduleEnhance() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      enhance();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhance);
  } else {
    enhance();
  }

  new MutationObserver(scheduleEnhance).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'disabled']
  });
})();
