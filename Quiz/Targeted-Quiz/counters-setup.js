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

  const tsuCounter = {
    name: 'つ', emoji: '📦', category: 'basic',
    readings: { 1: 'ひとつ', 2: 'ふたつ', 3: 'みっつ', 4: 'よっつ', 5: 'いつつ', 6: 'むっつ', 7: 'ななつ', 8: 'やっつ', 9: 'ここのつ', 10: 'とお', '?': 'いくつ' },
    irregulars: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  };

  const ninCounter = {
    name: 'にん', emoji: '👥', category: 'basic',
    readings: { 1: 'ひとり', 2: 'ふたり', 3: 'さんにん', 4: 'よにん', 5: 'ごにん', 6: 'ろくにん', 7: 'ななにん / しちにん', 8: 'はちにん', 9: 'きゅうにん', 10: 'じゅうにん', '?': 'なんんにん' },
    irregulars: [1, 2, 4, 7]
  };

  const banCounter = {
    name: 'ばん', emoji: '🏆', category: 'basic',
    readings: { 1: 'いちばん', 2: 'にばん', 3: 'さんばん', 4: 'よんばん', 5: 'ごばん', 6: 'ろくばん', 7: 'ななばん', 8: 'はちばん', 9: 'きゅうばん', 10: 'じゅうばん', '?': 'なんばん' },
    irregulars: []
  };

  const maiCounter = {
    name: 'まい', emoji: '📄', category: 'basic',
    readings: { 1: 'いちまい', 2: 'にまい', 3: 'さんまい', 4: 'よんまい', 5: 'ごまい', 6: 'ろくまい', 7: 'ななまい', 8: 'はちまい', 9: 'きゅうまい', 10: 'じゅうまい', '?': 'なんまい' },
    irregulars: []
  };

  const daiCounter = {
    name: 'だい', emoji: '🚗', category: 'advanced',
    readings: { 1: 'いちだい', 2: 'にだい', 3: 'さんだい', 4: 'よんだい', 5: 'ごだい', 6: 'ろくだい', 7: 'ななだい', 8: 'はちだい', 9: 'きゅうだい', 10: 'じゅうだい', '?': 'なんだい' },
    irregulars: []
  };

  const saiCounter = {
    name: 'さい', emoji: '🎂', category: 'advanced',
    readings: { 1: 'いっさい', 2: 'にさい', 3: 'さんさい', 4: 'よnさい', 5: 'ごさい', 6: 'ろくさい', 7: 'ななさい', 8: 'はっさい', 9: 'きゅうさい', 10: 'じゅっさい / じっさい', '?': 'なんさい' },
    irregulars: [1, 8, 10]
  };
  saiCounter.readings[4] = 'よんさい';

  const satsuCounter = {
    name: 'さつ', emoji: '📚', category: 'advanced',
    readings: { 1: 'いっさつ', 2: 'にさつ', 3: 'さんさつ', 4: 'よんさつ', 5: 'ごさつ', 6: 'ろくさつ', 7: 'ななさつ', 8: 'はっさつ', 9: 'きゅうさつ', 10: 'じゅっさつ', '?': 'なんさつ' },
    irregulars: [1, 8, 10]
  };

  const chakuCounter = {
    name: 'ちゃく', emoji: '👔', category: 'advanced',
    readings: { 1: 'いっちゃく', 2: 'にちゃく', 3: 'さんちゃく', 4: 'よんちゃく', 5: 'ごちゃく', 6: 'ろくちゃく', 7: 'ななちゃく', 8: 'はっちゃく', 9: 'きゅうちゃく', 10: 'じゅっちゃく / じっちゃく', '?': 'なんちゃく' },
    irregulars: [1, 8, 10]
  };

  const jikanCounter = {
    name: 'じかん', emoji: '⏰', category: 'time',
    readings: { 1: 'いちじかん', 2: 'にじかん', 3: 'さんじかん', 4: 'よじかん', 5: 'ごじかん', 6: 'ろくじかん', 7: 'ななじかん / しちじかん', 8: 'はちじかん', 9: 'くじかん', 10: 'じゅうじかん', '?': 'なんじかん' },
    irregulars: [4, 7, 9]
  };

  const funCounter = {
    name: 'ふん / ぷん', emoji: '⏱️', category: 'time',
    readings: { 1: 'いっぷん', 2: 'にふん', 3: 'さんぷん', 4: 'よんぷん', 5: 'ごふん', 6: 'ろっぷん', 7: 'ななふん', 8: 'はっぷん', 9: 'きゅうふん', 10: 'じゅっぷん / じっぷん', '?': 'なんぷん' },
    irregulars: [1, 3, 4, 6, 8, 10]
  };

  const nichiCounter = {
    name: 'にち', emoji: '📅', category: 'time',
    readings: { 1: 'いちにか / いちにち', 2: 'ふつか', 3: 'みっか', 4: 'よっか', 5: 'いつか', 6: 'むいか', 7: 'なのか', 8: 'ようか', 9: 'ここのか', 10: 'とおか', '?': 'なんにち' },
    irregulars: [2, 3, 4, 5, 6, 7, 8, 9, 10]
  };

  const shukanCounter = {
    name: 'しゅうかん', emoji: '📆', category: 'time',
    readings: { 1: 'いっしゅうかん', 2: 'にしゅうかん', 3: 'さんしゅうかん', 4: 'よんしゅうかん', 5: 'ごしゅうかん', 6: 'ろくしゅうかん', 7: 'ななしゅうかん', 8: 'はっしゅうかん', 9: 'きゅうしゅうかん', 10: 'じゅっしゅうかん', '?': 'なんしゅうかん' },
    irregulars: [1, 8, 10]
  };

  const kagetsuCounter = {
    name: 'かげつ', emoji: '🗓️', category: 'time',
    readings: { 1: 'いっかげつ', 2: 'にかげつ', 3: 'さんかげつ', 4: 'よんかげつ', 5: 'ごかげつ', 6: 'ろっかげつ', 7: 'ななかげつ', 8: 'はちかげつ / はっかげつ', 9: 'きゅうかげつ', 10: 'じゅっかげつ', '?': 'なんかげつ' },
    irregulars: [1, 6, 8, 10]
  };

  const nenCounter = {
    name: 'ねん', emoji: '📅', category: 'time',
    readings: { 1: 'いちねん', 2: 'にねん', 3: 'さんねん', 4: 'よねん', 5: 'ごねん', 6: 'ろくねん', 7: 'ななねん / しちねん', 8: 'はちねん', 9: 'きゅうねん', 10: 'じゅうねん', '?': 'なんねん' },
    irregulars: [4, 7]
  };

  const kaiCounter = {
    name: 'かい', emoji: '🔄', category: 'advanced',
    readings: { 1: 'いっかい', 2: 'にかい', 3: 'さんかい', 4: 'よんかい', 5: 'ごかい', 6: 'ろっかい', 7: 'ななかい', 8: 'はっかい', 9: 'きゅうかい', 10: 'じゅっかい', '?': 'なんかい' },
    irregulars: [1, 6, 8, 10]
  };

  const koCounter = {
    name: 'こ', emoji: '🔵', category: 'basic',
    readings: { 1: 'いっこ', 2: 'にこ', 3: 'さんこ', 4: 'よんこ', 5: 'ごこ', 6: 'ろっこ', 7: 'ななこ', 8: 'はっこ', 9: 'きゅうこ', 10: 'じゅっこ', '?': 'なんこ' },
    irregulars: [1, 6, 8, 10]
  };

  const sokuCounter = {
    name: 'そく', emoji: '👟', category: 'advanced',
    readings: { 1: 'いっそく', 2: 'にそく', 3: 'さんぞく', 4: 'よんそく', 5: 'ごそく', 6: 'ろくそく', 7: 'ななそく', 8: 'はっそく', 9: 'きゅうそく', 10: 'じゅっそく / じっそく', '?': 'なんそく' },
    irregulars: [1, 3, 8, 10]
  };

  const kenCounter = {
    name: 'けん', emoji: '🏠', category: 'advanced',
    readings: { 1: 'いっけん', 2: 'にけん', 3: 'さんげん', 4: 'よんけん', 5: 'ごけん', 6: 'ろっけん', 7: 'ななけん', 8: 'はっけん', 9: 'きゅうけん', 10: 'じゅっけん / じっけん', '?': 'なんげん' },
    irregulars: [1, 3, 6, 8, 10]
  };

  const kaiFloorCounter = {
    name: 'かい (floors)', emoji: '🏢', category: 'advanced',
    readings: { 1: 'いっかい', 2: 'にかい', 3: 'さんがい', 4: 'よんかい', 5: 'ごかい', 6: 'ろっかい', 7: 'ななかい', 8: 'はっかい', 9: 'きゅうかい', 10: 'じゅっかい / じっかい', '?': 'なんがい' },
    irregulars: [1, 3, 6, 8, 10]
  };

  const honCounter = {
    name: 'ほん / ぼん / ぽん', emoji: '🖊️', category: 'advanced',
    readings: { 1: 'いっぽん', 2: 'にほん', 3: 'さんぼん', 4: 'よんほん', 5: 'ごほん', 6: 'ろっぽん', 7: 'ななほん', 8: 'はっぽん / はちほん', 9: 'きゅうほん', 10: 'じゅっぽん', '?': 'なんぼん' },
    irregulars: [1, 3, 6, 8, 10]
  };

  const haiCounter = {
    name: 'はい / ばい / ぱい', emoji: '☕', category: 'advanced',
    readings: { 1: 'いっぱい', 2: 'にはい', 3: 'さんばい', 4: 'よんはい', 5: 'ごはい', 6: 'ろっぱい', 7: 'ななはい', 8: 'はっぱい / はちはい', 9: 'きゅうはい', 10: 'じゅっぱい', '?': 'なんばい' },
    irregulars: [1, 3, 6, 8, 10]
  };

  const hikiCounter = {
    name: 'ひき / びき / ぴき', emoji: '🐱', category: 'advanced',
    readings: { 1: 'いっぴき', 2: 'にひき', 3: 'さんびき', 4: 'よんひき', 5: 'ごひき', 6: 'ろっぴき', 7: 'ななひき', 8: 'はっぴき', 9: 'きゅうひき', 10: 'じゅっぴき', '?': 'なんびき' },
    irregulars: [1, 3, 6, 8, 10]
  };

  const basicCounters = [tsuCounter, ninCounter, koCounter, maiCounter, banCounter];
  const timeCounters = [jikanCounter, funCounter, nichiCounter, shukanCounter, kagetsuCounter, nenCounter];
  const advancedCounters = [satsuCounter, daiCounter, saiCounter, chakuCounter, honCounter, haiCounter, hikiCounter, sokuCounter, kenCounter, kaiFloorCounter, kaiCounter];
  const allCounters = [...basicCounters, ...timeCounters, ...advancedCounters];

  function getCounterDescription(counter) {
    const descriptions = {
      'つ': 'General things',
      'にん': 'People',
      'ばん': 'Order/Ranking',
      'まい': 'Flat things (paper, shirts)',
      'だい': 'Machines & vehicles',
      'さい': 'Age',
      'さつ': 'Books & notebooks',
      'ちゃく': 'Clothes',
      'じかん': 'Hours (duration)',
      'ふん / ぷん': 'Minutes',
      'にch': 'Days', // original typo/fix in source: 'にち'
      'しゅうかん': 'Weeks',
      'かげつ': 'Months',
      'ねん': 'Years',
      'かい': 'Frequency (times)',
      'ko': 'Small things', // original typo/fix in source: 'こ'
      'そく': 'Pairs (shoes, socks)',
      'けん': 'Houses & buildings',
      'かい (floors)': 'Floors of a building',
      'ほん / ぼん / ぽん': 'Long thin things',
      'はい / ばい / ぱい': 'Cups & glasses',
      'ひき / びき / ぴき': 'Small animals'
    };
    descriptions['にち'] = 'Days';
    descriptions['こ'] = 'Small things';
    return descriptions[counter.name] || counter.name;
  }

  function generateSectionQuestions(counters, count, categoryName, tagClass) {
    const questions = [];
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    while (questions.length < count) {
      const counter = counters[Math.floor(Math.random() * counters.length)];
      const number = numbers[Math.floor(Math.random() * numbers.length)];

      const duplicate = questions.some(q => q.counter.name === counter.name && q.number === number);
      if (!duplicate) {
        questions.push(generateQuestion(counter, number, categoryName, tagClass));
      }
    }
    return shuffle(questions);
  }

  function getCounterExplanation(counter, number, correctAnswer, choices) {
    const isIrregular = counter.irregulars.includes(number);
    let ruleText = "This follows the standard pronunciation pattern for the counter <strong>" + counter.name + "</strong>.";
    if (isIrregular) {
      ruleText = "⚠️ Note: This is an <strong>irregular pronunciation</strong> (ふきそくけい) for the counter <strong>" + counter.name + "</strong>.";
    }
    
    let explainHtml = 'The correct choice is <strong>「' + correctAnswer + '」</strong>. ' + ruleText + '<br><br><strong>Why other choices are incorrect:</strong><br>';
    
    choices.forEach(opt => {
      if (opt === correctAnswer) return;
      
      let matchingNum = null;
      for (const key in counter.readings) {
        const readings = counter.readings[key].split(' / ');
        if (readings.includes(opt)) {
          matchingNum = key;
          break;
        }
      }
      
      if (matchingNum) {
        explainHtml += '• <code>' + opt + '</code> is the reading for <strong>' + matchingNum + '</strong> items, not ' + number + '.<br>';
      } else {
        explainHtml += '• <code>' + opt + '</code> is an incorrect reading for the counter <strong>' + counter.name + '</strong>.<br>';
      }
    });
    
    return explainHtml;
  }

  function generateQuestion(counter, number, categoryName, tagClass) {
    const correctAnswer = counter.readings[number];
    const isIrregular = counter.irregulars.includes(number);

    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const distractors = shuffle(numbers.filter(n => n !== number))
      .map(n => counter.readings[n])
      .filter(val => val !== correctAnswer);

    const choices = shuffle([correctAnswer, ...distractors.slice(0, 3)]);

    return {
      counter: counter,
      number: number,
      category: categoryName,
      tagClass: tagClass,
      type: 'counter',
      correctAnswer: correctAnswer,
      choices: choices,
      isIrregular: isIrregular,
      stem: `How do you read <span class="blank">${number}</span> of these?<br>
             <span style="font-size: 58px; margin: 16px 0; display: block; text-align: center;">${counter.emoji}</span>
             <span style="font-size: 14px; color: #667085; display: block; text-align: center;">
               Object: <strong>${getCounterDescription(counter)}</strong> (Indicator: <strong>${counter.name}</strong>)
             </span>`,
      correctNote: `Pronunciation: <span class="jp">${correctAnswer}</span>.`,
      explain: getCounterExplanation(counter, number, correctAnswer, choices)
    };
  }

  const basicQ = generateSectionQuestions(basicCounters, 12, 'Basic Counters', 'basic');
  const timeQ = generateSectionQuestions(timeCounters, 14, 'Time Counters', 'time');
  const advQ = generateSectionQuestions(advancedCounters, 12, 'Advanced Counters', 'advanced');
  const mixQ = generateSectionQuestions(allCounters, 12, 'Mixed Counters', 'mixed');
  const rawQuestions = [...basicQ, ...timeQ, ...advQ, ...mixQ];

  const processedQuestions = rawQuestions.map(q => {
    return {
      type: q.type || "",
      stem: encodeBase64(q.stem || ""),
      answer: encodeBase64(q.correctAnswer || ""),
      choices: q.choices ? q.choices : null,
      correctNote: q.correctNote ? encodeBase64(q.correctNote) : null,
      explain: q.explain ? encodeBase64(q.explain) : null
    };
  });

  window.quizConfig = {
    lessonTitle: "Japanese Counter Practice Quiz",
    lessonTitleShort: "Counter Quiz",
    badge: "JLPT N5 Review",
    subtitle: "Complete 50 dynamic practice items",
    emailSubject: "Counters Quiz",
    questions: processedQuestions
  };
})();
