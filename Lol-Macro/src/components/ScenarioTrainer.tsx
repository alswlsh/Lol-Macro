import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { fetchScenario } from '../utils/api';

type Scenario = {
  question: string;
  options: string[];
  correct: string;
  explanation: string;
  feedbackByOption?: Record<string, string>;
};

const roles = ['Top', 'Jungle', 'Mid', 'ADC', 'Support'];
const ranks = ['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Emerald', 'Diamond', 'Master', 'Grandmaster', 'Challenger'];

const ScenarioTrainer: React.FC = () => {
  const [role, setRole] = useState<string>('Jungle');
  const [champion, setChampion] = useState<string>('Lee Sin');
  const [rank, setRank] = useState<string>('Gold');
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [summonerName, setSummonerName] = useState('');

  const handleOptionClick = (option: string) => {
  if (selected || !scenario) return;

  setSelected(option);

  const correct = scenario.correct;
  const isCorrect = option === correct;

  let score = isCorrect ? 5 : 2;
  if (!isCorrect && option.charCodeAt(0) - correct.charCodeAt(0) === 1) {
    score = 3;
  }

  const dynamicFeedback = scenario.feedbackByOption?.[option] || (isCorrect ? "Great job!" : "Keep improving your macro!");

  setRating(score);
  setFeedback(dynamicFeedback);
};
  const handleCustomQuiz = async () => {
    setLoading(true);
    setSelected(null);
    setFeedback(null);
    setRating(null);

    const res = await fetch('http://localhost:3001/custom-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summonerName }),
    });

    const data = await res.json();
    setScenario(data);
    setLoading(false);
    };
    
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
        setSelected(null);
        setFeedback(null);
        setRating(null);
    setLoading(true);
    const data = await fetchScenario(role, champion, rank);
    setScenario(data);
    setLoading(false);
    
  };
  
  

  return (
  <div className="max-w-2xl mx-auto mt-12 p-6 rounded-xl bg-lolGray shadow-lg border border-lolAccent">
  <h1 className="text-3xl font-bold mb-6 text-center text-lolAccent tracking-wide">Macro Trainer</h1>

    {/* <label>
        Summoner Name:
        <input
            value={summonerName}
            onChange={(e) => setSummonerName(e.target.value)}
            className="w-full p-2 mt-1 bg-black text-lolText border border-lolAccent rounded"
            placeholder="e.g. Faker"
        />
        </label>
    <button type="button" onClick={handleCustomQuiz} className="w-full mt-2 bg-purple-600 text-white font-bold py-2 px-4 rounded hover:bg-purple-700">
        Get Custom Quiz
    </button> */}
  <form onSubmit={handleSubmit} className="space-y-4">
    <div>
      <label className="block text-sm mb-1">Role:</label>
      <select value={role} onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 rounded bg-black text-lolText border border-lolAccent">
        {roles.map((r) => <option key={r}>{r}</option>)}
      </select>
    </div>

    <div>
      <label className="block text-sm mb-1">Champion:</label>
      <input
        value={champion}
        onChange={(e) => setChampion(e.target.value)}
        className="w-full p-2 rounded bg-black text-lolText border border-lolAccent"
        placeholder="Lee Sin"
      />
    </div>

    <div>
      <label className="block text-sm mb-1">Rank:</label>
      <select value={rank} onChange={(e) => setRank(e.target.value)}
              className="w-full p-2 rounded bg-black text-lolText border border-lolAccent">
        {ranks.map((r) => <option key={r}>{r}</option>)}
      </select>
    </div>

    <button type="submit"
            className="w-full bg-lolAccent text-black font-bold py-2 px-4 rounded hover:opacity-90 transition">
      {loading ? 'Loading...' : 'Get Scenario'}
    </button>
  </form>

  {loading && (
    <div className="mt-4 text-center text-sm italic text-gray-400">Generating your scenario...</div>
  )}

  {scenario && (
    <div className="mt-8 bg-black border border-lolAccent p-4 rounded shadow">
      <h2 className="text-xl font-semibold text-lolAccent mb-3">Scenario</h2>
      <p className="mb-4">{scenario.question}</p>

      <div className="grid grid-cols-1 gap-3 mb-4">
        {scenario.options.map((opt) => {
            const letter = opt[0]; // 'A', 'B', etc.
            const isSelected = selected === letter;
            const isCorrect = scenario.correct === letter;

            return (
            <button
                key={letter}
                onClick={() => handleOptionClick(letter)}
                className={`
                w-full text-left py-2 px-4 rounded border transition
                ${isSelected ? (isCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white') : 'bg-lolGray text-lolText hover:bg-lolAccent hover:text-black'}
                border-lolAccent
                `}
                disabled={!!selected}
            >
                {opt}
            </button>
            );
        })}
        </div>
        {selected && (
            <div className="mt-4 p-4 bg-black rounded border border-lolAccent text-sm text-lolText space-y-2">
                <p><strong>Your Answer:</strong> {selected}</p>
                <p><strong>Correct Answer:</strong> {scenario.correct}</p>
                <p><strong>Explanation:</strong> {scenario.explanation}</p>
                <p><strong>Rating:</strong> {rating}/5 – {feedback}</p>
            </div>
        )}
    </div>
  )}
</div>
  );
};

export default ScenarioTrainer;
