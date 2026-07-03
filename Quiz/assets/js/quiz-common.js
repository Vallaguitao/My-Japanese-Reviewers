// Shared Japanese Quiz Engine (Common for Vocabulary, Expressions, Grammar, etc.)

(function() {
  // UTF-8 safe Base64 decoding
  function decodeBase64(str) {
    if (!str) return "";
    try {
      return decodeURIComponent(escape(atob(str)));
    } catch (e) {
      console.error("Base64 decoding failed for string:", str, e);
      return str;
    }
  }

  // Shuffling algorithm
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Fallback vocabulary explanation generator
  function getVocabExplanation(q, answerText) {
    const cleanEnglish = q.english || q.question;
    const choicesList = q.choices.filter(c => c !== answerText);
    const choicesStr = choicesList.map(c => `「${c}」`).join(", ");
    return {
      correctNote: `The Japanese word for "${cleanEnglish}" is 「${answerText}」.`,
      explain: `The English word "${cleanEnglish}" translates to 「${answerText}」. The other choices (${choicesStr}) have different meanings and are incorrect in this context.`
    };
  }

  // Helper to pick score tier colors and labels
  function pickScoreTier(pct) {
    if (pct === 100) {
      return { label: "完璧！ Perfect!", bg: "#e8f5e9", border: "#2e7d32", text: "#1b5e20" };
    } else if (pct >= 90) {
      return { label: "すごい！ Excellent!", bg: "#e8f5e9", border: "#2e7d32", text: "#1b5e20" };
    } else if (pct >= 70) {
      return { label: "いいですね！ Good job!", bg: "#fff9c4", border: "#fbc02d", text: "#f57f17" };
    } else {
      return { label: "もう一度！ Try again!", bg: "#ffebee", border: "#c62828", text: "#b71c1c" };
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const config = window.quizConfig;
    if (!config) {
      console.error("Quiz configuration (window.quizConfig) not found.");
      return;
    }

    // Default EmailJS credentials
    const EMAILJS_PUBLIC_KEY  = config.emailPublicKey || "1oR0j0WDvUmSSYEpK";
    const EMAILJS_SERVICE_ID  = config.emailServiceId || "service_v7ifzdj";
    const EMAILJS_TEMPLATE_ID = config.emailTemplateId || "template_lb9c879";
    
    if (typeof emailjs !== 'undefined') {
      emailjs.init(EMAILJS_PUBLIC_KEY);
    }

    /* ── State ── */
    let playerName = "";
    let quiz = [];
    let answers = {};
    let currentQ = 0;
    let submitted = false;
    let reviewMode = false;
    let reviewIndices = [];
    let endTime = null;
    let timeLeft = 0;
    let timerInterval = null;
    let currentSetKey = "";
    let activeLeftSelected = null;
    let activeRightSelected = null;

    /* ── DOM refs ── */
    const $nameScreen     = document.getElementById("name-screen");
    const $quizScreen     = document.getElementById("quiz-screen");
    const $nameInput      = document.getElementById("name-input");
    const $btnStart       = document.getElementById("btn-start");
    const $subtitle       = document.getElementById("quiz-subtitle") || document.getElementById("ns-subtitle");
    const $scoreBanner    = document.getElementById("score-banner");
    const $scoreNum       = document.getElementById("score-number");
    const $scoreLbl       = document.getElementById("score-label");
    const $emailRow       = document.getElementById("email-row");
    const $btnRetake      = document.getElementById("btn-retake");
    const $btnReview      = document.getElementById("btn-review");
    const $btnHome        = document.getElementById("btn-home");
    const $reviewBanner   = document.getElementById("review-banner");
    const $skippedWarning = document.getElementById("skipped-warning");
    const $feedbackCard   = document.getElementById("feedback-card");
    const $timerDisplay   = document.getElementById("timer-display");
    const $progText       = document.getElementById("progress-text");
    const $progFill       = document.getElementById("progress-fill");
    const $navGrid        = document.getElementById("nav-grid");
    const $qCard          = document.getElementById("q-card");
    const $qNumber        = document.getElementById("q-number");
    const $qEnglish       = document.getElementById("q-english");
    const $choicesGrid    = document.getElementById("choices-grid");
    const $btnPrev        = document.getElementById("btn-prev");
    const $btnNext        = document.getElementById("btn-next");
    const $btnSubmit      = document.getElementById("btn-submit");

    // Optional refs for advanced/multiset/expressions quizzes
    const $setSelect      = document.getElementById("set-select");
    const $quizTitle      = document.getElementById("quiz-title") || document.getElementById("qs-title");
    const $nsTitle        = document.getElementById("ns-title");
    const $nsBadge        = document.getElementById("ns-badge");
    const $qsBadge        = document.getElementById("qs-badge");
    const $qLessonTag     = document.getElementById("q-lesson-tag");
    const $qTypeTag       = document.getElementById("q-type-tag");
    const $qStem          = document.getElementById("q-stem") || document.getElementById("q-text") || document.getElementById("q-prompt");
    const $qPassage       = document.getElementById("q-passage");
    const $qQuestion      = document.getElementById("q-question");
    const $lessonBreak    = document.getElementById("lesson-breakdown");

    // Populate metadata dynamically on page load if elements exist
    if (config.lessonTitle) {
      document.title = config.lessonTitle;
    }
    if ($nsTitle && config.lessonTitle) {
      $nsTitle.textContent = config.lessonTitle;
    }
    if ($nsBadge && config.badge) {
      $nsBadge.textContent = config.badge;
    }
    if ($nsSubtitle && config.subtitle) {
      $nsSubtitle.textContent = config.subtitle;
    }
    if ($qsBadge && config.badge) {
      $qsBadge.textContent = config.badge;
    }
    if ($quizTitle && config.lessonTitleShort) {
      $quizTitle.textContent = config.lessonTitleShort;
    } else if ($quizTitle && config.lessonTitle) {
      $quizTitle.textContent = config.lessonTitle;
    }

    // Enable Start Button on Name Input
    if ($nameInput && $btnStart) {
      $nameInput.addEventListener("input", () => {
        $btnStart.disabled = !$nameInput.value.trim();
      });
      $nameInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && $nameInput.value.trim()) startQuiz();
      });
      $btnStart.addEventListener("click", startQuiz);
    }

    function startTimer() {
      const qCount = quiz.length;
      let TIME_LIMIT;
      if (qCount <= 30) {
        TIME_LIMIT = 20 * 60;
      } else if (qCount <= 40) {
        TIME_LIMIT = 25 * 60;
      } else if (qCount <= 50) {
        TIME_LIMIT = 30 * 60;
      } else {
        TIME_LIMIT = 40 * 60;
      }

      endTime = Date.now() + TIME_LIMIT * 1000;
      timeLeft = TIME_LIMIT;
      updateTimerDisplay();
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        if (submitted) {
          clearInterval(timerInterval);
          return;
        }
        timeLeft = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
        updateTimerDisplay();
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          alert("Time is up! Your exam will be submitted automatically.");
          submitQuiz(true);
        }
      }, 1000);
    }

    function updateTimerDisplay() {
      const m = String(Math.floor(timeLeft / 60)).padStart(2, '0');
      const s = String(timeLeft % 60).padStart(2, '0');
      if ($timerDisplay) {
        $timerDisplay.textContent = `${m}:${s}`;
        if (timeLeft < 300) {
          $timerDisplay.parentElement.classList.add("warning");
        } else {
          $timerDisplay.parentElement.classList.remove("warning");
        }
      }
    }

    function startQuiz() {
      playerName = $nameInput.value.trim();
      
      let rawQuestions = [];
      if ($setSelect && config.sets) {
        currentSetKey = $setSelect.value;
        const selectedSet = config.sets[currentSetKey];
        rawQuestions = selectedSet.questions;
        if ($quizTitle) {
          $quizTitle.textContent = selectedSet.title;
        }
      } else {
        rawQuestions = config.questions;
      }

      function processQuizQuestions(rawQuestionsList) {
        return shuffle(rawQuestionsList).map(q => {
          const decodedAnswer = decodeBase64(q.answer);
          return {
            ...q,
            plainAnswer: decodedAnswer,
            choices: shuffle(q.choices),
            plainCorrectNote: q.correctNote ? decodeBase64(q.correctNote) : null,
            plainExplain: q.explain ? decodeBase64(q.explain) : null,
            plainConnect: q.connect ? decodeBase64(q.connect) : null,
            plainWarn: q.warn ? decodeBase64(q.warn) : null,
            plainStem: q.stem ? decodeBase64(q.stem) : null,
            plainPassage: q.passage ? decodeBase64(q.passage) : null,
            plainQuestion: q.question ? decodeBase64(q.question) : null
          };
        });
      }

      // Decode questions dynamically
      quiz = processQuizQuestions(rawQuestions);

      answers = {};
      currentQ = 0;
      submitted = false;
      reviewMode = false;
      reviewIndices = [];

      $nameScreen.style.display = "none";
      $quizScreen.style.display = "block";
      $scoreBanner.style.display = "none";
      $reviewBanner.style.display = "none";
      $skippedWarning.classList.add("hidden");
      
      if ($subtitle) {
        $subtitle.textContent = `${playerName}さん — Choose the correct answer`;
      }

      buildNavGrid();
      startTimer();
      renderQuestion();
      updateProgress();
    }

    /* ── Nav Grid ── */
    function buildNavGrid() {
      $navGrid.innerHTML = "";
      quiz.forEach((_, i) => {
        const btn = document.createElement("button");
        btn.className = "nav-dot";
        btn.textContent = i + 1;
        btn.setAttribute("aria-label", `Question ${i + 1}`);
        btn.addEventListener("click", () => {
          if (reviewMode) {
            const idx = reviewIndices.indexOf(i);
            if (idx === -1) return;
            currentQ = idx;
          } else {
            currentQ = i;
          }
          renderQuestion();
        });
        $navGrid.appendChild(btn);
      });
    }

    function updateNavGrid() {
      const dots = $navGrid.querySelectorAll(".nav-dot");
      const realIdx = reviewMode ? reviewIndices[currentQ] : currentQ;

      if (submitted) {
        $navGrid.classList.remove("hidden");
      } else {
        $navGrid.classList.add("hidden");
      }

      dots.forEach((dot, i) => {
        dot.className = "nav-dot";
        let label = `Question ${i + 1}`;
        if (i === realIdx) { dot.classList.add("active"); label += ", current"; }
        
        if (submitted) {
          dot.classList.add("locked");
          if (answers[i] === quiz[i].plainAnswer) {
            dot.classList.add("correct"); label += ", correct";
          } else if (answers[i] !== undefined) {
            dot.classList.add("wrong"); label += ", incorrect";
          } else {
            dot.classList.add("unanswered-locked"); label += ", unanswered";
          }
        } else {
          if (answers[i] !== undefined) {
            dot.classList.add("answered"); label += ", answered";
          }
        }
        dot.setAttribute("aria-label", label);
      });
    }

    /* ── Progress ── */
    function updateProgress() {
      if (reviewMode) {
        $progText.textContent = `Reviewing ${currentQ + 1} / ${reviewIndices.length}`;
        $progFill.style.width = `${((currentQ + 1) / reviewIndices.length) * 100}%`;
        return;
      }
      const count = Object.keys(answers).length;
      $progText.textContent = `${count} / ${quiz.length} answered`;
      $progFill.style.width = `${(count / quiz.length) * 100}%`;
      $btnSubmit.disabled = false;
    }

    /* ── Render Question ── */
    function renderQuestion() {
      const realIdx = reviewMode ? reviewIndices[currentQ] : currentQ;
      const q = quiz[realIdx];
      
      // Update advanced tagging if elements and tags exist
      if ($qLessonTag) {
        const lessonLabels = config.lessonLabels || {};
        $qLessonTag.className = `q-tag lesson-${q.lesson || 1}`;
        $qLessonTag.textContent = lessonLabels[q.lesson] || `📘 Lesson ${q.lesson || 1}`;
      }
      if ($qTypeTag) {
        $qTypeTag.textContent = q.type || "";
        $qTypeTag.style.display = q.type ? "inline-block" : "none";
      }

      $qNumber.textContent = reviewMode
        ? `Review ${currentQ + 1} of ${reviewIndices.length}`
        : `${q.scenario ? q.scenario + ' — ' : ''}Question ${realIdx + 1} of ${quiz.length}`;

      if ($qPassage) {
        $qPassage.textContent = q.plainPassage || q.passage || "";
        $qPassage.style.display = (q.plainPassage || q.passage) ? "block" : "none";
      }
      if ($qQuestion) {
        $qQuestion.textContent = q.plainQuestion || q.question || "";
        $qQuestion.style.display = (q.plainQuestion || q.question) ? "block" : "none";
      }

      // Stem or English contents
      const stemContent = q.plainStem || q.stem || q.english || q.question || q.q;
      if ($qStem) {
        $qStem.innerHTML = stemContent;
        $qStem.style.display = stemContent ? "block" : "none";
      } else if ($qEnglish) {
        $qEnglish.innerHTML = stemContent;
        $qEnglish.style.display = stemContent ? "block" : "none";
      }

      // Remove existing matching containers if any
      const oldMatching = document.getElementById("matching-grid-wrapper");
      if (oldMatching) oldMatching.remove();

      activeLeftSelected = null;
      activeRightSelected = null;

      if (q.type === 'matching') {
        $choicesGrid.classList.add("hidden");
        renderMatchingUI(q, realIdx);
      } else {
        $choicesGrid.classList.remove("hidden");
        $choicesGrid.innerHTML = "";
        
        if (q.choices) {
          q.choices.forEach((c, i) => {
            const btn = document.createElement("button");
            btn.className = "choice-btn";
            if (submitted) btn.classList.add("locked");
            
            // Dynamic prefix layout options (a) vs a. vs a))
            const prefixStr = q.longChoices ? `${["a", "b", "c", "d"][i]}.` : `${["a", "b", "c", "d"][i]})`;
            btn.innerHTML = `<span class="prefix">${prefixStr}</span><span class="text">${c}</span>`;

            const selected = answers[realIdx] === c;
            const isCorrectChoice = c === q.plainAnswer;

            if (!submitted) {
              if (selected) btn.classList.add("selected");
              btn.addEventListener("click", () => {
                if (submitted) return;
                answers[realIdx] = c;
                renderQuestion();
                updateNavGrid();
                updateProgress();
              });
            } else {
              if (isCorrectChoice) {
                btn.classList.add("correct-reveal");
                btn.innerHTML += `<span class="mark ok">✓</span>`;
              } else if (selected && !isCorrectChoice) {
                btn.classList.add("wrong-reveal");
                btn.innerHTML += `<span class="mark no">✗</span>`;
              } else {
                btn.classList.add("faded-reveal");
              }
            }

            $choicesGrid.appendChild(btn);
          });
        }
      }

      /* Feedback card */
      const isAnswered = answers[realIdx] !== undefined;
      if (submitted && isAnswered) {
        renderFeedback(q, answers[realIdx]);
      } else {
        $feedbackCard.style.display = "none";
        $feedbackCard.innerHTML = "";
      }

      updateNavGrid();

      /* Arrow / submit visibility */
      const total = reviewMode ? reviewIndices.length : quiz.length;
      $btnPrev.disabled = currentQ === 0;

      if (!submitted) {
        const isLast = currentQ === quiz.length - 1;
        if (isLast) {
          $btnNext.classList.add("hidden");
          $btnSubmit.classList.remove("hidden");
        } else {
          $btnNext.classList.remove("hidden");
          $btnSubmit.classList.add("hidden");
          $btnNext.textContent = "Next →";
        }
      } else {
        $btnSubmit.classList.add("hidden");
        $btnNext.classList.remove("hidden");
        
        if (reviewMode) {
          if (currentQ === total - 1) {
            $btnNext.textContent = "Done reviewing ✓";
          } else {
            $btnNext.textContent = "Next →";
          }
          $btnNext.disabled = false;
        } else {
          $btnNext.textContent = "Next →";
          $btnNext.disabled = currentQ === total - 1;
        }
      }
    }

    function renderFeedback(q, given) {
      const isCorrect = given === q.plainAnswer;
      $feedbackCard.className = `feedback-card ${isCorrect ? "correct" : "wrong"}`;
      $feedbackCard.style.display = "block";

      // Decoded or auto-generated explanations
      let correctNote = q.plainCorrectNote || q.correctNote;
      let explain = q.plainExplain || q.explain;

      if (!correctNote && !explain) {
        const vocabExplanation = getVocabExplanation(q, q.plainAnswer);
        correctNote = vocabExplanation.correctNote;
        explain = vocabExplanation.explain;
      }

      let html = `<div class="fb-header">${isCorrect ? "✓ Correct" : `✗ Not quite — answer: ${q.plainAnswer}`}</div>`;
      if (correctNote) html += `<div>${correctNote}</div>`;
      if (explain)     html += `<div class="fb-block">${explain}</div>`;
      if (q.plainConnect || q.connect) html += `<div class="fb-block connect">${q.plainConnect || q.connect}</div>`;
      if (q.plainWarn || q.warn)       html += `<div class="fb-block warn">${q.plainWarn || q.warn}</div>`;

      $feedbackCard.innerHTML = html;
    }

    /* ── Navigation ── */
    $btnPrev.addEventListener("click", () => { if (currentQ > 0) { currentQ--; renderQuestion(); } });
    $btnNext.addEventListener("click", () => {
      const total = reviewMode ? reviewIndices.length : quiz.length;
      if (currentQ < total - 1) {
        currentQ++; renderQuestion();
      } else if (reviewMode) {
        /* Exit review mode back to results */
        reviewMode = false;
        $reviewBanner.style.display = "none";
        $scoreBanner.style.display = "block";
        $scoreBanner.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
    
    $btnHome.addEventListener("click", () => {
      if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
      $quizScreen.style.display = "none";
      $nameScreen.style.display = "block";
    });

    /* ── Submit ── */
    $btnSubmit.addEventListener("click", () => submitQuiz());

    async function submitQuiz(force = false) {
      const count = Object.keys(answers).length;
      if (force !== true && count < quiz.length) {
        const skipped = [];
        quiz.forEach((_, i) => {
          if (answers[i] === undefined) skipped.push(i);
        });

        $skippedWarning.innerHTML = `⚠️ You have unanswered questions: ` + 
          skipped.map(idx => `<span class="skipped-link" onclick="jumpToQuestion(${idx})">Question ${idx + 1}</span>`).join(", ") + 
          `. Please answer them before submitting.`;
        $skippedWarning.classList.remove("hidden");
        return;
      }

      $skippedWarning.classList.add("hidden");
      if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }

      let s = 0;
      const lessonStats = {};
      quiz.forEach((q, i) => {
        const isRight = answers[i] === q.plainAnswer;
        if (isRight) s++;
        
        if (q.lesson) {
          if (!lessonStats[q.lesson]) lessonStats[q.lesson] = { correct: 0, total: 0 };
          lessonStats[q.lesson].total++;
          if (isRight) lessonStats[q.lesson].correct++;
        }
      });
      submitted = true;

      const pct = Math.round((s / quiz.length) * 100);
      $scoreNum.textContent = `${s}/${quiz.length}`;

      const tier = pickScoreTier(pct);
      $scoreLbl.textContent = tier.label;
      $scoreBanner.style.background = tier.bg;
      $scoreBanner.style.borderColor = tier.border;
      $scoreBanner.style.color = tier.text;
      $scoreBanner.style.borderStyle = "solid";
      $scoreBanner.style.borderWidth = "1px";
      $scoreBanner.style.display = "block";

      // Lesson breakdown rendering
      if ($lessonBreak && Object.keys(lessonStats).length > 0) {
        $lessonBreak.innerHTML = "";
        const lessonNames = config.lessonNames || {1: "あいさつ", 2: "レストラン", 3: "やりとり", 4: "イベント", 5: "リアクション"};
        Object.keys(lessonStats).sort((a, b) => +a - +b).forEach(l => {
          const stats = lessonStats[l];
          const span = document.createElement("span");
          span.className = "lesson-stat";
          span.textContent = `${lessonNames[l] || "L"+l}: ${stats.correct}/${stats.total}`;
          $lessonBreak.appendChild(span);
        });
      }

      /* Enable review button if there are wrong answers */
      const wrongCount = quiz.length - s;
      $btnReview.disabled = wrongCount === 0;
      $btnReview.textContent = wrongCount === 0
        ? "🎉 No mistakes!"
        : `📝 Review ${wrongCount} wrong answer${wrongCount > 1 ? "s" : ""}`;

      currentQ = 0;
      renderQuestion();
      updateNavGrid();
      $scoreBanner.scrollIntoView({ behavior: "smooth", block: "start" });

      /* Email sending payload */
      if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
        $emailRow.innerHTML = `<span class="email-pill">📧 Sending results…</span>`;
        const now = new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila", dateStyle: "full", timeStyle: "short" });
        const details = quiz.map((q, i) =>
          `Q${i+1}: ${answers[i] === q.plainAnswer ? "✓" : "✗"} (Ans: ${answers[i] || "—"} | Correct: ${q.plainAnswer})`
        ).join("\n");

        const subjectStr = `[${playerName}] ${config.emailSubject || 'Quiz'} — ${pct}%`;
        const messageStr = `${config.lessonTitle || 'Quiz'} Results\n\nStudent: ${playerName}\nDate: ${now}\nScore: ${s}/${quiz.length} (${pct}%)\n\n--- Detailed Results ---\n${details}\n\nがんばって！`;

        const emailParams = {
          name: playerName,
          email: "noreply@quiz.com",
          subject: subjectStr,
          message: messageStr,
          time: now
        };

        try {
          await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, emailParams, EMAILJS_PUBLIC_KEY);
          $emailRow.innerHTML = `<span class="email-pill sent">✓ Results emailed!</span>`;
        } catch (err) {
          console.error("EmailJS error:", err);
          $emailRow.innerHTML = `<span class="email-pill error">✗ ${err?.text || err?.message || 'Email failed'}</span>`;
        }
      } else {
        $emailRow.innerHTML = `<span class="email-pill error">⚠ EmailJS not configured</span>`;
      }
    }

    /* ── Review + Retake ── */
    $btnReview.addEventListener("click", () => {
      reviewIndices = quiz
        .map((q, i) => ({ i, wrong: answers[i] !== q.plainAnswer }))
        .filter(x => x.wrong)
        .map(x => x.i);
      if (reviewIndices.length === 0) return;
      reviewMode = true;
      currentQ = 0;
      $scoreBanner.style.display = "none";
      $reviewBanner.style.display = "block";
      renderQuestion();
    });

    $btnRetake.addEventListener("click", () => {
      let rawQuestions = [];
      if ($setSelect && config.sets) {
        rawQuestions = config.sets[currentSetKey].questions;
      } else {
        rawQuestions = config.questions;
      }

      quiz = processQuizQuestions(rawQuestions);

      answers = {};
      currentQ = 0;
      submitted = false;
      reviewMode = false;
      reviewIndices = [];
      $scoreBanner.style.display = "none";
      $reviewBanner.style.display = "none";
      $skippedWarning.classList.add("hidden");
      buildNavGrid();
      startTimer();
      renderQuestion();
      updateProgress();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    function renderMatchingUI(q, realIdx) {
      const container = document.createElement("div");
      container.id = "matching-grid-wrapper";
      container.className = "matching-container";

      const given = answers[realIdx];
      const isAnswered = given !== undefined;

      // Set up local transient state if loading an unanswered question
      if (!isAnswered) {
        if (!q.shuffledLeft) {
          q.shuffledLeft = shuffle(q.pairs.map(p => p.base));
          q.shuffledRight = shuffle(q.pairs.map(p => p.conjugated));
          q.localMatched = []; // pairs matched so far
        }
      }

      // Left Column (Bases)
      const leftCol = document.createElement("div");
      leftCol.className = "matching-col";
      leftCol.innerHTML = `<div class="matching-col-title">Adjectives/Items</div>`;
      
      const leftItems = isAnswered ? q.pairs.map(p => p.base) : q.shuffledLeft;
      leftItems.forEach(base => {
        const card = document.createElement("div");
        card.className = "match-card";
        card.textContent = base;
        
        const isAlreadyMatched = isAnswered || q.localMatched.some(pair => pair.left === base);
        if (isAlreadyMatched) {
          card.classList.add("matched");
        } else {
          if (activeLeftSelected === base) card.classList.add("selected");
          card.addEventListener("click", () => {
            if (activeLeftSelected === base) {
              activeLeftSelected = null;
            } else {
              activeLeftSelected = base;
            }
            renderMatchingUIElements(q, container, realIdx);
          });
        }
        leftCol.appendChild(card);
      });

      // Right Column (Conjugations/Matches)
      const rightCol = document.createElement("div");
      rightCol.className = "matching-col";
      rightCol.innerHTML = `<div class="matching-col-title">Matches</div>`;

      const rightItems = isAnswered ? q.pairs.map(p => p.conjugated) : q.shuffledRight;
      rightItems.forEach(conj => {
        const card = document.createElement("div");
        card.className = "match-card";
        card.textContent = conj;

        const isAlreadyMatched = isAnswered || q.localMatched.some(pair => pair.right === conj);
        if (isAlreadyMatched) {
          card.classList.add("matched");
        } else {
          if (activeRightSelected === conj) card.classList.add("selected");
          card.addEventListener("click", () => {
            if (activeRightSelected === conj) {
              activeRightSelected = null;
            } else {
              activeRightSelected = conj;
              // If left was already selected, evaluate match!
              if (activeLeftSelected) {
                evaluateMatch(q, container, realIdx);
                return;
              }
            }
            renderMatchingUIElements(q, container, realIdx);
          });
        }
        rightCol.appendChild(card);
      });

      container.appendChild(leftCol);
      container.appendChild(rightCol);

      $choicesGrid.parentNode.insertBefore(container, $choicesGrid.nextSibling);
    }

    function renderMatchingUIElements(q, container, realIdx) {
      const oldMatching = document.getElementById("matching-grid-wrapper");
      if (oldMatching) oldMatching.remove();
      renderMatchingUI(q, realIdx);
    }

    function evaluateMatch(q, container, realIdx) {
      const left = activeLeftSelected;
      const right = activeRightSelected;

      // Find correct right side
      const pair = q.pairs.find(p => p.base === left);
      const correctRight = pair ? pair.conjugated : null;

      const cards = container.querySelectorAll(".match-card");
      let leftCard, rightCard;
      cards.forEach(c => {
        if (c.textContent === left) leftCard = c;
        if (c.textContent === right) rightCard = c;
      });

      if (right === correctRight) {
        // Correct Match
        q.localMatched.push({ left, right });
        activeLeftSelected = null;
        activeRightSelected = null;

        leftCard.className = "match-card matched";
        rightCard.className = "match-card matched";

        if (q.localMatched.length === q.pairs.length) {
          answers[realIdx] = "completed";
          updateProgress();
          setTimeout(() => {
            renderQuestion();
          }, 500);
        } else {
          renderMatchingUIElements(q, container, realIdx);
        }
      } else {
        // Incorrect Match - flash red and shake
        leftCard.className = "match-card wrong";
        rightCard.className = "match-card wrong";
        activeLeftSelected = null;
        activeRightSelected = null;
        
        setTimeout(() => {
          renderMatchingUIElements(q, container, realIdx);
        }, 500);
      }
    }

    window.jumpToQuestion = function(idx) {
      currentQ = idx;
      renderQuestion();
    };
  });
})();
