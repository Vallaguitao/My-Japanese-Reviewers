(function () {
  const DEFAULT_GROUP = {
    id: 'all',
    label: 'All Resources',
    shortLabel: 'All',
    description: 'Every linked lesson, reviewer, quiz, and practice page.'
  };

  const GROUP_ALIASES = new Map([
    ['n5-vocabulary', 'vocabulary'],
    ['n4-vocabulary', 'vocabulary'],
    ['n5-kanji', 'kanji'],
    ['n4-kanji', 'kanji'],
    ['n4-lessons', 'n4-book-1'],
    ['quizzes-exams', 'quizzes']
  ]);

  const STAT_GROUPS = {
    lessons: new Set(['n5-lessons', 'n4-book-1', 'n4-book-2']),
    practice: new Set(['vocabulary', 'kanji', 'specialized-lessons']),
    tests: new Set(['quizzes', 'targeted-quiz', 'jlpt-mock', 'jft-mock'])
  };

  const resources = Array.isArray(window.MJR_RESOURCES) ? window.MJR_RESOURCES : [];
  const sourceGroups = Array.isArray(window.MJR_GROUPS) ? window.MJR_GROUPS : [];
  const groups = sourceGroups.length ? sourceGroups : [DEFAULT_GROUP];
  const groupMap = new Map(groups.map(group => [group.id, group]));

  const els = {
    grid: document.getElementById('resourceGrid'),
    searchInput: document.getElementById('resourceSearch'),
    filterButtons: document.getElementById('filterButtons'),
    sideNav: document.getElementById('sideNav'),
    visibleCount: document.getElementById('visibleCount'),
    emptyState: document.getElementById('emptyState'),
    activeGroupTitle: document.getElementById('activeGroupTitle'),
    activeGroupDescription: document.getElementById('activeGroupDescription'),
    sidebar: document.getElementById('sidebar'),
    hamburger: document.getElementById('hamburger'),
    overlay: document.getElementById('sidebarOverlay')
  };

  let activeGroup = 'all';
  let lastFocusedBeforeMenu = null;

  function text(value) {
    return String(value || '').trim();
  }

  function searchText(item) {
    return [
      item.title,
      item.description,
      item.type,
      item.groupLabel,
      item.path,
      ...(Array.isArray(item.tags) ? item.tags : [])
    ].join(' ').toLowerCase();
  }

  function getGroup(groupId) {
    return groupMap.get(groupId) || groupMap.get('all') || groups[0] || DEFAULT_GROUP;
  }

  function normalizeGroup(groupId) {
    const candidate = GROUP_ALIASES.get(groupId) || groupId;
    return groupMap.has(candidate) ? candidate : 'all';
  }

  function setText(node, value) {
    if (node) node.textContent = value;
  }

  function setMenuOpen(isOpen, options = {}) {
    const wasOpen = els.sidebar && els.sidebar.classList.contains('open');

    els.sidebar?.classList.toggle('open', isOpen);
    els.hamburger?.classList.toggle('open', isOpen);
    els.overlay?.classList.toggle('open', isOpen);
    els.hamburger?.setAttribute('aria-expanded', String(isOpen));
    els.overlay?.setAttribute('aria-hidden', String(!isOpen));

    if (isOpen) {
      lastFocusedBeforeMenu = document.activeElement;
      els.sidebar?.querySelector('[data-group-filter]')?.focus();
      return;
    }

    // Only restore focus for a menu that was actually opened by this controller.
    if (wasOpen && options.restoreFocus !== false && lastFocusedBeforeMenu) {
      lastFocusedBeforeMenu.focus();
    }
    lastFocusedBeforeMenu = null;
  }

  function actionLabel(item) {
    if (item.actionLabel) return item.actionLabel;
    if (item.type === 'Lesson') return 'Open Lesson';
    if (item.type === 'Vocabulary' || item.type === 'Reviewer') return 'Review Vocabulary';
    if (item.type === 'Tool') return 'Open Tool';
    if (item.type === 'Mock Exam' || item.type === 'Exam') return 'Take Mock';
    if (text(item.type).includes('Quiz')) return 'Start Quiz';
    return 'Open Resource';
  }

  function createTag(className, label) {
    const tag = document.createElement('span');
    tag.className = className;
    tag.textContent = label;
    return tag;
  }

  function createLink(className, href, label) {
    const link = document.createElement('a');
    link.className = className;
    link.href = href;
    link.textContent = label;
    return link;
  }

  function createButton(group, className) {
    const button = document.createElement('button');
    button.className = className;
    button.type = 'button';
    button.dataset.groupFilter = group.id;
    button.setAttribute('aria-pressed', 'false');

    if (className === 'nav-item') {
      button.append(createTag('nav-icon', group.shortLabel || group.label));
      button.append(document.createTextNode(group.label));
    } else {
      button.textContent = group.label;
    }

    return button;
  }

  function createResourceCard(item) {
    const card = document.createElement('article');
    card.className = 'resource-card';
    card.dataset.group = text(item.group);

    const top = document.createElement('div');
    top.className = 'resource-card-top';
    top.append(
      createTag('type-pill', text(item.type)),
      createTag('group-pill', text(item.groupLabel))
    );

    const title = document.createElement('h3');
    title.textContent = text(item.title);

    const description = document.createElement('p');
    description.textContent = text(item.description);

    const meta = document.createElement('div');
    meta.className = 'meta';
    (Array.isArray(item.tags) ? item.tags : []).slice(0, 3).forEach(tag => {
      meta.append(createTag('status-tag', tag));
    });

    const actions = document.createElement('div');
    actions.className = 'card-actions';
    actions.append(createLink('card-button', item.path, actionLabel(item)));

    const related = Array.isArray(item.related) ? item.related[0] : null;
    if (related) {
      actions.append(createLink('card-secondary', related.path, related.label));
    }

    // Building nodes directly avoids HTML escaping bugs while keeping existing classes.
    card.append(top, title, description, meta, actions);
    return card;
  }

  function resourceMatches(item, query) {
    const matchesGroup = activeGroup === 'all' || item.group === activeGroup;
    const matchesSearch = !query || (item.searchable || searchText(item)).includes(query);
    return matchesGroup && matchesSearch;
  }

  function updateActiveButtons() {
    document.querySelectorAll('[data-group-filter]').forEach(button => {
      const isActive = button.dataset.groupFilter === activeGroup;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  }

  function render() {
    const query = text(els.searchInput?.value).toLowerCase();
    const matches = resources.filter(item => resourceMatches(item, query));
    const fragment = document.createDocumentFragment();

    matches.forEach(item => {
      fragment.append(createResourceCard(item));
    });

    els.grid?.replaceChildren(fragment);
    setText(els.visibleCount, `${matches.length} resource${matches.length === 1 ? '' : 's'}`);
    if (els.emptyState) els.emptyState.style.display = matches.length ? 'none' : 'block';
  }

  function setActiveGroup(groupId, updateHash = true) {
    activeGroup = normalizeGroup(groupId);

    const group = getGroup(activeGroup);
    setText(els.activeGroupTitle, group.label);
    setText(els.activeGroupDescription, group.description);
    updateActiveButtons();

    if (updateHash && window.location.hash !== `#${activeGroup}`) {
      history.replaceState(null, '', `#${activeGroup}`);
    }

    render();
    setMenuOpen(false, { restoreFocus: false });
  }

  function renderGroups() {
    const filterFragment = document.createDocumentFragment();
    const navFragment = document.createDocumentFragment();

    groups.forEach(group => {
      filterFragment.append(createButton(group, 'filter-btn'));
      navFragment.append(createButton(group, 'nav-item'));
    });

    els.filterButtons?.replaceChildren(filterFragment);
    els.sideNav?.replaceChildren(navFragment);
  }

  function updateStats() {
    const stats = resources.reduce((counts, item) => {
      Object.entries(STAT_GROUPS).forEach(([key, groupIds]) => {
        if (groupIds.has(item.group)) counts[key] += 1;
      });
      return counts;
    }, { total: resources.length, lessons: 0, practice: 0, tests: 0 });

    Object.entries(stats).forEach(([key, value]) => {
      setText(document.querySelector(`[data-stat="${key}"]`), value);
    });
  }

  function handleGroupClick(event) {
    const button = event.target.closest('[data-group-filter]');
    if (!button) return;
    setActiveGroup(button.dataset.groupFilter);
  }

  function bindEvents() {
    els.searchInput?.addEventListener('input', render);
    els.filterButtons?.addEventListener('click', handleGroupClick);
    els.sideNav?.addEventListener('click', handleGroupClick);
    els.hamburger?.addEventListener('click', () => {
      const isOpen = els.sidebar?.classList.contains('open');
      setMenuOpen(!isOpen);
    });
    els.overlay?.addEventListener('click', () => setMenuOpen(false));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && els.sidebar?.classList.contains('open')) {
        setMenuOpen(false);
      }
    });
    window.addEventListener('hashchange', () => {
      setActiveGroup(normalizeGroup(window.location.hash.slice(1)), false);
    });
  }

  function initialize() {
    renderGroups();
    updateStats();
    bindEvents();
    // Hash aliases keep older shared links working after the catalog groups changed.
    setActiveGroup(normalizeGroup(window.location.hash.slice(1)), false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();
