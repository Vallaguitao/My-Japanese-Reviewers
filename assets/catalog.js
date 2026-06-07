(function () {
  const DEFAULT_GROUP = {
    id: 'all',
    label: 'All Resources',
    shortLabel: 'All',
    description: 'Every linked lesson, reviewer, quiz, and practice page.'
  };

  const FILTERS = [
    {
      id: 'all',
      label: 'Compact Directory',
      shortLabel: 'Home',
      description: 'Search and filter every linked resource without scanning large cards.',
      groups: null
    },
    {
      id: 'lessons',
      label: 'Lessons',
      shortLabel: 'Lessons',
      description: 'N5, N4, and specialized lesson pages for targeted review.',
      groups: ['n5-lessons', 'n4-book-1', 'n4-book-2', 'specialized-lessons']
    },
    {
      id: 'vocabulary',
      label: 'Vocabulary',
      shortLabel: 'Vocab',
      description: 'Lesson vocabulary sets and vocabulary reviewer tools.',
      groups: ['vocabulary']
    },
    {
      id: 'kanji',
      label: 'Kanji',
      shortLabel: 'Kanji',
      description: 'Kanji flashcards, explorer, and kanji review pages.',
      groups: ['kanji']
    },
    {
      id: 'quizzes',
      label: 'Core Quizzes',
      shortLabel: 'Quiz',
      description: 'Grammar, reading, kanji, and expression quizzes.',
      groups: ['quizzes']
    },
    {
      id: 'targeted-quiz',
      label: 'Targeted Quiz',
      shortLabel: 'Target',
      description: 'Focused drills for counters, adjectives, and verb conjugation.',
      groups: ['targeted-quiz']
    },
    {
      id: 'jlpt-mock',
      label: 'JLPT Mock',
      shortLabel: 'JLPT',
      description: 'JLPT-style exam simulation and mixed N5/N4 review.',
      groups: ['jlpt-mock']
    },
    {
      id: 'jft-mock',
      label: 'JFT Mock',
      shortLabel: 'JFT',
      description: 'JFT-style mock exam sets for practical daily-life Japanese.',
      groups: ['jft-mock']
    }
  ];

  const GROUP_ALIASES = new Map([
    ['dashboard', 'all'],
    ['home', 'all'],
    ['n5-vocabulary', 'vocabulary'],
    ['n4-vocabulary', 'vocabulary'],
    ['n5-kanji', 'kanji'],
    ['n4-kanji', 'kanji'],
    ['n4-lessons', 'lessons'],
    ['quizzes-exams', 'quizzes']
  ]);

  const SEQUENCE_ROUTES = new Map([
    ['n5-lessons', { filter: 'lessons', sequenceKey: 'n5-lessons' }],
    ['n4-book-1', { filter: 'lessons', sequenceKey: 'n4-book-1' }],
    ['n4-book-2', { filter: 'lessons', sequenceKey: 'n4-book-2' }],
    ['specialized-lessons', { filter: 'lessons', sequenceKey: 'specialized-lessons' }]
  ]);

  const STAT_GROUPS = {
    lessons: new Set(['n5-lessons', 'n4-book-1', 'n4-book-2']),
    practice: new Set(['vocabulary', 'kanji', 'specialized-lessons']),
    tests: new Set(['quizzes', 'targeted-quiz', 'jlpt-mock', 'jft-mock'])
  };

  const QUICK_SEQUENCES = [
    { id: 'n5-lessons', label: 'N5 Lessons' },
    { id: 'n4-book-1', label: 'N4 Book 1' },
    { id: 'n4-book-2', label: 'N4 Book 2' },
    { id: 'vocabulary', label: 'N5 Vocabulary' }
  ];

  const LESSON_SEQUENCES = [
    { id: 'all', label: 'All lesson courses' },
    { id: 'n5-lessons', label: 'N5 Lessons' },
    { id: 'n4-book-1', label: 'N4 Book 1' },
    { id: 'n4-book-2', label: 'N4 Book 2' },
    { id: 'specialized-lessons', label: 'Specialized Lessons' }
  ];

  const VOCABULARY_SEQUENCES = [
    { id: 'all', label: 'All vocabulary' },
    { id: 'vocabulary', label: 'N5 Vocabulary' }
  ];

  const FEATURED_RESOURCE_IDS = [
    'jlpt-n5-n4-mock',
    'jft-mix',
    'verb-conjugation-quiz',
    'n5-grammar-reviewer',
    'kanji-reviewer',
    'n5-reading-reviewer'
  ];

  const resources = Array.isArray(window.MJR_RESOURCES) ? window.MJR_RESOURCES : [];
  const sourceGroups = Array.isArray(window.MJR_GROUPS) ? window.MJR_GROUPS : [];
  const groups = sourceGroups.length ? sourceGroups : [DEFAULT_GROUP];
  const groupMap = new Map(groups.map(group => [group.id, group]));
  const filterMap = new Map(FILTERS.map(filter => [filter.id, filter]));
  const resourceMap = new Map(resources.map(item => [item.id, item]));

  const els = {
    featuredGrid: document.getElementById('featuredGrid'),
    resourceList: document.getElementById('resourceList'),
    searchInput: document.getElementById('resourceSearch'),
    categorySelect: document.getElementById('categorySelect'),
    sequenceControls: document.getElementById('sequenceControls'),
    sequenceFilter: document.getElementById('sequenceFilter'),
    numberFilter: document.getElementById('numberFilter'),
    quickCourseSelect: document.getElementById('quickCourseSelect'),
    quickLessonSelect: document.getElementById('quickLessonSelect'),
    quickLessonLink: document.getElementById('quickLessonLink'),
    quickRelatedLink: document.getElementById('quickRelatedLink'),
    sideNav: document.getElementById('sideNav'),
    visibleCount: document.getElementById('visibleCount'),
    emptyState: document.getElementById('emptyState'),
    activeGroupTitle: document.getElementById('activeGroupTitle'),
    activeGroupDescription: document.getElementById('activeGroupDescription'),
    sidebar: document.getElementById('sidebar'),
    hamburger: document.getElementById('hamburger'),
    overlay: document.getElementById('sidebarOverlay')
  };

  let activeFilter = 'all';
  let activeSequenceKey = 'all';
  let activeSequenceIndex = 'all';
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

  function setText(node, value) {
    if (node) node.textContent = value;
  }

  function getFilter(filterId) {
    return filterMap.get(filterId) || filterMap.get('all') || FILTERS[0];
  }

  function getGroupLabel(groupId) {
    return text(groupMap.get(groupId)?.label) || text(groupId);
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

  function createOption(value, label) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    return option;
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
      els.sidebar?.querySelector('[data-filter]')?.focus();
      return;
    }

    if (wasOpen && options.restoreFocus !== false && lastFocusedBeforeMenu) {
      lastFocusedBeforeMenu.focus();
    }
    lastFocusedBeforeMenu = null;
  }

  function createNavButton(filter) {
    const button = document.createElement('button');
    button.className = 'nav-item';
    button.type = 'button';
    button.dataset.filter = filter.id;
    button.setAttribute('aria-pressed', 'false');
    button.append(createTag('nav-icon', filter.shortLabel || filter.label));
    button.append(document.createTextNode(filter.label));
    return button;
  }

  function createFeatureCard(item) {
    const card = document.createElement('article');
    card.className = 'feature-card';

    const top = document.createElement('div');
    top.className = 'feature-card-top';
    top.append(
      createTag('type-pill', text(item.type)),
      createTag('group-pill', text(item.groupLabel))
    );

    const title = document.createElement('h3');
    title.textContent = text(item.title);

    const description = document.createElement('p');
    description.textContent = text(item.description);

    const meta = document.createElement('div');
    meta.className = 'row-meta';
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

    card.append(top, title, description, meta, actions);
    return card;
  }

  function createResourceRow(item) {
    const row = document.createElement('article');
    row.className = 'resource-row';
    row.dataset.group = text(item.group);

    const main = document.createElement('div');
    main.className = 'resource-row-main';

    const titleRow = document.createElement('div');
    titleRow.className = 'resource-row-title';
    const title = document.createElement('h3');
    title.textContent = text(item.title);
    titleRow.append(title, createTag('type-pill', text(item.type)));

    const meta = document.createElement('div');
    meta.className = 'row-meta';
    meta.append(createTag('group-pill', getGroupLabel(item.group)));
    (Array.isArray(item.tags) ? item.tags : []).slice(0, 3).forEach(tag => {
      meta.append(createTag('status-tag', tag));
    });

    main.append(titleRow, meta);
    row.append(main, createLink('row-button', item.path, actionLabel(item)));
    return row;
  }

  function routeFromHash(hash) {
    const raw = text(hash).replace(/^#/, '');
    if (!raw) {
      return { filter: 'all', sequenceKey: 'all', sequenceIndex: 'all' };
    }

    if (SEQUENCE_ROUTES.has(raw)) {
      return Object.assign({ sequenceIndex: 'all' }, SEQUENCE_ROUTES.get(raw));
    }

    const aliased = GROUP_ALIASES.get(raw) || raw;
    if (filterMap.has(aliased)) {
      return { filter: aliased, sequenceKey: 'all', sequenceIndex: 'all' };
    }

    return { filter: 'all', sequenceKey: 'all', sequenceIndex: 'all' };
  }

  function hashForState() {
    if (activeSequenceKey !== 'all' && activeFilter === 'lessons') {
      return `#${activeSequenceKey}`;
    }
    if (activeFilter === 'all') {
      return '#dashboard';
    }
    return `#${activeFilter}`;
  }

  function isScopedFilter(filterId = activeFilter) {
    return filterId === 'lessons' || filterId === 'vocabulary';
  }

  function sequenceOptionsForActiveFilter() {
    if (activeFilter === 'lessons') return LESSON_SEQUENCES;
    if (activeFilter === 'vocabulary') return VOCABULARY_SEQUENCES;
    return [];
  }

  function sequenceMatches(item) {
    if (!isScopedFilter()) return true;
    if (activeSequenceKey === 'all') return true;
    if (activeSequenceKey === 'specialized-lessons') {
      return item.group === 'specialized-lessons';
    }
    return item.sequenceKey === activeSequenceKey;
  }

  function numberMatches(item) {
    if (!isScopedFilter() || activeSequenceIndex === 'all') return true;
    return Number(item.sequenceIndex) === Number(activeSequenceIndex);
  }

  function categoryMatches(item) {
    const filter = getFilter(activeFilter);
    return !filter.groups || filter.groups.includes(item.group);
  }

  function resourceMatches(item, query) {
    const matchesSearch = !query || (item.searchable || searchText(item)).includes(query);
    return categoryMatches(item) && sequenceMatches(item) && numberMatches(item) && matchesSearch;
  }

  function matchingResourcesForNumberOptions() {
    return resources.filter(item => {
      return categoryMatches(item) && sequenceMatches(item) && Number.isFinite(Number(item.sequenceIndex));
    });
  }

  function populateSequenceFilters() {
    const options = sequenceOptionsForActiveFilter();
    const shouldShow = isScopedFilter();
    els.sequenceControls?.classList.toggle('hidden', !shouldShow);

    if (!shouldShow) {
      activeSequenceKey = 'all';
      activeSequenceIndex = 'all';
      return;
    }

    const validKeys = new Set(options.map(option => option.id));
    if (!validKeys.has(activeSequenceKey)) activeSequenceKey = 'all';

    const fragment = document.createDocumentFragment();
    options.forEach(option => {
      fragment.append(createOption(option.id, option.label));
    });
    els.sequenceFilter?.replaceChildren(fragment);
    if (els.sequenceFilter) els.sequenceFilter.value = activeSequenceKey;

    populateNumberFilter();
  }

  function populateNumberFilter() {
    const matches = matchingResourcesForNumberOptions();
    const numbers = [...new Set(matches.map(item => Number(item.sequenceIndex)).filter(Number.isFinite))]
      .sort((a, b) => a - b);

    if (!numbers.length) {
      activeSequenceIndex = 'all';
      els.numberFilter?.replaceChildren(createOption('all', 'All resources'));
      if (els.numberFilter) {
        els.numberFilter.value = 'all';
        els.numberFilter.disabled = true;
      }
      return;
    }

    if (activeSequenceIndex !== 'all' && !numbers.includes(Number(activeSequenceIndex))) {
      activeSequenceIndex = 'all';
    }

    const label = activeFilter === 'vocabulary' ? 'All vocabulary lessons' : 'All lesson numbers';
    const fragment = document.createDocumentFragment();
    fragment.append(createOption('all', label));
    numbers.forEach(number => {
      fragment.append(createOption(String(number), `Lesson ${number}`));
    });

    els.numberFilter?.replaceChildren(fragment);
    if (els.numberFilter) {
      els.numberFilter.disabled = false;
      els.numberFilter.value = activeSequenceIndex;
    }
  }

  function renderFeaturedResources() {
    const fragment = document.createDocumentFragment();
    FEATURED_RESOURCE_IDS
      .map(id => resourceMap.get(id))
      .filter(Boolean)
      .forEach(item => {
        fragment.append(createFeatureCard(item));
      });
    els.featuredGrid?.replaceChildren(fragment);
  }

  function renderDirectory() {
    const query = text(els.searchInput?.value).toLowerCase();
    const matches = resources.filter(item => resourceMatches(item, query));
    const fragment = document.createDocumentFragment();

    matches.forEach(item => {
      fragment.append(createResourceRow(item));
    });

    els.resourceList?.replaceChildren(fragment);
    setText(els.visibleCount, `${matches.length} resource${matches.length === 1 ? '' : 's'}`);
    if (els.emptyState) els.emptyState.style.display = matches.length ? 'none' : 'block';
  }

  function updateActiveButtons() {
    document.querySelectorAll('[data-filter]').forEach(button => {
      const isActive = button.dataset.filter === activeFilter;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  }

  function updateDirectoryHeading() {
    const filter = getFilter(activeFilter);
    setText(els.activeGroupTitle, filter.label);
    setText(els.activeGroupDescription, filter.description);
  }

  function refreshDirectory(options = {}) {
    updateDirectoryHeading();
    updateActiveButtons();
    if (els.categorySelect) els.categorySelect.value = activeFilter;
    populateSequenceFilters();
    renderDirectory();

    if (options.updateHash && window.location.hash !== hashForState()) {
      history.replaceState(null, '', hashForState());
    }
  }

  function setActiveFilter(filterId, options = {}) {
    activeFilter = filterMap.has(filterId) ? filterId : 'all';
    if (options.resetScope !== false) {
      activeSequenceKey = 'all';
      activeSequenceIndex = 'all';
    }
    refreshDirectory({ updateHash: options.updateHash !== false });
    setMenuOpen(false, { restoreFocus: false });
  }

  function renderNavigation() {
    const navFragment = document.createDocumentFragment();
    const selectFragment = document.createDocumentFragment();

    FILTERS.forEach(filter => {
      navFragment.append(createNavButton(filter));
      selectFragment.append(createOption(filter.id, filter.label));
    });

    els.sideNav?.replaceChildren(navFragment);
    els.categorySelect?.replaceChildren(selectFragment);
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

  function sequenceResources(sequenceKey) {
    return resources
      .filter(item => item.sequenceKey === sequenceKey && Number.isFinite(Number(item.sequenceIndex)))
      .sort((a, b) => Number(a.sequenceIndex) - Number(b.sequenceIndex));
  }

  function populateQuickCourseSelect() {
    const fragment = document.createDocumentFragment();
    QUICK_SEQUENCES.forEach(sequence => {
      fragment.append(createOption(sequence.id, sequence.label));
    });
    els.quickCourseSelect?.replaceChildren(fragment);
  }

  function populateQuickLessonSelect() {
    const sequenceKey = text(els.quickCourseSelect?.value) || QUICK_SEQUENCES[0]?.id;
    const items = sequenceResources(sequenceKey);
    const fragment = document.createDocumentFragment();

    items.forEach(item => {
      fragment.append(createOption(item.id, text(item.title)));
    });

    els.quickLessonSelect?.replaceChildren(fragment);
    updateQuickLinks();
  }

  function updateQuickLinks() {
    const selected = resourceMap.get(text(els.quickLessonSelect?.value));
    if (!selected) return;

    if (els.quickLessonLink) {
      els.quickLessonLink.href = selected.path;
      els.quickLessonLink.textContent = actionLabel(selected);
    }

    const related = Array.isArray(selected.related) ? selected.related[0] : null;
    if (els.quickRelatedLink) {
      els.quickRelatedLink.classList.toggle('hidden', !related);
      if (related) {
        els.quickRelatedLink.href = related.path;
        els.quickRelatedLink.textContent = related.label;
      }
    }
  }

  function applyRoute(route) {
    activeFilter = filterMap.has(route.filter) ? route.filter : 'all';
    activeSequenceKey = route.sequenceKey || 'all';
    activeSequenceIndex = route.sequenceIndex || 'all';
    refreshDirectory({ updateHash: false });
  }

  function bindEvents() {
    els.searchInput?.addEventListener('input', renderDirectory);
    els.categorySelect?.addEventListener('change', event => {
      setActiveFilter(event.target.value, { resetScope: true });
    });
    els.sequenceFilter?.addEventListener('change', event => {
      activeSequenceKey = event.target.value;
      activeSequenceIndex = 'all';
      refreshDirectory({ updateHash: true });
    });
    els.numberFilter?.addEventListener('change', event => {
      activeSequenceIndex = event.target.value;
      renderDirectory();
    });
    els.quickCourseSelect?.addEventListener('change', populateQuickLessonSelect);
    els.quickLessonSelect?.addEventListener('change', updateQuickLinks);
    els.sideNav?.addEventListener('click', event => {
      const button = event.target.closest('[data-filter]');
      if (!button) return;
      setActiveFilter(button.dataset.filter, { resetScope: true });
    });
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
      applyRoute(routeFromHash(window.location.hash));
    });
  }

  function initialize() {
    renderNavigation();
    renderFeaturedResources();
    updateStats();
    populateQuickCourseSelect();
    populateQuickLessonSelect();
    bindEvents();
    applyRoute(routeFromHash(window.location.hash));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();
