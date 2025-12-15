import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Sample texts for typing tests
const sampleTexts = [
  "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once. Pangrams are often used to display font samples and test keyboards.",
  "Programming is the art of telling another human being what one wants the computer to do. It requires logical thinking and creative problem-solving skills that can be developed through practice.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. Every expert was once a beginner who refused to give up on their dreams and aspirations.",
  "The internet is not just one thing, it's a collection of things – of numerous communications networks that all speak the same digital language. It connects billions of people worldwide.",
  "Innovation distinguishes between a leader and a follower. The ability to think differently and challenge conventional wisdom is what drives progress in technology and society."
];

// Add these lists at the top, after sampleTexts
const wordList = [
  "apple", "banana", "cat", "dog", "elephant", "fish", "grape", "house", "island", "jungle", "kite", "lemon", "mountain", "notebook", "orange", "piano", "queen", "river", "sun", "tree", "umbrella", "violin", "window", "xylophone", "yacht", "zebra",
  "computer", "phone", "book", "car", "bike", "train", "plane", "ship", "rocket", "star", "moon", "earth", "ocean", "forest", "desert", "city", "town", "village", "country", "world", "universe", "galaxy", "planet", "comet", "asteroid",
  "friend", "family", "teacher", "student", "doctor", "engineer", "artist", "musician", "writer", "scientist", "chef", "driver", "pilot", "sailor", "soldier", "police", "firefighter", "nurse", "lawyer", "judge", "president", "king", "queen", "prince", "princess",
  "happy", "sad", "angry", "excited", "tired", "energetic", "calm", "nervous", "brave", "scared", "confident", "shy", "friendly", "mean", "kind", "rude", "polite", "funny", "serious", "smart", "clever", "wise", "foolish", "strong", "weak",
  "big", "small", "tall", "short", "wide", "narrow", "thick", "thin", "heavy", "light", "fast", "slow", "hot", "cold", "warm", "cool", "bright", "dark", "loud", "quiet", "smooth", "rough", "soft", "hard", "sharp", "dull",
  "red", "blue", "green", "yellow", "purple", "orange", "pink", "brown", "black", "white", "gray", "gold", "silver", "bronze", "copper", "rainbow", "colorful", "plain", "fancy", "simple", "complex", "modern", "ancient", "new", "old", "fresh",
  "morning", "afternoon", "evening", "night", "dawn", "dusk", "noon", "midnight", "sunrise", "sunset", "day", "week", "month", "year", "season", "spring", "summer", "autumn", "winter", "holiday", "birthday", "anniversary", "celebration", "party", "festival",
  "breakfast", "lunch", "dinner", "snack", "dessert", "coffee", "tea", "water", "juice", "milk", "bread", "cheese", "meat", "vegetable", "fruit", "soup", "salad", "pizza", "burger", "sandwich", "cake", "cookie", "ice", "cream", "chocolate",
  "music", "song", "dance", "art", "painting", "sculpture", "photograph", "movie", "film", "video", "game", "sport", "exercise", "workout", "yoga", "meditation", "reading", "writing", "drawing", "singing", "playing", "learning", "studying", "teaching", "helping",
  "love", "hate", "like", "dislike", "want", "need", "have", "give", "take", "make", "do", "see", "hear", "smell", "taste", "touch", "feel", "think", "know", "understand", "believe", "hope", "dream", "wish", "pray", "thank"
];

const sentenceList = [
  "She walked her dog in the park every morning.",
  "The quick brown fox jumps over the lazy dog.",
  "Music can change the world because it can change people.",
  "A journey of a thousand miles begins with a single step.",
  "Reading books expands your knowledge and imagination.",
  "The sun sets beautifully behind the mountains.",
  "Practice makes perfect in every skill you learn.",
  "He cooked a delicious meal for his family.",
  "The stars twinkled brightly in the night sky.",
  "She wrote a letter to her best friend."
];

