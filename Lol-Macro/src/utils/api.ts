const API_URL = 'http://localhost:3001';

export type Scenario = {
  question: string;
  options: string[];
  correct: string;
  explanation: string;
};

export async function fetchScenario(role: string, champion: string, rank: string): Promise<Scenario> {
  const res = await fetch(`${API_URL}/scenario`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role, champion, rank }),
  });

  if (!res.ok) {
    throw new Error('Failed to fetch scenario');
  }

  return await res.json();
}