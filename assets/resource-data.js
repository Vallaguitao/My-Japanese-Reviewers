(function () {
  const range = (start, end) => Array.from({ length: end - start + 1 }, (_, index) => start + index);

  const GROUPS = [
    { id: 'all', label: 'All Resources', shortLabel: 'All', description: 'Every linked lesson, reviewer, quiz, and practice page.' },
    { id: 'n5-lessons', label: 'N5 Lessons', shortLabel: 'N5', description: 'Minna no Nihongo N5 lesson sequence.' },
    { id: 'n4-book-1', label: 'N4 Book 1', shortLabel: 'N4-1', description: 'Irodori A2 Book 1 lessons.' },
    { id: 'n4-book-2', label: 'N4 Book 2', shortLabel: 'N4-2', description: 'Irodori A2 Book 2 lessons.' },
    { id: 'specialized-lessons', label: 'Specialized Lessons', shortLabel: 'Special', description: 'Focused lessons for high-value grammar, kana, and form patterns.' },
    { id: 'vocabulary', label: 'Vocabulary', shortLabel: 'Vocab', description: 'Lesson vocabulary exams and vocabulary reviewers.' },
    { id: 'kanji', label: 'Kanji', shortLabel: 'Kanji', description: 'Kanji flashcards, explorer, and kanji quiz.' },
    { id: 'quizzes', label: 'Core Quizzes', shortLabel: 'Quizzes', description: 'Grammar, reading, kanji, and expression quizzes that are not mock exams.' },
    { id: 'targeted-quiz', label: 'Targeted Quiz', shortLabel: 'Targeted', description: 'Focused drills for one skill at a time: adjectives, counters, and verb forms.' },
    { id: 'jlpt-mock', label: 'JLPT Mock', shortLabel: 'JLPT', description: 'JLPT-style exam simulation and mixed N5/N4 review.' },
    { id: 'jft-mock', label: 'JFT Mock', shortLabel: 'JFT', description: 'JFT-style mock exam sets for practical daily-life Japanese.' }
  ];

  const n5Topics = [
    '',
    'Basic introductions and wa / desu patterns.',
    'Kore, sore, are, and no connections.',
    'Koko, soko, asoko, and place references.',
    'Time expressions and daily schedule basics.',
    'Movement particles and destination expressions.',
    'Objects, actions, o, and de usage.',
    'Giving, receiving, and useful classroom language.',
    'Adjective basics for describing people and things.',
    'Suki, kirai, jouzu, and preference patterns.',
    'Existence with arimasu and imasu.',
    'Counters, numbers, and quantity expressions.',
    'Comparison patterns and choosing between options.',
    'Wanting and tai form.',
    'Te-form basics and connected actions.',
    'Permission, prohibition, and request patterns.',
    'Sequences of actions and daily explanations.',
    'Nai-form and negative requests.',
    'Dictionary form and ability-style expressions.',
    'Ta-form experiences and past actions.',
    'Plain form and casual grammar foundations.',
    'Opinions and to omoimasu patterns.',
    'Noun modification and longer phrases.',
    'When clauses with toki.',
    'Giving help and kuremasu patterns.',
    'Conditional review and final N5 grammar practice.'
  ];

  function resource(item) {
    return Object.assign({
      tags: [],
      related: [],
      actionLabel: '',
      searchable: ''
    }, item);
  }

  function n5Lesson(no) {
    return resource({
      id: `n5-lesson-${no}`,
      group: 'n5-lessons',
      groupLabel: 'N5 Lessons',
      type: 'Lesson',
      title: `N5 Lesson ${no}`,
      description: n5Topics[no],
      path: `Lessons/N5-Lessons/Lesson_${no}.html`,
      tags: ['N5', 'Grammar', `Lesson ${no}`],
      sequenceKey: 'n5-lessons',
      sequenceIndex: no,
      sequenceTotal: 25,
      related: [
        { label: `Vocabulary ${no}`, path: `Vocabulary/vocabulary${no}.html` },
        { label: 'N5 grammar reviewer', path: 'Quiz/Grammar_n5.html' }
      ]
    });
  }

  function n4Lesson(book, no) {
    const group = book === 1 ? 'n4-book-1' : 'n4-book-2';
    const folder = book === 1 ? 'N4-Lessons-Book-1' : 'N4-Lessons-Book 2';
    return resource({
      id: `n4-book-${book}-lesson-${no}`,
      group,
      groupLabel: `N4 Book ${book}`,
      type: 'Lesson',
      title: `N4 Book ${book} Lesson ${no}`,
      description: `Irodori A2 Book ${book} lesson review.`,
      path: `Lessons/${folder}/Lesson_${no}.html`,
      tags: ['N4', 'Irodori A2', `Lesson ${no}`],
      sequenceKey: group,
      sequenceIndex: no,
      sequenceTotal: 18,
      related: [
        { label: 'A2 grammar quiz', path: 'Quiz/N4-Book-2.html' },
        { label: 'Expression practice', path: 'Quiz/Expressions-1_n4.html' }
      ]
    });
  }

  function vocabulary(no) {
    return resource({
      id: `vocabulary-${no}`,
      group: 'vocabulary',
      groupLabel: 'Vocabulary',
      type: 'Vocabulary',
      title: `N5 Vocabulary Lesson ${no}`,
      description: 'Lesson vocabulary exam for N5 review.',
      path: `Vocabulary/vocabulary${no}.html`,
      tags: ['N5', 'Words', `Lesson ${no}`],
      sequenceKey: 'vocabulary',
      sequenceIndex: no,
      sequenceTotal: 25,
      related: [
        { label: `N5 Lesson ${no}`, path: `Lessons/N5-Lessons/Lesson_${no}.html` },
        { label: 'Lesson selector', path: 'Quiz/Vocabulary-1_n5.html' }
      ]
    });
  }

  const RESOURCES = [
    ...range(1, 25).map(n5Lesson),
    resource({
      id: 'verb-conjugation-lesson',
      group: 'specialized-lessons',
      groupLabel: 'Specialized Lessons',
      type: 'Lesson',
      title: 'Verb Conjugation Lesson',
      description: 'Focused guide for Japanese verb conjugation forms.',
      path: 'Specialized-Lessons/Verb_Conjugation_Lesson.html',
      tags: ['Specialized', 'Conjugation', 'Verb'],
      actionLabel: 'Open Lesson',
      related: [{ label: 'Verb conjugation quiz', path: 'Targeted-Quiz/Verb_Conjugation_Quiz.html' }]
    }),

    ...range(1, 18).map(no => n4Lesson(1, no)),
    ...range(1, 18).map(no => n4Lesson(2, no)),

    ...range(1, 25).map(vocabulary),
    resource({
      id: 'vocabulary-selector',
      group: 'vocabulary',
      groupLabel: 'Vocabulary',
      type: 'Tool',
      title: 'N5 Vocabulary Lesson Selector',
      description: 'Choose any N5 vocabulary lesson from one page.',
      path: 'Quiz/Vocabulary-1_n5.html',
      tags: ['N5', 'Vocabulary', 'Selector'],
      related: [{ label: 'Vocabulary 1', path: 'Vocabulary/vocabulary1.html' }]
    }),
    resource({
      id: 'full-vocabulary-reviewer',
      group: 'vocabulary',
      groupLabel: 'Vocabulary',
      type: 'Reviewer',
      title: 'Full N5 Vocabulary Reviewer',
      description: 'Full Minna no Nihongo N5 vocabulary reviewer.',
      path: 'Quiz/Vocabulary-2_n5.html',
      tags: ['N5', 'Vocabulary', 'Reviewer'],
      related: [{ label: 'Lesson selector', path: 'Quiz/Vocabulary-1_n5.html' }]
    }),

    resource({
      id: 'kanji-flashcards',
      group: 'kanji',
      groupLabel: 'Kanji',
      type: 'Kanji',
      title: 'N5 Kanji Flashcards',
      description: 'Flashcard-style N5 kanji memory practice.',
      path: 'Kanji/Kanji_flashcard.html',
      tags: ['N5', 'Kanji', 'Flashcards'],
      related: [{ label: 'Kanji explorer', path: 'Kanji/Kanji_dictionary.html' }]
    }),
    resource({
      id: 'kanji-explorer',
      group: 'kanji',
      groupLabel: 'Kanji',
      type: 'Kanji',
      title: 'JLPT Kanji Explorer',
      description: 'Explore N5 and N4 kanji with dictionary-style lookup.',
      path: 'Kanji/Kanji_dictionary.html',
      tags: ['N5', 'N4', 'Explorer'],
      related: [{ label: 'Kanji flashcards', path: 'Kanji/Kanji_flashcard.html' }]
    }),
    resource({
      id: 'kanji-reviewer',
      group: 'kanji',
      groupLabel: 'Kanji',
      type: 'Quiz',
      title: 'N5 Kanji Reviewer',
      description: 'N5 kanji reviewer with readings and practice.',
      path: 'Quiz/Kanji_n5.html',
      tags: ['N5', 'Kanji', 'Quiz'],
      related: [{ label: 'Kanji flashcards', path: 'Kanji/Kanji_flashcard.html' }]
    }),

    resource({ id: 'n5-grammar-reviewer', group: 'quizzes', groupLabel: 'Core Quizzes', type: 'Quiz', title: 'N5 Grammar Reviewer', description: 'Grammar quiz and review page for N5 patterns.', path: 'Quiz/Grammar_n5.html', tags: ['N5', 'Grammar', 'Quiz'], actionLabel: 'Start Quiz' }),
    resource({ id: 'n5-reading-reviewer', group: 'quizzes', groupLabel: 'Core Quizzes', type: 'Quiz', title: 'N5 Reading Comprehension Reviewer', description: 'Reading comprehension reviewer for Minna N5.', path: 'Quiz/Reading-comprehension_n5.html', tags: ['N5', 'Reading', 'Dokkai'], actionLabel: 'Start Quiz' }),
    resource({ id: 'a2-grammar-master', group: 'quizzes', groupLabel: 'Core Quizzes', type: 'Quiz', title: 'Irodori A2 Grammar Master Quiz', description: 'Grammar master quiz for Irodori A2 Book 2 lessons.', path: 'Quiz/N4-Book-2.html', tags: ['N4', 'Irodori A2', 'Grammar'], actionLabel: 'Start Quiz' }),
    resource({ id: 'a2-expressions-1', group: 'quizzes', groupLabel: 'Core Quizzes', type: 'Quiz', title: 'Irodori Expressions Quiz', description: 'Irodori expression practice quiz.', path: 'Quiz/Expressions-1_n4.html', tags: ['N4', 'Expression', 'A2'], actionLabel: 'Start Quiz' }),
    resource({ id: 'a2-expressions-2', group: 'quizzes', groupLabel: 'Core Quizzes', type: 'Quiz', title: 'Irodori Expressions Quiz Part 2', description: 'Second Irodori expression practice quiz.', path: 'Quiz/Expressions-2_n4.html', tags: ['N4', 'Expression', 'A2'], actionLabel: 'Start Quiz' }),
    resource({ id: 'adjective-conjugation', group: 'targeted-quiz', groupLabel: 'Targeted Quiz', type: 'Targeted Quiz', title: 'Adjective Conjugation Practice', description: 'Practice adjective forms and sentence changes.', path: 'Targeted-Quiz/Adjective_Conjugation.html', tags: ['Targeted', 'Adjective', 'N5'], actionLabel: 'Start Quiz' }),
    resource({ id: 'counters-quiz', group: 'targeted-quiz', groupLabel: 'Targeted Quiz', type: 'Targeted Quiz', title: 'Counters Quiz', description: 'Focused counter words and number expressions quiz.', path: 'Targeted-Quiz/Counters_Quiz.html', tags: ['Targeted', 'Counters', 'N5'], actionLabel: 'Start Quiz' }),
    resource({ id: 'verb-conjugation-quiz', group: 'targeted-quiz', groupLabel: 'Targeted Quiz', type: 'Targeted Quiz', title: 'Verb Conjugation Quiz', description: 'Quiz for verb conjugation mastery.', path: 'Targeted-Quiz/Verb_Conjugation_Quiz.html', tags: ['Targeted', 'Conjugation', 'Verb'], actionLabel: 'Start Quiz', related: [{ label: 'Verb lesson', path: 'Specialized-Lessons/Verb_Conjugation_Lesson.html' }] }),
    resource({ id: 'jlpt-n5-n4-mock', group: 'jlpt-mock', groupLabel: 'JLPT Mock', type: 'Mock Exam', title: 'JLPT N5-N4 Grammar Mock Exam', description: 'Sixty-question mock exam for N5 and N4 grammar review.', path: 'JLPT-Mock/N5-N4_Mock.html', tags: ['JLPT', '60 Questions', 'N5 / N4'], actionLabel: 'Take Mock' }),
    resource({ id: 'jft-jimushitsu', group: 'jft-mock', groupLabel: 'JFT Mock', type: 'Mock Exam', title: 'JFT Mock 1: Jimushitsu Set', description: 'JFT mock exam set for office vocabulary and expressions.', path: 'JFT-Mock/Jimushitsu Set.html', tags: ['JFT', '52 Questions', '4 Sets'], actionLabel: 'Take Mock' }),
    resource({ id: 'jft-kawaii', group: 'jft-mock', groupLabel: 'JFT Mock', type: 'Mock Exam', title: 'JFT Mock 2: Kawaii Set', description: 'JFT mock exam set for descriptive expressions.', path: 'JFT-Mock/Kawaii Set.html', tags: ['JFT', '52 Questions', '4 Sets'], actionLabel: 'Take Mock' }),
    resource({ id: 'jft-mix', group: 'jft-mock', groupLabel: 'JFT Mock', type: 'Mock Exam', title: 'JFT Random Challenge', description: 'Mixed JFT review challenge activity.', path: 'JFT-Mock/Mix Set.html', tags: ['JFT', '48 Questions', 'Randomized'], actionLabel: 'Take Mock' }),
    resource({ id: 'jft-sarada', group: 'jft-mock', groupLabel: 'JFT Mock', type: 'Mock Exam', title: 'JFT Mock 3: Sarada Set', description: 'JFT mock exam set for food and daily words.', path: 'JFT-Mock/Sarada Set.html', tags: ['JFT', '52 Questions', '4 Sets'], actionLabel: 'Take Mock' }),
    resource({ id: 'jft-shatsu', group: 'jft-mock', groupLabel: 'JFT Mock', type: 'Mock Exam', title: 'JFT Mock 4: Shatsu Set', description: 'JFT mock exam set for clothing and shopping words.', path: 'JFT-Mock/Shatsu Set.html', tags: ['JFT', '52 Questions', '4 Sets'], actionLabel: 'Take Mock' }),
    resource({ id: 'jft-soba', group: 'jft-mock', groupLabel: 'JFT Mock', type: 'Mock Exam', title: 'JFT Mock 5: Soba Set', description: 'JFT mock exam set for food and restaurant expressions.', path: 'JFT-Mock/Soba Set.html', tags: ['JFT', '52 Questions', '4 Sets'], actionLabel: 'Take Mock' }),
    resource({ id: 'jft-tana', group: 'jft-mock', groupLabel: 'JFT Mock', type: 'Mock Exam', title: 'JFT Mock 6: Tana Set', description: 'JFT mock exam set for object and location expressions.', path: 'JFT-Mock/Tana Set.html', tags: ['JFT', '52 Questions', '4 Sets'], actionLabel: 'Take Mock' }),

    resource({
      id: 'katakana-special-sounds',
      group: 'specialized-lessons',
      groupLabel: 'Specialized Lessons',
      type: 'Lesson',
      title: 'Special Katakana Sounds',
      description: 'Extended katakana sounds and special combinations.',
      path: 'Specialized-Lessons/Katakana-special-sounds.html',
      tags: ['Kana', 'Katakana', 'Specialized'],
      actionLabel: 'Open Lesson'
    })
  ];

  RESOURCES.forEach(item => {
    item.searchable = [
      item.title,
      item.description,
      item.type,
      item.groupLabel,
      item.path,
      ...item.tags
    ].join(' ').toLowerCase();
  });

  window.MJR_GROUPS = GROUPS;
  window.MJR_RESOURCES = RESOURCES;
})();
