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
The user will provide answers to reflection questions.
Your goal is to build a complete 9x9 Mandalart chart (Center + 8 Areas * 8 SubGoals).

[Process]
1. **Analyze**: Read user answers to understand their core values and desires.
2. **Summarize**: Create one specific "Central Keyword" (Sentence) that defines their next year.
3. **Structure**: Derive 8 "Key Areas" (titles) to achieve that Central Keyword.
4. **Detail**: For EACH Key Area, generate exactly **8 Actionable Sub-goals**.

[CRITICAL RULES]
- **NEVER leave a sub-goal empty**. You MUST generate 8 items for every area.
- If the user's answer is short, **creatively expand** based on the context to fill all 8 slots.
- Sub-goals must be concrete actions (e.g., "Write 1 blog post", "Drink 2L water").
- Language: **Korean** (Hangul).
- Output: VALID JSON only.

[JSON Structure]
{
  "centralKeyword": "...",
  "keyAreas": [
    {
      "title": "Area 1",
      "subGoals": ["Action 1", "Action 2", ..., "Action 8"]
    },
    ... (Total 8 Areas)
  ]
}
`;


function extractJson(text: string): string {
    // 1. Try to find JSON block bounded by ```json ... ```
    const markdownMatch = text.match(/```json\n([\s\S]*?)\n```/);
    if (markdownMatch && markdownMatch[1]) {
        return markdownMatch[1];
    }

    // 2. Try to find the *first* raw object {...}
    // We use a non-greedy match for the content to find the smallest valid object if possible, 
    // but JSON nesting makes regex hard. 
    // Reliable trick: Find the first '{' and the last '}'.
    const firstOpen = text.indexOf('{');
    const lastClose = text.lastIndexOf('}');

    if (firstOpen !== -1 && lastClose !== -1 && lastClose > firstOpen) {
        return text.substring(firstOpen, lastClose + 1);
    }

    return text;
}

export async function generateMandalart(answers: string[], model: string = "gpt-oss:20b"): Promise<MandalartData> {
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
                format: "json", // Enforce JSON mode again, it's safer if we don't try to complete
                options: {
                    temperature: 0.7,
                    num_ctx: 4096,
                },
            }),
        });

        if (!response.ok) {
            throw new Error(`Ollama API Error: ${response.statusText}`);
        }

        const data = await response.json();
        const resultText = data.response;
        console.log("Raw LLM Output:", resultText);

        // Parse JSON
        try {
            let cleanJson = extractJson(resultText);

            // Sanitize: sometimes models put newlines inside strings which breaks JSON.parse
            // A simple fix is hard without a parser, but let's try basic cleanup if needed.
            // For now, rely on 'formatting: json' doing its job mostly.

            const parsed = JSON.parse(cleanJson);

            // Validate structure roughly
            if (!parsed.keyAreas || parsed.keyAreas.length !== 8) {
                console.warn("Struct validation failed. Items:", parsed.keyAreas?.length);
                // We could throw, or maybe we just pad the array?
                // Let's pad it to avoiding crashing the UI
                if (!parsed.keyAreas) parsed.keyAreas = [];
                while (parsed.keyAreas.length < 8) {
                    parsed.keyAreas.push({ title: "빈 영역", subGoals: Array(8).fill("") });
                }
            }
            // Validate subgoals
            parsed.keyAreas.forEach((area: any) => {
                if (!area.subGoals) area.subGoals = [];
                while (area.subGoals.length < 8) {
                    area.subGoals.push("");
                }
            });

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