function App() {
  const [currentText, setCurrentText] = useState('');
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [typedWords, setTypedWords] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [testDuration, setTestDuration] = useState(60);
  const [history, setHistory] = useState([]);
  const [theme, setTheme] = useState('dark');
  const inputRef = useRef(null);

  // Theme: load from localStorage or system
  useEffect(() => {
    const stored = localStorage.getItem('typingTheme');
    if (stored) {
      setTheme(stored);
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    document.body.classList.remove('theme-dark', 'theme-light');
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem('typingTheme', theme);
  }, [theme]);

  // Load history from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('typingHistory');
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  // Initialize with a random text
  useEffect(() => {
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    setCurrentText(randomText);
    setWords(randomText.split(' '));
  }, []);

  // Timer countdown
  useEffect(() => {
    let interval = null;
    if (isTyping && timeLeft > 0 && !isFinished) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => {
          if (timeLeft <= 1) {
            finishTest();
            return 0;
          }
          return timeLeft - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTyping, timeLeft, isFinished]);

  const startTest = () => {
    setStartTime(Date.now());
    setIsTyping(true);
    setCurrentWordIndex(0);
    setTypedWords([]);
    setErrors(0);
    setTimeLeft(testDuration);
    setIsFinished(false);
    setWpm(0);
    setAccuracy(100);
    inputRef.current.focus();
  };

  const finishTest = () => {
    const end = Date.now();
    setEndTime(end);
    setIsTyping(false);
    setIsFinished(true);
    
    if (startTime) {
      const timeElapsed = (end - startTime) / 1000 / 60; // in minutes
      const wordsTyped = typedWords.length;
      const calculatedWpm = Math.round(wordsTyped / timeElapsed);
      setWpm(calculatedWpm);
      
      // Calculate accuracy
      const totalWords = words.length;
      const correctWords = typedWords.filter((word, index) => 
        word === words[index]
      ).length;
      const calculatedAccuracy = Math.round((correctWords / totalWords) * 100);
      setAccuracy(calculatedAccuracy);

      // Save to history
      const newEntry = {
        wpm: calculatedWpm,
        accuracy: calculatedAccuracy,
        errors,
        wordsTyped,
        date: new Date().toISOString(),
      };
      const updatedHistory = [newEntry, ...history].slice(0, 20); // keep last 20
      setHistory(updatedHistory);
      localStorage.setItem('typingHistory', JSON.stringify(updatedHistory));
    }
  };

  const resetTest = () => {
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    setCurrentText(randomText);
    setWords(randomText.split(' '));
    setCurrentWordIndex(0);
    setTypedWords([]);
    setStartTime(null);
    setEndTime(null);
    setIsTyping(false);
    setIsFinished(false);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setTimeLeft(testDuration);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    
    if (!isTyping && !isFinished) {
      startTest();
    }
    
    if (isFinished) return;
    
    const currentWord = words[currentWordIndex];
    
    if (value.endsWith(' ')) {
      // Word completed
      const typedWord = value.trim();
      const newTypedWords = [...typedWords, typedWord];
      setTypedWords(newTypedWords);
      
      if (typedWord !== currentWord) {
        setErrors(errors + 1);
      }
      
      if (currentWordIndex === words.length - 1) {
        // Test completed
        finishTest();
      } else {
        setCurrentWordIndex(currentWordIndex + 1);
        e.target.value = '';
      }
    }
  };

  const getWordClass = (index) => {
    if (index < currentWordIndex) {
      return typedWords[index] === words[index] ? 'word correct' : 'word incorrect';
    } else if (index === currentWordIndex) {
      return 'word current';
    } else {
      return 'word';
    }
  };

  const getTimerClass = () => {
    if (timeLeft <= 10) return 'timer danger';
    if (timeLeft <= 30) return 'timer warning';
    return 'timer';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString();
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const setRandomWords = () => {
    const numWords = 40;
    let wordsArr = [];
    for (let i = 0; i < numWords; i++) {
      wordsArr.push(wordList[Math.floor(Math.random() * wordList.length)]);
    }
    const text = wordsArr.join(' ');
    setCurrentText(text);
    setWords(wordsArr);
    setCurrentWordIndex(0);
    setTypedWords([]);
    setStartTime(null);
    setEndTime(null);
    setIsTyping(false);
    setIsFinished(false);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setTimeLeft(testDuration);
  };

  const setRandomSentences = () => {
    const numSentences = 4;
    let sentencesArr = [];
    for (let i = 0; i < numSentences; i++) {
      sentencesArr.push(sentenceList[Math.floor(Math.random() * sentenceList.length)]);
    }
    const text = sentencesArr.join(' ');
    setCurrentText(text);
    setWords(text.split(' '));
    setCurrentWordIndex(0);
    setTypedWords([]);
    setStartTime(null);
    setEndTime(null);
    setIsTyping(false);
    setIsFinished(false);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setTimeLeft(testDuration);
  };

  const addWords = () => {
    // Check if we're in words mode (no periods, just individual words)
    const isWordsMode = !currentText.includes('.');
    
    if (isWordsMode) {
      // Add 1 unique word
      const currentWords = currentText.split(' ').filter(word => word.trim().length > 0);
      const availableWords = wordList.filter(word => !currentWords.includes(word));
      
      if (availableWords.length > 0) {
        const newWord = availableWords[Math.floor(Math.random() * availableWords.length)];
        const newText = currentText + ' ' + newWord;
        setCurrentText(newText);
        setWords(newText.split(' '));
        setCurrentWordIndex(0);
        setTypedWords([]);
        setStartTime(null);
        setEndTime(null);
        setIsTyping(false);
        setIsFinished(false);
        setWpm(0);
        setAccuracy(100);
        setErrors(0);
        setTimeLeft(testDuration);
      }
    } else {
      // Add 1 unique sentence
      const currentSentences = currentText.split('. ').filter(s => s.trim().length > 0);
      const availableSentences = sentenceList.filter(sentence => !currentSentences.includes(sentence));
      
      if (availableSentences.length > 0) {
        const newSentence = availableSentences[Math.floor(Math.random() * availableSentences.length)];
        const newText = currentText + ' ' + newSentence;
        setCurrentText(newText);
        setWords(newText.split(' '));
        setCurrentWordIndex(0);
        setTypedWords([]);
        setStartTime(null);
        setEndTime(null);
        setIsTyping(false);
        setIsFinished(false);
        setWpm(0);
        setAccuracy(100);
        setErrors(0);
        setTimeLeft(testDuration);
      }
    }
  };

  const removeWords = () => {
    // Check if we're in words mode (no periods, just individual words)
    const isWordsMode = !currentText.includes('.');
    
    if (isWordsMode) {
      // Remove 1 word in words mode
      const currentWords = currentText.split(' ').filter(word => word.trim().length > 0);
      if (currentWords.length > 1) {
        const newWords = currentWords.slice(0, -1);
        const newText = newWords.join(' ');
        setCurrentText(newText);
        setWords(newText.split(' '));
        setCurrentWordIndex(0);
        setTypedWords([]);
        setStartTime(null);
        setEndTime(null);
        setIsTyping(false);
        setIsFinished(false);
        setWpm(0);
        setAccuracy(100);
        setErrors(0);
        setTimeLeft(testDuration);
      }
    } else {
      // Remove 5 words in sentences mode
      const currentWords = currentText.split(' ');
      if (currentWords.length > 5) {
        const newWords = currentWords.slice(0, -5);
        const newText = newWords.join(' ');
        setCurrentText(newText);
        setWords(newWords);
        setCurrentWordIndex(0);
        setTypedWords([]);
        setStartTime(null);
        setEndTime(null);
        setIsTyping(false);
        setIsFinished(false);
        setWpm(0);
        setAccuracy(100);
        setErrors(0);
        setTimeLeft(testDuration);
      }
    }
  };

  const addSentences = () => {
    const additionalSentences = 2;
    let newSentences = [];
    for (let i = 0; i < additionalSentences; i++) {
      newSentences.push(sentenceList[Math.floor(Math.random() * sentenceList.length)]);
    }
    const newText = currentText + ' ' + newSentences.join(' ');
    setCurrentText(newText);
    setWords(newText.split(' '));
    setCurrentWordIndex(0);
    setTypedWords([]);
    setStartTime(null);
    setEndTime(null);
    setIsTyping(false);
    setIsFinished(false);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setTimeLeft(testDuration);
  };

  const removeSentences = () => {
    const sentences = currentText.split('. ').filter(s => s.trim().length > 0);
    if (sentences.length > 1) {
      const newSentences = sentences.slice(0, -1);
      const newText = newSentences.join('. ') + (newSentences.length > 0 ? '.' : '');
      setCurrentText(newText);
      setWords(newText.split(' '));
      setCurrentWordIndex(0);
      setTypedWords([]);
      setStartTime(null);
      setEndTime(null);
      setIsTyping(false);
      setIsFinished(false);
      setWpm(0);
      setAccuracy(100);
      setErrors(0);
      setTimeLeft(testDuration);
    }
  };

  return (
    <div className="app-layout">
      <aside className="history-sidebar">
        <button className="btn btn-secondary" style={{marginBottom: 18, width: '100%'}} onClick={toggleTheme}>
          Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
        </button>
        <h2>History</h2>
        {history.length === 0 ? (
          <div className="history-empty">No games yet.</div>
        ) : (
          <ul className="history-list">
            {history.map((entry, idx) => (
              <li key={idx} className="history-item">
                <div><b>{formatDate(entry.date)}</b></div>
                <div>WPM: <b>{entry.wpm}</b></div>
                <div>Accuracy: <b>{entry.accuracy}%</b></div>
                <div>Errors: <b>{entry.errors}</b></div>
                <div>Words: <b>{entry.wordsTyped}</b></div>
              </li>
            ))}
          </ul>
        )}
      </aside>
      <div className="container">
        <div className="header" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
          <h1 className="title">Monkey Typer</h1>
          
        </div>

        <div className="typing-container">
          {!isFinished && (
            <>
              <div className="timer-container">
                <div className={getTimerClass()}>
                  {formatTime(timeLeft)}
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${((testDuration - timeLeft) / testDuration) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="typing-text">
                {words.map((word, index) => (
                  <span key={index} className={getWordClass(index)}>
                    {word}
                  </span>
                ))}
              </div>

              <input
                ref={inputRef}
                type="text"
                className="typing-input"
                onChange={handleInputChange}
                placeholder="Start typing here..."
                disabled={isFinished}
                autoFocus
              />
            </>
          )}

          {isFinished && (
            <div className="results">
              <h3>Test Complete!</h3>
              <div className="stats-container">
                <div className="stat-card">
                  <div className="stat-value">{wpm}</div>
                  <div className="stat-label">Words Per Minute</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{accuracy}%</div>
                  <div className="stat-label">Accuracy</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{errors}</div>
                  <div className="stat-label">Errors</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{typedWords.length}</div>
                  <div className="stat-label">Words Typed</div>
                </div>
              </div>
            </div>
          )}

          <div className="controls">
            {!isTyping && !isFinished && (
              <>
                <button className="btn btn-primary" onClick={startTest}>
                  Start Test
                </button>
                <button className="btn btn-secondary" onClick={setRandomWords}>
                  Random Words
                </button>
                <button className="btn btn-secondary" onClick={setRandomSentences}>
                  Random Sentences
                </button>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: '8px 12px', fontSize: '0.9rem' }}
                    onClick={addWords}
                    title="Add words"
                  >
                    +
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: '8px 12px', fontSize: '0.9rem' }}
                    onClick={removeWords}
                    title="Remove words"
                  >
                    -
                  </button>
                </div>
              </>
            )}
            {isTyping && !isFinished && (
              <button className="btn btn-secondary" onClick={finishTest}>
                End Test
              </button>
            )}
            {(isFinished || isTyping) && (
              <button className="btn btn-primary" onClick={resetTest}>
                New Test
              </button>
            )}
          </div>

          {!isFinished && (
            <div className="stats-container">
              <div className="stat-card">
                <div className="stat-value">{typedWords.length}</div>
                <div className="stat-label">Words Typed</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{errors}</div>
                <div className="stat-label">Errors</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{words.length}</div>
                <div className="stat-label">Total Words</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App; 