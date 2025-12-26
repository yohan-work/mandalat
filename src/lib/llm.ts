import { questions } from "@/data/questions";

export interface MandalartData {
    centralKeyword: string;
    keyAreas: {
        title: string;
        subGoals: string[];
    }[];
}

const SYSTEM_PROMPT = `
You are a Mandalart planning expert.
Analyze the user's answers to create a year-plan JSON.

Output format must be strictly JSON:
{
  "centralKeyword": "One sentence summarizing the user's year and aspiration",
  "keyAreas": [
    {
      "title": "Area Title",
      "subGoals": ["Goal 1", "Goal 2", "...", "Goal 8"]
    }
  ]
}

Constraints:
- "keyAreas" must have exactly 8 items.
- "subGoals" must have exactly 8 items.
- Language: Korean (Answers should be in Korean).
- Return ONLY JSON. No markdown.
`;

export async function generateMandalart(answers: string[], model: string = "llama3"): Promise<MandalartData> {
    // Format answers for the prompt
    const answersText = answers.map((ans, idx) => `Q${idx + 1}. ${questions[idx].text}\nA: ${ans}`).join("\n\n");

    const prompt = `${SYSTEM_PROMPT}\n\n[사용자 답변]\n${answersText}\n\nJSON 출력:`;

    try {
        const response = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: model,
                prompt: prompt,
                stream: false,
                format: "json", // Enforce JSON mode if supported by the model/ollama version
            }),
        });

        if (!response.ok) {
            throw new Error(`Ollama API Error: ${response.statusText}`);
        }

        const data = await response.json();
        const resultText = data.response;

        // Parse JSON
        try {
            const parsed = JSON.parse(resultText);
            // Validate structure roughly
            if (!parsed.centralKeyword || !parsed.keyAreas || parsed.keyAreas.length !== 8) {
                throw new Error("Invalid structure returned from LLM");
            }
            return parsed;
        } catch (e) {
            console.error("JSON Parse Error:", e, "Raw Text:", resultText);
            throw new Error("Failed to parse LLM response as JSON.");
        }

    } catch (error) {
        console.error("LLM Generation Failed:", error);
        throw error;
    }
}
