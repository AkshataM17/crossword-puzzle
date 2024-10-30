import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  const { topic, difficulty } = await req.json();

  const prompt = `Create a 6x6 crossword puzzle about ${topic} at ${difficulty} difficulty level.
  Format as JSON with:
  1. grid: 6x6 array (0 for black cells, numbers for word starts)
  2. words: array of objects with:
     - number: position number
     - answer: word
     - clue: the clue
     - direction: "across" or "down"
     - row: starting row
     - col: starting column
     - length: word length
  Ensure words intersect appropriately.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a crossword puzzle generator." },
        { role: "user", content: prompt }
      ]
    });

    const puzzle = JSON.parse(completion.choices[0].message.content);
    return new Response(JSON.stringify(puzzle), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to generate puzzle' }), { status: 500 });
  }
}
