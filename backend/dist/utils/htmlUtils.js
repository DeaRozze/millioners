export const decodeHtml = (text) => {
    return text
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'");
};
export const shuffleAnswers = (answers) => {
    return [...answers]
        .map((answer, index) => ({
        ...answer,
        id: index + 1,
    }))
        .sort(() => Math.random() - 0.5);
};
