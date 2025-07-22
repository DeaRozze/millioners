export const decodeHtml = (text: string): string => {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
};

export const shuffleAnswers = (answers: any[]): any[] => {
  return [...answers]
    .map((answer, index) => ({
      ...answer,
      id: index + 1,
    }))
    .sort(() => Math.random() - 0.5);
};


