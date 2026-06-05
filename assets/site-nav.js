(function () {
  const script = document.currentScript;
  const root = script && script.dataset.siteRoot ? script.dataset.siteRoot : '';
  const resources = window.MJR_RESOURCES || [];
  const groups = window.MJR_GROUPS || [];

  function normalizePath(path) {
    return decodeURIComponent(path || '')
      .replace(/\\/g, '/')
      .replace(/^\/+/, '')
      .replace(/^\.\//, '')
      .toLowerCase();
  }

  function currentResourcePath() {
    const depth = (root.match(/\.\.\//g) || []).length;
    const parts = normalizePath(window.location.pathname).split('/').filter(Boolean);
    return parts.slice(-(depth + 1)).join('/');
  }

  function href(path) {
    return root + path;
  }

  function groupLabel(groupId) {
    const group = groups.find(item => item.id === groupId);
    return group ? group.label : 'Section';
  }

  function byPath(path) {
    const normalized = normalizePath(path);
    return resources.find(item => normalizePath(item.path) === normalized);
  }

  function sequenceNeighbor(current, offset) {
    if (!current || !current.sequenceKey) return null;
    return resources.find(item =>
      item.sequenceKey === current.sequenceKey &&
      item.sequenceIndex === current.sequenceIndex + offset
    ) || null;
  }

  function link(label, url, className) {
    const anchor = document.createElement('a');
    anchor.className = className || 'mjr-nav-link';
    anchor.href = url;
    anchor.textContent = label;
    return anchor;
  }

  function disabled(label) {
    const span = document.createElement('span');
    span.className = 'mjr-nav-disabled';
    span.textContent = label;
    return span;
  }

  function syncHeight(nav) {
    document.documentElement.style.setProperty('--mjr-nav-height', `${nav.offsetHeight}px`);
  }

  function isNativeInteractive(element) {
    return ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'SUMMARY'].includes(element.tagName);
  }

  function enhanceLegacyInteractiveElements() {
    document.querySelectorAll('[onclick], .mc-option').forEach(element => {
      if (isNativeInteractive(element)) return;

      if (!element.hasAttribute('role')) element.setAttribute('role', 'button');
      if (!element.hasAttribute('tabindex')) element.setAttribute('tabindex', '0');

      element.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        element.click();
      });
    });
  }

  function buildNav() {
    const current = byPath(currentResourcePath());
    if (!current) return;

    document.body.classList.add('mjr-has-resource-nav');

    const nav = document.createElement('nav');
    nav.className = 'mjr-resource-nav';
    nav.setAttribute('aria-label', 'Resource navigation');

    const inner = document.createElement('div');
    inner.className = 'mjr-nav-inner';
    nav.appendChild(inner);

    const brand = link('My Japanese Reviewers', href('index.html'), 'mjr-nav-brand');
    const mark = document.createElement('span');
    mark.className = 'mjr-nav-mark';
    mark.textContent = '日';
    brand.prepend(mark);
    inner.appendChild(brand);

    const links = document.createElement('div');
    links.className = 'mjr-nav-links';
    links.appendChild(link('Home', href('index.html')));
    links.appendChild(link('All Resources', href('index.html#all')));
    links.appendChild(link(groupLabel(current.group), href(`index.html#${current.group}`)));
    inner.appendChild(links);

    const currentLabel = document.createElement('span');
    currentLabel.className = 'mjr-nav-current';
    currentLabel.textContent = current.sequenceKey
      ? `${current.groupLabel} ${current.sequenceIndex}/${current.sequenceTotal}`
      : current.groupLabel;
    inner.appendChild(currentLabel);

    const spacer = document.createElement('span');
    spacer.className = 'mjr-nav-spacer';
    inner.appendChild(spacer);

    if (current.sequenceKey) {
      const pager = document.createElement('div');
      pager.className = 'mjr-nav-pager';
      const previous = sequenceNeighbor(current, -1);
      const next = sequenceNeighbor(current, 1);
      pager.appendChild(previous ? link('Previous', href(previous.path)) : disabled('Previous'));
      pager.appendChild(next ? link('Next', href(next.path)) : disabled('Next'));
      inner.appendChild(pager);
    }

    if (current.related && current.related.length) {
      const related = document.createElement('div');
      related.className = 'mjr-nav-related';
      current.related.slice(0, 2).forEach(item => {
        related.appendChild(link(item.label, href(item.path)));
      });
      inner.appendChild(related);
    }

    document.body.prepend(nav);
    syncHeight(nav);

    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(() => syncHeight(nav));
      observer.observe(nav);
    } else {
      window.addEventListener('resize', () => syncHeight(nav));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      enhanceLegacyInteractiveElements();
      buildNav();
    });
  } else {
    enhanceLegacyInteractiveElements();
    buildNav();
  }
})();
