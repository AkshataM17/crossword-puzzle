"use client"

import React, { useState, useRef, useEffect } from 'react';

const CrosswordGame = () => {
  const [step, setStep] = useState('topic');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [activeCell, setActiveCell] = useState(null);
  const [activeWord, setActiveWord] = useState(null);
  const [activeDirection, setActiveDirection] = useState('across');
  const [answers, setAnswers] = useState({});
  const [showAnswers, setShowAnswers] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Initial puzzle data until API responds
  const [puzzle] = useState({
    grid: [
      [1, 2, 3, 0, 4, 0],
      [0, 0, 0, 0, 0, 0],
      [5, 0, 0, 6, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [7, 0, 0, 0, 0, 8],
      [0, 0, 0, 0, 0, 0]
    ],
    words: [
      {
        number: 1,
        answer: 'CODE',
        clue: 'What programmers write',
        direction: 'across',
        row: 0,
        col: 0,
        length: 4
      },
      {
        number: 1,
        answer: 'CACHE',
        clue: 'Temporary memory storage',
        direction: 'down',
        row: 0,
        col: 0,
        length: 5
      },
      {
        number: 4,
        answer: 'DATA',
        clue: 'Information in digital form',
        direction: 'down',
        row: 0,
        col: 4,
        length: 4
      },
      {
        number: 5,
        answer: 'SQL',
        clue: 'Database query language',
        direction: 'across',
        row: 2,
        col: 0,
        length: 3
      }
    ]
  });

  const gridRefs = Array(6).fill().map(() => Array(6).fill().map(() => useRef()));

  const topics = [
    "Science", "Sports", "Movies", "History", 
    "Geography", "Literature", "Music", "Technology"
  ];

  const difficulties = ["Easy", "Medium", "Hard"];

  const handleKeyDown = (e, row, col) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newAnswers = { ...answers };
      delete newAnswers[`${row}-${col}`];
      setAnswers(newAnswers);
    } else if (/^[A-Za-z]$/.test(e.key)) {
      e.preventDefault();
      const newAnswers = { ...answers };
      newAnswers[`${row}-${col}`] = e.key.toUpperCase();
      setAnswers(newAnswers);
      
      // Move to next cell
      if (activeDirection === 'across' && col < 5) {
        setActiveCell([row, col + 1]);
      } else if (activeDirection === 'down' && row < 5) {
        setActiveCell([row + 1, col]);
      }
    }
  };

  const CrosswordGrid = () => (
    <div className="flex justify-center">
      <div className="inline-block bg-white p-4 rounded-lg shadow-lg">
        <div className="grid grid-cols-6 gap-[1px] bg-black">
          {puzzle.grid.map((row, i) => (
            row.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                className={`relative ${cell === 0 ? 'bg-black' : 'bg-white'}`}
                style={{ width: '2.5rem', height: '2.5rem' }}
                onClick={() => {
                  if (cell !== 0) {
                    if (activeCell && activeCell[0] === i && activeCell[1] === j) {
                      setActiveDirection(prev => prev === 'across' ? 'down' : 'across');
                    } else {
                      setActiveCell([i, j]);
                    }
                  }
                }}
              >
                {cell !== 0 && (
                  <>
                    {typeof cell === 'number' && (
                      <span className="absolute top-0.5 left-1 text-xs font-medium">
                        {cell}
                      </span>
                    )}
                    <input
                      ref={gridRefs[i][j]}
                      className={`w-full h-full text-center text-lg font-bold uppercase outline-none
                        ${activeCell && activeCell[0] === i && activeCell[1] === j 
                          ? 'bg-blue-100' 
                          : activeWord && activeWord.includes(`${i}-${j}`)
                          ? 'bg-blue-50'
                          : 'bg-white'}`}
                      maxLength="1"
                      value={answers[`${i}-${j}`] || ''}
                      onKeyDown={(e) => handleKeyDown(e, i, j)}
                    />
                  </>
                )}
              </div>
            ))
          ))}
        </div>
      </div>
    </div>
  );

  const CluesList = () => (
    <div className="mt-8 max-w-2xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <h3 className="font-bold text-xl border-b border-gray-200 pb-2">Across</h3>
          {puzzle.words
            .filter(word => word.direction === 'across')
            .map(word => (
              <button
                key={`${word.number}-across`}
                className={`w-full text-left px-2 py-1 rounded hover:bg-gray-100 
                  ${activeWord === `${word.number}-across` ? 'bg-blue-50' : ''}`}
                onClick={() => {
                  setActiveWord(`${word.number}-across`);
                  setActiveCell([word.row, word.col]);
                  setActiveDirection('across');
                }}
              >
                <span className="font-medium">{word.number}. </span>
                {word.clue}
                {showAnswers && <span className="ml-2 text-gray-500">({word.answer})</span>}
              </button>
            ))}
        </div>
        <div className="space-y-3">
          <h3 className="font-bold text-xl border-b border-gray-200 pb-2">Down</h3>
          {puzzle.words
            .filter(word => word.direction === 'down')
            .map(word => (
              <button
                key={`${word.number}-down`}
                className={`w-full text-left px-2 py-1 rounded hover:bg-gray-100
                  ${activeWord === `${word.number}-down` ? 'bg-blue-50' : ''}`}
                onClick={() => {
                  setActiveWord(`${word.number}-down`);
                  setActiveCell([word.row, word.col]);
                  setActiveDirection('down');
                }}
              >
                <span className="font-medium">{word.number}. </span>
                {word.clue}
                {showAnswers && <span className="ml-2 text-gray-500">({word.answer})</span>}
              </button>
            ))}
        </div>
      </div>
      <div className="flex gap-4 justify-center mt-6">
        <button 
          className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
          onClick={() => setShowAnswers(!showAnswers)}
        >
          {showAnswers ? "Hide Answers" : "Show Answers"}
        </button>
        <button 
          className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
          onClick={() => setAnswers({})}
        >
          Clear Grid
        </button>
        <button 
          className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
          onClick={() => {
            setLoading(true);
            // Generate new puzzle API call would go here
            setLoading(false);
          }}
        >
          New Puzzle
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      {step === 'topic' ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center mb-6">Select a Topic</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {topics.map((topic) => (
              <button
                key={topic}
                className={`h-16 text-lg rounded transition-colors
                  ${selectedTopic === topic 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'}`}
                onClick={() => setSelectedTopic(topic)}
              >
                {topic}
              </button>
            ))}
          </div>
          {selectedTopic && (
            <button 
              className="w-full mt-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              onClick={() => setStep('difficulty')}
            >
              Continue
            </button>
          )}
        </div>
      ) : step === 'difficulty' ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center mb-6">Select Difficulty</h2>
          <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
            {difficulties.map((diff) => (
              <button
                key={diff}
                className={`h-16 text-lg rounded transition-colors
                  ${selectedDifficulty === diff 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'}`}
                onClick={() => {
                  setSelectedDifficulty(diff);
                  setStep('game');
                }}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-center">
            {selectedTopic} Crossword - {selectedDifficulty}
          </h1>
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2">Generating puzzle...</span>
            </div>
          ) : (
            <>
              <CrosswordGrid />
              <CluesList />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CrosswordGame;