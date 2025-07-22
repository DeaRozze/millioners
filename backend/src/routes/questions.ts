import { Hono } from "hono";
import { fetchQuestions } from "../services/opentdb";

const router = new Hono();

router.get("/", async (c) => {
  try {
    const amount = c.req.query("amount") || "10";
    const questions = await fetchQuestions(amount);
    return c.json({ questions });
  } catch (error) {
    console.error("Error fetching questions:", error);

    if (error instanceof Error && error.name === "AbortError") {
      return c.json({ error: "Request to OpenTDB timed out" }, 504);
    }

    return c.json(
      {
        error: "Failed to fetch questions",
        details: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});

export default router;
