import { Hono } from "hono";
import { fetchQuestions } from "../services/opentdb";

const router = new Hono();

router.get("/", async (c) => {
  try {
    const amount = c.req.query("amount") || "10";
    const questions = await fetchQuestions(amount);

    if (!questions || questions.length === 0) {
      return c.json({ error: "Нет доступных вопросов" }, 503);
    }

    return c.json({ questions });
  } catch (error) {
    console.error("Ошибка при загрузке вопросов:", error);

    if (error instanceof Error && error.name === "AbortError") {
      return c.json({ error: "Запрос к OpenTDB истек" }, 504);
    }

    return c.json(
      {
        error: "Не удалось получить вопросы",
        details: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});

export default router;
