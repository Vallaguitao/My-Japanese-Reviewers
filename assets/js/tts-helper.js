/**
 * Japanese Text-to-Speech (TTS) Helper Engine
 * Modern zero-dependency Web Speech API integration with support for <ruby> tags,
 * [data-jp-audio] attributes, and .jp-speech elements.
 */
(function () {
  'use strict';
  
  let jaVoice = null;

  function loadJapaneseVoice() {
    if (!('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    jaVoice = voices.find(v => v.lang === 'ja-JP' || v.lang.startsWith('ja')) || null;
  }

  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = loadJapaneseVoice;
    loadJapaneseVoice();
  }

  /**
   * Speak Japanese text using window.speechSynthesis
   * @param {string} text - Plain text or HTML string (Furigana <rt> tags will be removed automatically)
   */
  window.speakJapanese = function (text) {
    if (!('speechSynthesis' in window) || typeof text !== 'string') return;
    window.speechSynthesis.cancel();
    
    const cleanText = text
      .replace(/<rt>[^<]*<\/rt>/gi, '')
      .replace(/<[^>]*>/g, '')
      .trim();
      
    if (!cleanText) return;
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.9;
    if (jaVoice) utterance.voice = jaVoice;
    window.speechSynthesis.speak(utterance);
  };

  /**
   * Scans document for ruby, .jp-speech, and [data-jp-audio] elements and attaches click listeners.
   */
  function bindTTS() {
    const targets = document.querySelectorAll('ruby, .jp-speech, [data-jp-audio]');
    targets.forEach(el => {
      if (el.dataset.ttsBound === 'true') return;
      el.dataset.ttsBound = 'true';
      el.classList.add('jp-speech-target');
      
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        let textToSpeak = el.dataset.jpAudio;
        if (!textToSpeak) {
          const clone = el.cloneNode(true);
          clone.querySelectorAll('rt').forEach(rt => rt.remove());
          textToSpeak = clone.textContent || clone.innerText;
        }
        window.speakJapanese(textToSpeak);
      });
    });
  }

  window.bindJapaneseTTS = bindTTS;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindTTS);
  } else {
    bindTTS();
  }
})();
