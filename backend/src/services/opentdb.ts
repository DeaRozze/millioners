import { decodeHtml, shuffleAnswers } from "../utils/htmlUtils";

type OpenTDBQuestion = {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};

type OpenTDBResponse = {
  response_code: number;
  results: OpenTDBQuestion[];
};

export const fetchQuestions = async (amount: string) => {
  const apiUrl = `https://opentdb.com/api.php?amount=${amount}&type=multiple`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: OpenTDBResponse = await response.json();

    if (data.response_code !== 0) {
      throw new Error(`API response error: ${data.response_code}`);
    }

    if (!data.results || data.results.length === 0) {
      throw new Error("No questions received from API");
    }

    return data.results.map((question, index) => ({
      id: index + 1,
      text: decodeHtml(question.question),
      answers: shuffleAnswers([
        { text: decodeHtml(question.correct_answer), isCorrect: true },
        ...question.incorrect_answers.map((text) => ({
          text: decodeHtml(text),
          isCorrect: false,
        })),
      ]),
    }));
  } catch (error) {
    console.error("Error fetching questions from OpenTDB:", error);
    throw error;
  }
};
