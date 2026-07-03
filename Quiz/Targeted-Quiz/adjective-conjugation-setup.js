(function() {
  function encodeBase64(str) {
    if (!str) return "";
    try {
      return btoa(unescape(encodeURIComponent(str)));
    } catch (e) {
      console.error("Encoding failed", e);
      return str;
    }
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const iAdjectives = [
    { base: 'たかい', meaning: 'expensive/tall' },
    { base: 'やすい', meaning: 'cheap' },
    { base: 'あた新しい', meaning: 'new' }, // original typo/fix in source: 'あたらしい'
    { base: 'ふるい', meaning: 'old (things)' },
    { base: 'おおきい', meaning: 'big' },
    { base: 'ちいさい', meaning: 'small' },
    { base: 'おもしろい', meaning: 'interesting' },
    { base: 'つまらない', meaning: 'boring' },
    { base: 'むずかしい', meaning: 'difficult' },
    { base: 'やさしい', meaning: 'easy/kind' },
    { base: 'あつい', meaning: 'hot' },
    { base: 'さむい', meaning: 'cold' },
    { base: 'いそがしい', meaning: 'busy' },
    { base: 'いい', meaning: 'good', irregular: true }
  ];
  // Fix spelling if needed, let's keep exact database as original:
  iAdjectives[2].base = 'あたらしい'; 

  const naAdjectives = [
    { base: 'しずか', meaning: 'quiet' },
    { base: 'にぎやか', meaning: 'lively' },
    { base: 'げんき', meaning: 'energetic' },
    { base: 'きれい', meaning: 'beautiful/clean' },
    { base: 'ゆうめい', meaning: 'famous' },
    { base: 'しんせつ', meaning: 'kind' },
    { base: 'べんり', meaning: 'convenient' },
    { base: 'ひま', meaning: 'free (time)' },
    { base: 'すき', meaning: 'like' },
    { base: 'きらい', meaning: 'dislike' },
    { base: 'じょうず', meaning: 'skillful' },
    { base: 'へた', meaning: 'unskillful' }
  ];

  function conjugateIAdj(adj, tense, polarity) {
    const stem = adj.base.slice(0, -1);
    if (adj.irregular && adj.base === 'いい') {
      if (tense === 'present' && polarity === 'positive') return 'いい です';
      if (tense === 'present' && polarity === 'negative') return 'よくない です';
      if (tense === 'past' && polarity === 'positive') return 'よかった です';
      if (tense === 'past' && polarity === 'negative') return 'よくなかった です';
    }
    if (tense === 'present' && polarity === 'positive') return adj.base + ' です';
    if (tense === 'present' && polarity === 'negative') return stem + 'くない です';
    if (tense === 'past' && polarity === 'positive') return stem + 'かった です';
    if (tense === 'past' && polarity === 'negative') return stem + 'くなかった です';
  }

  function conjugateNaAdj(adj, tense, polarity) {
    if (tense === 'present' && polarity === 'positive') return adj.base + ' です';
    if (tense === 'present' && polarity === 'negative') return adj.base + ' じゃありません';
    if (tense === 'past' && polarity === 'positive') return adj.base + ' でした';
    if (tense === 'past' && polarity === 'negative') return adj.base + ' じゃありませんでした';
  }

  const sentenceQuestionsStatic = [
    {
      "english": "This town is quiet.",
      "template": "この まちは ____。",
      "correctAnswer": "しずか です",
      "type": "na-adj",
      "tense": "present",
      "choices": ["しずか です", "しずかな です", "しずかい です", "しずかでした"],
      "correctNote": "しずか is a な-adjective. In present positive, it conjugates as: しずか です.",
      "explain": "The correct choice is <strong>「しずか です」</strong>. しずか is a な-adjective, and in the present positive, it takes です directly without keeping \"na\" at the end of a sentence.<br><br><strong>Why other choices are incorrect:</strong><br>• <code>しずかな です</code> is incorrect because you cannot keep the modifying \"な\" when ending a sentence.<br>• <code>しずかい です</code> is incorrect because it treats the な-adjective as an い-adjective.<br>• <code>しずかでした</code> is incorrect because it represents the past tense, which contradicts the present tense English prompt ('is quiet')."
    },
    {
      "english": "That book was not interesting.",
      "template": "あの ほんは ____。",
      "correctAnswer": "おもしろくなかった です",
      "type": "i-adj",
      "tense": "past",
      "choices": ["おもしろくなかった です", "おもしろいじゃありませんでした", "おもしろくない です", "おもしろかった です"],
      "correctNote": "おもしろい is an い-adjective. Past negative conjugation: remove \"i\" ➔ add \"kunakatta\" + です ➔ おもしろくなかった です.",
      "explain": "The correct choice is <strong>「おもしろくなかった です」</strong>. おもしろい is an い-adjective, and its past negative form is created by replacing the final \"い\" with \"くなかった\" + です.<br><br><strong>Why other choices are incorrect:</strong><br>• <code>おもしろいじゃありませんでした</code> is incorrect because \"じゃありませんでした\" is only used for nouns/な-adjectives, never for い-adjectives.<br>• <code>おもしろくない です</code> is incorrect because it represents the present negative form ('is not interesting'), which contradicts the past tense 'was not'.<br>• <code>おもしろかった です</code> is incorrect because it represents the past positive form ('was interesting'), which contradicts the negative meaning."
    },
    {
      "english": "Yamada is not energetic.",
      "template": "やまださんは ____。",
      "correctAnswer": "げんき じゃありません",
      "type": "na-adj",
      "tense": "present",
      "choices": ["げんき じゃありません", "げんきくない です", "げんき でした", "げんきない です"],
      "correctNote": "げんき is a な-adjective. Present negative conjugation: げんき じゃありません.",
      "explain": "The correct choice is <strong>「げんき じゃありません」</strong>. げんき is a な-adjective, which conjugates using \"じゃありません\" in the present negative.<br><br><strong>Why other choices are incorrect:</strong><br>• <code>げんきくない です</code> is incorrect because it treats げんき as an い-adjective.<br>• <code>げんき でした</code> is incorrect because it represents the past positive form ('was energetic'), which contradicts the present negative.<br>• <code>げんきない です</code> is incorrect because \"ない\" cannot attach directly to a な-adjective stem in this manner."
    },
    {
      "english": "Yesterday was hot.",
      "template": "きのうは ____。",
      "correctAnswer": "あつかった です",
      "type": "i-adj",
      "tense": "past",
      "choices": ["あつかった です", "あついでした", "あつい です", "あつくなかった です"],
      "correctNote": "あつい is an い-adjective. Past positive conjugation: remove \"i\" ➔ add \"katta\" + です ➔ あつかった です.",
      "explain": "The correct choice is <strong>「あつかった です」</strong>. あつい is an い-adjective, and its past positive form is created by replacing the final \"い\" with \"かった\" + です.<br><br><strong>Why other choices are incorrect:</strong><br>• <code>あついでした</code> is incorrect because you cannot append \"でした\" directly to the dictionary form of an い-adjective.<br>• <code>あつい です</code> is incorrect because it represents the present positive form ('is hot'), which contradicts the past tense 'was hot'.<br>• <code>あつくなかった です</code> is incorrect because it represents the past negative form ('was not hot')."
    },
    {
      "english": "This room was not clean.",
      "template": "この へやは ____。",
      "correctAnswer": "きれい じゃありませんでした",
      "type": "na-adj",
      "tense": "past",
      "choices": ["きれい じゃありませんでした", "きれいくなかった です", "きれい でした", "きれい じゃありません"],
      "correctNote": "きれい is a な-adjective exception. Past negative: きれい じゃありませんでした.",
      "explain": "The correct choice is <strong>「きれい じゃありませんでした」</strong>. きれい is a な-adjective exception (ends in \"i\" sound but conjugates as な). Its past negative form is \"じゃありませんでした\".<br><br><strong>Why other choices are incorrect:</strong><br>• <code>きれいくなかった です</code> is incorrect because it treats きれい as an い-adjective.<br>• <code>きれい でした</code> is incorrect because it represents the past positive form ('was clean').<br>• <code>きれい じゃありません</code> is incorrect because it represents the present negative form ('is not clean')."
    },
    {
      "english": "Japanese is not difficult.",
      "template": "にほんごは ____。",
      "correctAnswer": "むずかしくない です",
      "type": "i-adj",
      "tense": "present",
      "choices": ["むずかしくない です", "むずかし じゃありません", "むずかしい です", "むずかしくなかった です"],
      "correctNote": "むずかしい is an い-adjective. Present negative: むずかしくない です.",
      "explain": "The correct choice is <strong>「むずかしくない です」</strong>. むずかしい is an い-adjective, and its present negative form is created by replacing the final \"い\" with \"くない\" + です.<br><br><strong>Why other choices are incorrect:</strong><br>• <code>むずかし じゃありません</code> is incorrect because \"じゃありません\" is only used for nouns/な-adjectives, never for い-adjectives.<br>• <code>むずかしい です</code> is incorrect because it represents the present positive form ('is difficult').<br>• <code>むずかしくなかった です</code> is incorrect because it represents the past negative form ('was not difficult')."
    },
    {
      "english": "That person was famous.",
      "template": "あの ひとは ____。",
      "correctAnswer": "ゆうめい でした",
      "type": "na-adj",
      "tense": "past",
      "choices": ["ゆうめい でした", "ゆうめいかった です", "ゆうめい です", "ゆうめい じゃありませんでした"],
      "correctNote": "ゆうめい is a な-adjective. Past positive: ゆうめい でした.",
      "explain": "The correct choice is <strong>「ゆうめい でした」</strong>. ゆうめい is a な-adjective (ends in \"i\" phonetically but conjugates as な). Its past positive form ends in \"でした\".<br><br><strong>Why other choices are incorrect:</strong><br>• <code>ゆうめいかった です</code> is incorrect because it treats ゆうめい as an い-adjective.<br>• <code>ゆうめい です</code> is incorrect because it represents the present positive form ('is famous').<br>• <code>ゆうめい じゃありませんでした</code> is incorrect because it represents the past negative form ('was not famous')."
    },
    {
      "english": "The weather was good.",
      "template": "てんきは ____。",
      "correctAnswer": "よかった です",
      "type": "i-adj",
      "tense": "past",
      "choices": ["よかった です", "いいかった です", "いい でした", "よくなかった です"],
      "correctNote": "いい (good) is irregular. Past positive: よかった です.",
      "explain": "The correct choice is <strong>「よかった です」</strong>. The adjective いい is irregular and conjugates using its alternative form よい. Its past positive form is よかったです.<br><br><strong>Why other choices are incorrect:</strong><br>• <code>いいかった です</code> is incorrect because you cannot conjugate the base form いい directly with adjective suffixes.<br>• <code>いい でした</code> is incorrect because you cannot attach \"でした\" directly to the dictionary form of an い-adjective.<br>• <code>よくなかった です</code> is incorrect because it represents the past negative form ('was not good')."
    }
  ];

  function getConjugationExplanation(adj, tense, polarity, correctAns, choices, isI) {
    const stem = isI ? adj.base.slice(0, -1) : adj.base;
    let ruleText = "";
    if (isI) {
      if (adj.irregular && adj.base === 'いい') {
        if (tense === 'present' && polarity === 'positive') ruleText = 'irregular base present positive is standard <strong>いい です</strong>.';
        if (tense === 'present' && polarity === 'negative') ruleText = 'stem changes to よ + くないです ➔ <strong>よくない です</strong>.';
        if (tense === 'past' && polarity === 'positive') ruleText = 'stem changes to よ + かったですよ ➔ <strong>よかった です</strong>.';
        if (tense === 'past' && polarity === 'negative') ruleText = 'stem changes to よ + くなかったです ➔ <strong>よくなかった です</strong>.';
      } else {
        if (tense === 'present' && polarity === 'positive') ruleText = 'add です directly to dictionary form ➔ <strong>' + adj.base + ' です</strong>.';
        if (tense === 'present' && polarity === 'negative') ruleText = 'replace final い with くない + です ➔ <strong>' + stem + 'くない です</strong>.';
        if (tense === 'past' && polarity === 'positive') ruleText = 'replace final い with かった + です ➔ <strong>' + stem + 'かった です</strong>.';
        if (tense === 'past' && polarity === 'negative') ruleText = 'replace final い with くなかった + です ➔ <strong>' + stem + 'くなかった です</strong>.';
      }
    } else {
      if (tense === 'present' && polarity === 'positive') ruleText = 'add です to stem ➔ <strong>' + adj.base + ' です</strong>.';
      if (tense === 'present' && polarity === 'negative') ruleText = 'add じゃありません to stem ➔ <strong>' + adj.base + ' じゃありません</strong>.';
      if (tense === 'past' && polarity === 'positive') ruleText = 'add でした to stem ➔ <strong>' + adj.base + ' でした</strong>.';
      if (tense === 'past' && polarity === 'negative') ruleText = 'add じゃありませんでした to stem ➔ <strong>' + adj.base + ' じゃありませんでした</strong>.';
    }

    let explainHtml = '<strong>Correct Choice: 「' + correctAns + '」</strong><br>' +
      'To conjugate ' + (isI ? 'い' : 'な') + '-adjective <code>' + adj.base + '</code> (' + adj.meaning + ') into <em>' + tense + ' ' + polarity + '</em>, ' + ruleText + '<br><br>' +
      '<strong>Why other choices are incorrect:</strong><br>';
    
    choices.forEach(opt => {
      if (opt === correctAns) return;
      let desc = 'incorrect form';
      if (isI) {
        if (opt.includes('じゃありません')) desc = 'noun/な-adjective negative suffix (invalid for い-adjectives)';
        else if (opt.includes('でした') && !opt.includes('かった')) desc = 'past polite copula attached directly (invalid for い-adjectives)';
        else if (opt.includes('くない')) desc = 'present negative form';
        else if (opt.includes('くなかった')) desc = 'past negative form';
        else if (opt.includes('かった')) desc = 'past positive form';
      } else {
        if (opt.endsWith('い です') || opt.includes('くない')) desc = 'い-adjective style conjugation (invalid for な-adjectives)';
        else if (opt.includes('じゃありませんでした')) desc = 'past negative form';
        else if (opt.includes('じゃありません')) desc = 'present negative form';
        else if (opt.endsWith('でした')) desc = 'past positive form';
      }
      explainHtml += '• <code>' + opt + '</code> represents the ' + desc + ', which is incorrect for this slot.<br>';
    });
    
    return explainHtml;
  }

  function generateConjugationQuestions() {
    const list = [];
    const tenses = ['present', 'past'];
    const polarities = ['positive', 'negative'];
    
    const shuffledI = shuffle(iAdjectives);
    for (let i = 0; i < 8; i++) {
      const adj = shuffledI[i % shuffledI.length];
      const tense = tenses[Math.floor(Math.random() * 2)];
      const polarity = polarities[Math.floor(Math.random() * 2)];
      const ans = conjugateIAdj(adj, tense, polarity);
      
      const optionsSet = new Set([ans]);
      const stem = adj.base.slice(0, -1);
      const distractors = [
        adj.base + ' です',
        stem + 'くない です',
        stem + 'かった です',
        stem + 'くなかった です',
        adj.base + ' でした',
        stem + ' じゃありません'
      ];
      shuffle(distractors).forEach(d => { if (optionsSet.size < 4) optionsSet.add(d); });
      
      list.push({
        type: 'i-adj',
        stem: `Conjugate this adjective into <span class="blank">${tense} ${polarity}</span>:<br><span class="jp" style="font-size:26px; color:#a9342a;">${adj.base}</span> (${adj.meaning})`,
        correctAnswer: ans,
        choices: shuffle(Array.from(optionsSet)),
        correctNote: `Conjugation result: <span class="jp">${ans}</span>.`,
        explain: getConjugationExplanation(adj, tense, polarity, ans, Array.from(optionsSet), true)
      });
    }

    const shuffledNa = shuffle(naAdjectives);
    for (let i = 0; i < 8; i++) {
      const adj = shuffledNa[i % shuffledNa.length];
      const tense = tenses[Math.floor(Math.random() * 2)];
      const polarity = polarities[Math.floor(Math.random() * 2)];
      const ans = conjugateNaAdj(adj, tense, polarity);
      
      const optionsSet = new Set([ans]);
      const distractors = [
        adj.base + ' です',
        adj.base + ' じゃありません',
        adj.base + ' でした',
        adj.base + ' じゃありませんでした',
        adj.base + 'い です',
        adj.base + 'くない です'
      ];
      shuffle(distractors).forEach(d => { if (optionsSet.size < 4) optionsSet.add(d); });

      list.push({
        type: 'na-adj',
        stem: `Conjugate this adjective into <span class="blank">${tense} ${polarity}</span>:<br><span class="jp" style="font-size:26px; color:#a9342a;">${adj.base}</span> (${adj.meaning})`,
        correctAnswer: ans,
        choices: shuffle(Array.from(optionsSet)),
        correctNote: `Conjugation result: <span class="jp">${ans}</span>.`,
        explain: getConjugationExplanation(adj, tense, polarity, ans, Array.from(optionsSet), false)
      });
    }
    return shuffle(list);
  }

  function generateMatchingQuestions() {
    const matchQuestions = [];
    const tenses = ['present', 'past'];
    const polarities = ['positive', 'negative'];

    for (let set = 0; set < 3; set++) {
      const pairs = [];
      const used = new Set();
      
      for (let i = 0; i < 4; i++) {
        let adj, isI;
        do {
          isI = Math.random() > 0.5;
          adj = isI ? iAdjectives[Math.floor(Math.random() * iAdjectives.length)] 
                    : naAdjectives[Math.floor(Math.random() * naAdjectives.length)];
        } while (used.has(adj.base));
        
        used.add(adj.base);
        const tense = tenses[Math.floor(Math.random() * 2)];
        const polarity = polarities[Math.floor(Math.random() * 2)];
        const conjugated = isI ? conjugateIAdj(adj, tense, polarity) : conjugateNaAdj(adj, tense, polarity);
        
        pairs.push({
          base: adj.base + (isI ? ' (い)' : ' (な)'),
          conjugated: conjugated,
          desc: `${adj.base} (${tense} ${polarity})`
        });
      }

      const explainText = pairs.map(p => `• <strong>${p.base}</strong> ➔ <span class="jp">${p.conjugated}</span>`).join('<br>');

      matchQuestions.push({
        type: 'matching',
        stem: `👥 Match the base adjectives on the left with their correct conjugated forms on the right.`,
        pairs: pairs,
        correctAnswer: 'completed',
        correctNote: 'Matched all 4 pairs correctly! 🌸',
        explain: `<div style="margin-top:8px;"><strong>Correct Pairs:</strong><br>${explainText}</div>`
      });
    }
    return matchQuestions;
  }

  function generateSentenceQuestions() {
    const list = sentenceQuestionsStatic.map(q => ({
      type: q.type,
      stem: `Complete the sentence:<br><span class="jp" style="font-size:22px;">${q.template}</span><br><span style="color:#667085; font-size:14px;">"${q.english}"</span>`,
      correctAnswer: q.correctAnswer,
      choices: q.choices,
      correctNote: q.correctNote,
      explain: q.explain
    }));
    return shuffle(list);
  }

  const conjQ = generateConjugationQuestions();
  const matchQ = generateMatchingQuestions();
  const sentQ = generateSentenceQuestions();
  const rawQuestions = [...conjQ, ...matchQ, ...sentQ];

  const processedQuestions = rawQuestions.map(q => {
    return {
      type: q.type || "",
      stem: encodeBase64(q.stem || ""),
      answer: encodeBase64(q.correctAnswer || ""),
      choices: q.choices ? q.choices : null,
      pairs: q.pairs ? q.pairs : null,
      correctNote: q.correctNote ? encodeBase64(q.correctNote) : null,
      explain: q.explain ? encodeBase64(q.explain) : null
    };
  });

  window.quizConfig = {
    lessonTitle: "Adjective Conjugation Practice | N5",
    lessonTitleShort: "Adjective Conjugation",
    badge: "JLPT N5 Review",
    subtitle: "Conjugation & Sentences · N5 Level",
    emailSubject: "Adjective Conjugation Quiz",
    questions: processedQuestions
  };
})();
