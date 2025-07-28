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
