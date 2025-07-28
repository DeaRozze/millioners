export const decodeHtml = (text: string): string => {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
};

interface Answer {
  text: string;
  isCorrect: boolean;
  id?: number;
}

export const shuffleAnswers = (answers: Answer[]): Answer[] => {
  return [...answers]
    .map((answer, index) => ({
      ...answer,
      id: index + 1,
    }))
    .sort(() => Math.random() - 0.5);
};
