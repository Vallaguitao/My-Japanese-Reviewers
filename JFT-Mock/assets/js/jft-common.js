(function() {
  function decodeBase64(str) {
    if (!str) return "";
    try {
      return decodeURIComponent(escape(atob(str)));
    } catch (e) {
      return str;
    }
  }

  // Pre-process questions to decode base64 answers and notes
  if (typeof setData !== 'undefined') {
    for (const key in setData) {
      if (setData[key].questions) {
        setData[key].questions.forEach(q => {
          if (q.answer_obfuscated) {
            q.answer = parseInt(atob(q.answer_obfuscated));
          }
          if (q.note_obfuscated) {
            q.note = decodeBase64(q.note_obfuscated);
          }
        });
      }
    }
  }

  const state = {
    active: 1,
    sets: {}
  };

  for (let i = 1; i <= 4; i++) {
    state.sets[i] = {
      phase: 'start',  // 'start' | 'question' | 'result'
      current: 0,
      score: 0,
      results: [],
      startTime: null,
      accumulated: 0,
      timerId: null
    };
  }

  window.switchSet = function(n) {
    pauseTimer(state.active);
    state.active = n;
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', +t.dataset.set === n));
    document.querySelectorAll('.set').forEach(s => s.classList.toggle('active', s.id === 'set-' + n));
    renderSet(n);
    if (state.sets[n].phase === 'question') resumeTimer(n);
  };

  function pauseTimer(n) {
    const s = state.sets[n];
    if (s.timerId) {
      clearInterval(s.timerId);
      s.timerId = null;
      if (s.startTime) {
        s.accumulated += Date.now() - s.startTime;
        s.startTime = null;
      }
    }
  }

  function resumeTimer(n) {
    const s = state.sets[n];
    s.startTime = Date.now();
    tickTimer(n);
    s.timerId = setInterval(() => tickTimer(n), 1000);
  }

  function tickTimer(n) {
    const s = state.sets[n];
    const elapsed = Math.floor((s.accumulated + (s.startTime ? Date.now() - s.startTime : 0)) / 1000);
    const m = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const ss = String(elapsed % 60).padStart(2, '0');
    const el = document.getElementById('timer-' + n);
    if (el) el.textContent = `${m}:${ss}`;
  }

  function renderSet(n) {
    const s = state.sets[n];
    if (s.phase === 'start') renderStart(n);
    else if (s.phase === 'question') renderQuestion(n);
    else if (s.phase === 'result') renderResult(n);
  }

  function renderStart(n) {
    const data = setData[n];
    const container = document.getElementById('set-' + n);
    container.innerHTML = `
      <div class="start-card">
        <div class="set-label">SET ${n} ・ ${data.questions.length} QUESTIONS</div>
        <h2>${data.nameJp}</h2>
        <p>${data.intro}</p>
        <ul>
          <li>Tap an answer to submit — you can't change it.</li>
          <li>Correct answers glow <strong style="color:var(--green)">green</strong>, wrong ones turn <strong style="color:var(--red)">red</strong>.</li>
          <li>You can switch tabs anytime — your progress is saved.</li>
        </ul>
        <button class="primary" onclick="startSet(${n})">スタート ・ Begin Set ${n}</button>
      </div>
    `;
  }

  window.startSet = function(n) {
    const s = state.sets[n];
    s.phase = 'question';
    s.current = 0;
    s.score = 0;
    s.results = [];
    s.accumulated = 0;
    s.startTime = null;
    resumeTimer(n);
    updateTabStatus(n);
    renderQuestion(n);
  };

  function updateTabStatus(n) {
    const tab = document.querySelector(`.tab[data-set="${n}"]`);
    const status = document.getElementById('status-' + n);
    const s = state.sets[n];
    const total = setData[n].questions.length;
    tab.classList.remove('completed', 'in-progress');
    if (s.phase === 'result') {
      tab.classList.add('completed');
      status.textContent = `${s.score}/${total}`;
    } else if (s.phase === 'question') {
      tab.classList.add('in-progress');
      status.textContent = `${s.current + 1}/${total}`;
    } else {
      status.textContent = `${total} Q`;
    }
    
    let done = 0, totalScore = 0;
    for (let i = 1; i <= 4; i++) {
      if (state.sets[i].phase === 'result') {
        done++;
        totalScore += state.sets[i].score;
      }
    }
    document.getElementById('sets-done').textContent = done;
    document.getElementById('total-score').textContent = totalScore;
  }

  function renderQuestion(n) {
    const s = state.sets[n];
    const data = setData[n];
    const q = data.questions[s.current];
    const total = data.questions.length;
    const letters = ['A', 'B', 'C', 'D'];

    const container = document.getElementById('set-' + n);

    let promptHtml;
    if (q.passage) {
      promptHtml = `${q.passage}<div class="q-ask">${q.q}</div>`;
    } else {
      promptHtml = `<div class="q-prompt">${q.prompt}</div>`;
    }

    container.innerHTML = `
      <div class="topbar">
        <div class="meta">
          <span>Q <strong>${q.num}</strong> ・ ${s.current + 1}/${total}</span>
          <span>Score <strong>${s.score}</strong></span>
        </div>
        <div class="timer" id="timer-${n}">00:00</div>
        <div class="progress"><div style="width:${(s.current / total * 100)}%"></div></div>
      </div>
      <div class="question-card">
        <span class="q-num">Q ${q.num} <span class="q-type">・ ${q.type}</span></span>
        <div class="q-visual">${q.visual}</div>
        ${promptHtml}
        <div class="choices">
          ${q.choices.map((c, i) => `
            <button class="choice" data-i="${i}" onclick="choose(${n}, ${i})">
              <span class="letter">${letters[i]}</span>
              <span>${c}</span>
            </button>
          `).join('')}
        </div>
        <div class="feedback" id="feedback-${n}"></div>
        <button class="next-btn" id="next-btn-${n}" onclick="nextQuestion(${n})">
          ${s.current + 1 === total ? '結果を見る ・ See Results →' : 'つぎへ ・ Next →'}
        </button>
      </div>
    `;
    tickTimer(n);
    updateTabStatus(n);
  }

  window.choose = function(n, chosenIdx) {
    const s = state.sets[n];
    const q = setData[n].questions[s.current];
    const correctIdx = q.answer;
    const buttons = document.querySelectorAll('#set-' + n + ' .choice');

    buttons.forEach((b, i) => {
      b.disabled = true;
      if (i === correctIdx) b.classList.add('correct');
      else if (i === chosenIdx) b.classList.add('wrong');
      else b.classList.add('dimmed');
    });

    const isCorrect = chosenIdx === correctIdx;
    if (isCorrect) s.score++;
    s.results.push({ qIndex: s.current, chosen: chosenIdx, correct: isCorrect });

    const fb = document.getElementById('feedback-' + n);
    fb.className = 'feedback show ' + (isCorrect ? 'ok' : 'ng');
    fb.innerHTML = isCorrect
      ? `<strong>せいかい！ Correct.</strong> ${q.note}`
      : `<strong>ざんねん。 Correct answer: ${q.choices[correctIdx]}.</strong><br>${q.note}`;

    document.getElementById('next-btn-' + n).classList.add('show');
    updateTabStatus(n);
  };

  window.nextQuestion = function(n) {
    const s = state.sets[n];
    s.current++;
    if (s.current >= setData[n].questions.length) {
      finishSet(n);
    } else {
      renderQuestion(n);
    }
  };

  function finishSet(n) {
    pauseTimer(n);
    const s = state.sets[n];
    s.phase = 'result';
    renderResult(n);
    updateTabStatus(n);
  }

  function renderResult(n) {
    const s = state.sets[n];
    const data = setData[n];
    const total = data.questions.length;
    const pct = Math.round(s.score / total * 100);
    const elapsed = Math.floor(s.accumulated / 1000);
    const m = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const ss = String(elapsed % 60).padStart(2, '0');
    const circumference = 2 * Math.PI * 65;
    const offset = circumference - (pct / 100) * circumference;

    let verdict = '';
    if (pct === 100)      verdict = 'かんぺき！ Perfect!';
    else if (pct >= 85)   verdict = 'すばらしい！ Excellent!';
    else if (pct >= 70)   verdict = 'よくできました ・ Well done';
    else if (pct >= 50)   verdict = 'もうすこし ・ Keep going';
    else                  verdict = 'がんばって ・ Keep studying';

    const reviewHtml = s.results.map(r => {
      const q = data.questions[r.qIndex];
      return `
        <div class="review-item ${r.correct ? 'ok' : 'ng'}">
          <div class="q">Q${q.num}. ${stripHtml(q.prompt || q.q)}</div>
          <div class="a">
            ${r.correct
              ? `<span class="mark-ok">✓</span> ${q.choices[q.answer]}`
              : `<span class="mark-ng">✗ ${q.choices[r.chosen]}</span> → <span class="mark-ok">✓ ${q.choices[q.answer]}</span>`}
          </div>
        </div>
      `;
    }).join('');

    const nextBtn = n < 4
      ? `<button class="next-set" onclick="switchSet(${n + 1})">つぎのセット ・ Next Set →</button>`
      : `<button class="next-set" onclick="switchSet(1)">セット 1 へ ・ Back to Set 1</button>`;

    const container = document.getElementById('set-' + n);
    container.innerHTML = `
      <div class="result-card">
        <div class="set-label">SET ${n} ・ ${data.name.toUpperCase()}</div>
        <h2>けっか ・ Your Result</h2>
        <div class="score-ring">
          <svg viewBox="0 0 150 150">
            <defs>
              <linearGradient id="grad-${n}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#ff7ea3"/>
                <stop offset="100%" stop-color="#d63f6a"/>
              </linearGradient>
            </defs>
            <circle class="bg" cx="75" cy="75" r="65"/>
            <circle class="fg" cx="75" cy="75" r="65"
              stroke="url(#grad-${n})"
              stroke-dasharray="${circumference}"
              stroke-dashoffset="${circumference}"
              id="ring-fg-${n}"/>
          </svg>
          <div class="label">
            <div class="num">${s.score}<span style="font-size:18px;color:var(--ink-soft);">/${total}</span></div>
            <div class="out">${pct}% ・ ${m}:${ss}</div>
          </div>
        </div>
        <div class="verdict">${verdict}</div>
        <p>Review your answers below.</p>
        <div class="review-list">${reviewHtml}</div>
        <div class="result-actions">
          <button class="retry" onclick="startSet(${n})">もういちど ・ Retry</button>
          ${nextBtn}
        </div>
      </div>
    `;
    requestAnimationFrame(() => {
      const r = document.getElementById('ring-fg-' + n);
      if (r) r.style.strokeDashoffset = offset;
    });
  }

  function stripHtml(str) {
    const tmp = document.createElement('div');
    tmp.innerHTML = str;
    return (tmp.textContent || tmp.innerText || '').slice(0, 80);
  }

  renderSet(1);
})();
