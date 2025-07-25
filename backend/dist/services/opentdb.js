import { decodeHtml, shuffleAnswers } from "../utils/htmlUtils";
export const fetchQuestions = async (amount) => {
    const apiUrl = `https://opentdb.com/api.php?amount=${amount}&type=multiple`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response.ok)
        throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    if (data.response_code !== 0) {
        throw new Error(`API response error: ${data.response_code}`);
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
};
