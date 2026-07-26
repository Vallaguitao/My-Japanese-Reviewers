(function () {
  'use strict';

  let searchIndex = null;
  let isLoading = false;
  let activeFilter = 'all';
  let selectedIndex = 0;
  let filteredResults = [];

  // Determine root relative path prefix for fetch
  function getRootPrefix() {
    const scripts = document.getElementsByTagName('script');
    for (let script of scripts) {
      if (script.src && script.src.includes('spotlight-search.js')) {
        const url = new URL(script.src);
        const pathParts = url.pathname.split('/');
        // find relative depth based on script location
        return script.src.substring(0, script.src.lastIndexOf('assets/js/spotlight-search.js'));
      }
    }
    return '';
  }

  const rootPrefix = getRootPrefix();

  // Create Modal DOM Structure if missing
  function injectModal() {
    if (document.getElementById('spotlight-modal')) return;

    const modalHtml = `
      <div id="spotlight-modal" class="spotlight-overlay spotlight-modal-hidden" role="dialog" aria-modal="true" aria-label="Spotlight Search">
        <div class="spotlight-container">
          <div class="spotlight-header">
            <div class="spotlight-input-wrapper">
              <span class="spotlight-icon" aria-hidden="true">🔍</span>
              <input type="search" id="spotlight-input" class="spotlight-input" placeholder="Search grammar, vocab, quizzes, kanji... (Ctrl+K)" autocomplete="off">
              <kbd class="spotlight-shortcut-badge">⌘K</kbd>
            </div>
            <div class="spotlight-filters">
              <button type="button" class="spotlight-filter-btn active" data-filter="all">All <span class="filter-count" id="count-all">0</span></button>
              <button type="button" class="spotlight-filter-btn" data-filter="grammar">Grammar <span class="filter-count" id="count-grammar">0</span></button>
              <button type="button" class="spotlight-filter-btn" data-filter="vocab">Vocab <span class="filter-count" id="count-vocab">0</span></button>
              <button type="button" class="spotlight-filter-btn" data-filter="quizzes">Quizzes <span class="filter-count" id="count-quizzes">0</span></button>
            </div>
          </div>
          <div class="spotlight-body">
            <div id="spotlight-results" class="spotlight-results">
              <!-- Result cards rendered here -->
            </div>
          </div>
          <div class="spotlight-footer">
            <div class="spotlight-footer-keys">
              <span><kbd>↑</kbd> <kbd>↓</kbd> Navigate</span>
              <span><kbd>↵</kbd> Select</span>
              <span><kbd>ESC</kbd> Close</span>
            </div>
            <div>
              <span>🔊 Click audio icon to listen instantly</span>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }

  // Load search index (supports file:// protocol & HTTP fetch)
  async function loadSearchIndex() {
    if (searchIndex || isLoading) return;
    isLoading = true;
    try {
      if (window.SEARCH_INDEX_DATA && Array.isArray(window.SEARCH_INDEX_DATA)) {
        searchIndex = window.SEARCH_INDEX_DATA;
      } else {
        const indexPath = rootPrefix + 'search-index.json';
        const res = await fetch(indexPath);
        if (!res.ok) throw new Error(`Failed to load search index: ${res.status}`);
        searchIndex = await res.json();
      }
    } catch (err) {
      console.warn('Spotlight search index fallback to offline script data:', err.message);
      searchIndex = window.SEARCH_INDEX_DATA || [];
    } finally {
      isLoading = false;
    }
  }

  // Open Spotlight Modal
  async function openSpotlight(initialQuery = '') {
    injectModal();
    const modal = document.getElementById('spotlight-modal');
    const input = document.getElementById('spotlight-input');

    modal.classList.remove('spotlight-modal-hidden');
    document.body.style.overflow = 'hidden';

    await loadSearchIndex();

    if (initialQuery) {
      input.value = initialQuery;
    }

    input.focus();
    input.select();
    renderResults();
  }

  // Close Spotlight Modal
  function closeSpotlight() {
    const modal = document.getElementById('spotlight-modal');
    if (modal) {
      modal.classList.add('spotlight-modal-hidden');
    }
    document.body.style.overflow = '';
  }

  // Escape HTML helper
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  // Filter items based on query & activeFilter
  function getFilteredData(query) {
    if (!searchIndex) return [];
    const q = query.trim().toLowerCase();

    return searchIndex.filter(item => {
      // Category filter check
      if (activeFilter === 'grammar') {
        if (item.type !== 'grammar' && item.category !== 'grammar' && item.category !== 'lessons') return false;
      } else if (activeFilter === 'vocab') {
        if (item.type !== 'vocab' && item.category !== 'vocab' && item.category !== 'kanji') return false;
      } else if (activeFilter === 'quizzes') {
        if (item.type !== 'quiz' && item.type !== 'mock' && item.category !== 'quizzes' && item.category !== 'mock') return false;
      }

      if (!q) return true;

      // Text query match
      const searchableText = [
        item.title,
        item.grammarFormula,
        item.explanation,
        item.jpText,
        item.furigana,
        item.englishDef,
        item.level,
        item.category,
        item.type,
        item.path
      ].filter(Boolean).join(' ').toLowerCase();

      return searchableText.includes(q);
    });
  }

  // Calculate filter counts for tabs
  function updateFilterCounts(query) {
    if (!searchIndex) return;
    const q = query.trim().toLowerCase();

    const matchesQuery = item => {
      if (!q) return true;
      const searchableText = [
        item.title,
        item.grammarFormula,
        item.explanation,
        item.jpText,
        item.furigana,
        item.englishDef,
        item.level,
        item.category,
        item.type,
        item.path
      ].filter(Boolean).join(' ').toLowerCase();
      return searchableText.includes(q);
    };

    const allMatches = searchIndex.filter(matchesQuery);

    const counts = {
      all: allMatches.length,
      grammar: allMatches.filter(i => i.type === 'grammar' || i.category === 'grammar' || i.category === 'lessons').length,
      vocab: allMatches.filter(i => i.type === 'vocab' || i.category === 'vocab' || i.category === 'kanji').length,
      quizzes: allMatches.filter(i => i.type === 'quiz' || i.type === 'mock' || i.category === 'quizzes' || i.category === 'mock').length
    };

    const cAll = document.getElementById('count-all');
    const cGrammar = document.getElementById('count-grammar');
    const cVocab = document.getElementById('count-vocab');
    const cQuizzes = document.getElementById('count-quizzes');

    if (cAll) cAll.textContent = counts.all;
    if (cGrammar) cGrammar.textContent = counts.grammar;
    if (cVocab) cVocab.textContent = counts.vocab;
    if (cQuizzes) cQuizzes.textContent = counts.quizzes;
  }

  // Render Result Cards
  function renderResults() {
    const input = document.getElementById('spotlight-input');
    const resultsContainer = document.getElementById('spotlight-results');
    if (!input || !resultsContainer) return;

    const query = input.value;
    updateFilterCounts(query);

    filteredResults = getFilteredData(query);

    if (selectedIndex >= filteredResults.length) {
      selectedIndex = Math.max(0, filteredResults.length - 1);
    }

    if (filteredResults.length === 0) {
      resultsContainer.innerHTML = `
        <div class="spotlight-empty">
          <div class="spotlight-empty-icon">🔍</div>
          <h4>No matching resources found</h4>
          <p>Try searching for grammar formulas (e.g. <span>は</span>, <span>です</span>), vocabulary, or levels (N5, N4).</p>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = filteredResults.map((item, idx) => {
      const isSelected = idx === selectedIndex;
      const lvlClass = (item.level || 'n5').toLowerCase().replace(' ', '-');
      const fullPath = rootPrefix + item.path + (item.slideAnchor ? `#slide-${item.slideAnchor}` : '');

      let cardBodyHtml = '';

      if (item.type === 'grammar' || item.grammarFormula) {
        // Grammar card
        cardBodyHtml = `
          <h4 class="spotlight-card-title">${escapeHtml(item.title)}</h4>
          ${item.grammarFormula ? `<div class="spotlight-formula">📐 ${escapeHtml(item.grammarFormula)}</div>` : ''}
          ${item.explanation ? `<p class="spotlight-exp">${escapeHtml(item.explanation)}</p>` : ''}
          ${item.jpText ? `
            <div class="spotlight-jp-row">
              <div>
                <span class="spotlight-jp-text">${escapeHtml(item.jpText)}</span>
                ${item.furigana ? `<span class="spotlight-furigana">${escapeHtml(item.furigana)}</span>` : ''}
                ${item.englishDef ? `<span class="spotlight-english-def"> — ${escapeHtml(item.englishDef)}</span>` : ''}
              </div>
              <button type="button" class="spotlight-tts-btn" data-tts="${escapeHtml(item.jpText)}" aria-label="Listen audio">🔊 Listen</button>
            </div>
          ` : ''}
        `;
      } else if (item.type === 'vocab' || item.type === 'kanji') {
        // Vocab / Kanji card
        cardBodyHtml = `
          <h4 class="spotlight-card-title">${escapeHtml(item.title)}</h4>
          <div class="spotlight-jp-row">
            <div>
              <span class="spotlight-jp-text">${escapeHtml(item.jpText || item.title)}</span>
              ${item.furigana ? `<span class="spotlight-furigana">(${escapeHtml(item.furigana)})</span>` : ''}
              ${item.englishDef ? `<span class="spotlight-english-def"> — ${escapeHtml(item.englishDef)}</span>` : ''}
            </div>
            <button type="button" class="spotlight-tts-btn" data-tts="${escapeHtml(item.jpText || item.furigana)}" aria-label="Listen audio">🔊 Listen</button>
          </div>
          ${item.explanation ? `<p class="spotlight-exp">${escapeHtml(item.explanation)}</p>` : ''}
        `;
      } else {
        // Lesson / Quiz / Mock card
        cardBodyHtml = `
          <h4 class="spotlight-card-title">${escapeHtml(item.title)}</h4>
          ${item.explanation ? `<p class="spotlight-exp">${escapeHtml(item.explanation)}</p>` : ''}
          ${item.jpText ? `
            <div class="spotlight-jp-row">
              <div>
                <span class="spotlight-jp-text">${escapeHtml(item.jpText)}</span>
                ${item.englishDef ? `<span class="spotlight-english-def"> — ${escapeHtml(item.englishDef)}</span>` : ''}
              </div>
            </div>
          ` : ''}
        `;
      }

      return `
        <a class="spotlight-card${isSelected ? ' selected' : ''}" href="${escapeHtml(fullPath)}" data-index="${idx}">
          <div class="spotlight-card-meta">
            <div class="spotlight-card-left">
              <span class="spotlight-pill ${escapeHtml(lvlClass)}">${escapeHtml(item.level || 'N5')}</span>
              <span class="spotlight-type-tag">${escapeHtml(item.type || item.category)}</span>
            </div>
            ${item.slideAnchor ? `<span class="spotlight-slide-anchor">Slide ${escapeHtml(item.slideAnchor)}</span>` : ''}
          </div>
          ${cardBodyHtml}
        </a>
      `;
    }).join('');

    // Ensure selected card is scrolled into view
    const selectedEl = resultsContainer.querySelector('.spotlight-card.selected');
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  // Global Event Listeners Setup
  function initListeners() {
    injectModal();

    const modal = document.getElementById('spotlight-modal');

    // 1. Keyboard Shortcuts (Cmd+K / Ctrl+K & Escape)
    document.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (modal.classList.contains('spotlight-modal-hidden')) {
          openSpotlight();
        } else {
          closeSpotlight();
        }
      } else if (e.key === 'Escape' && !modal.classList.contains('spotlight-modal-hidden')) {
        e.preventDefault();
        closeSpotlight();
      }
    });

    // 2. Attach listener to #resource-search on the page to open spotlight
    document.addEventListener('click', e => {
      const searchTrigger = e.target.closest('#resource-search');
      if (searchTrigger) {
        e.preventDefault();
        const initialVal = searchTrigger.value;
        openSpotlight(initialVal);
      }
    });

    document.addEventListener('focusin', e => {
      if (e.target && e.target.id === 'resource-search' && modal.classList.contains('spotlight-modal-hidden')) {
        openSpotlight(e.target.value);
      }
    });

    // 3. Modal Click backdrop to close
    modal.addEventListener('click', e => {
      if (e.target === modal) {
        closeSpotlight();
      }
    });

    // 4. Modal Category Filter Buttons
    const filtersContainer = modal.querySelector('.spotlight-filters');
    if (filtersContainer) {
      filtersContainer.addEventListener('click', e => {
        const btn = e.target.closest('.spotlight-filter-btn');
        if (!btn) return;

        filtersContainer.querySelectorAll('.spotlight-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        activeFilter = btn.dataset.filter || 'all';
        selectedIndex = 0;
        renderResults();
      });
    }

    // 5. Modal Search Input
    const input = document.getElementById('spotlight-input');
    if (input) {
      input.addEventListener('input', () => {
        selectedIndex = 0;
        renderResults();
      });

      input.addEventListener('keydown', e => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (filteredResults.length > 0) {
            selectedIndex = (selectedIndex + 1) % filteredResults.length;
            renderResults();
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (filteredResults.length > 0) {
            selectedIndex = (selectedIndex - 1 + filteredResults.length) % filteredResults.length;
            renderResults();
          }
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (filteredResults[selectedIndex]) {
            const item = filteredResults[selectedIndex];
            const targetUrl = rootPrefix + item.path + (item.slideAnchor ? `#slide-${item.slideAnchor}` : '');
            window.location.href = targetUrl;
            closeSpotlight();
          }
        }
      });
    }

    // 6. Handle Instant Audio TTS & Card Clicks inside Modal
    const resultsContainer = document.getElementById('spotlight-results');
    if (resultsContainer) {
      resultsContainer.addEventListener('click', e => {
        // Handle TTS Audio button click
        const ttsBtn = e.target.closest('.spotlight-tts-btn');
        if (ttsBtn) {
          e.preventDefault();
          e.stopPropagation();
          const text = ttsBtn.dataset.tts;
          if (text && typeof window.speakJapanese === 'function') {
            window.speakJapanese(text);
          }
          return;
        }

        // Handle card click
        const card = e.target.closest('.spotlight-card');
        if (card) {
          closeSpotlight();
        }
      });
    }
  }

  // Public API exposed on window
  window.SpotlightSearch = {
    open: openSpotlight,
    close: closeSpotlight
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initListeners);
  } else {
    initListeners();
  }
})();
