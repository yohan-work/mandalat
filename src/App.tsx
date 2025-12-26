import { useState } from "react";
import { QuestionFlow } from "@/components/QuestionFlow";
import { MandalartGrid } from "@/components/MandalartGrid";
import { generateMandalart, type MandalartData } from "@/lib/llm";
import { Loader2 } from "lucide-react";

// Helper to convert LLM JSON to 9x9 Grid format
function convertToGrid(data: MandalartData): string[][] {
    const grid: string[][] = Array(9).fill(null).map(() => Array(9).fill(""));
    const centerBlockIdx = 4;

    // 1. Fill Center Block (Block 4) -> Key Areas
    grid[centerBlockIdx][4] = data.centralKeyword;

    // Mapping for 8 surrounding cells in a block: 
    // 0 1 2
    // 3 4 5
    // 6 7 8
    // Excluding 4.
    const surroundingIndices = [0, 1, 2, 3, 5, 6, 7, 8];

    data.keyAreas.forEach((area, idx) => {
        if (idx >= 8) return;
        const targetCellIdx = surroundingIndices[idx]; // Position in Center Block
        const targetBlockIdx = surroundingIndices[idx]; // The Outer Block Index

        // Set Title in Center Block
        grid[centerBlockIdx][targetCellIdx] = area.title;

        // Set Title in Outer Block (Center Cell)
        grid[targetBlockIdx][4] = area.title;

        // Set SubGoals in Outer Block
        area.subGoals.forEach((goal, gIdx) => {
            if (gIdx >= 8) return;
            const goalCellIdx = surroundingIndices[gIdx];
            grid[targetBlockIdx][goalCellIdx] = goal;
        });
    });

    return grid;
}

function App() {
    const [step, setStep] = useState<"intro" | "questions" | "loading" | "result">("intro");
    const [gridData, setGridData] = useState<string[][]>([]);

    const handleStart = () => {
        setStep("questions");
    };

    const handleQuestionsComplete = async (answers: string[]) => {
        setStep("loading");
        try {
            // Call LLM
            const result = await generateMandalart(answers);
            console.log("LLM Result:", result);

            // Convert to Grid
            const newGrid = convertToGrid(result);
            setGridData(newGrid);

            setStep("result");
        } catch (error) {
            console.error("Failed to generate mandalart:", error);
            alert("AI 회고 요약에 실패했습니다. 올라마(Ollama)가 켜져 있는지 확인해주세요! (기본 그리드로 이동합니다)");
            // Fallback: Proceed to grid with answers (MandalartGrid's default behavior could be triggered, but we need to pass something)
            // Since we modified usages, let's just pass an empty grid or the answers-based logic if we implemented it.
            // For now, let's just show an empty grid or allow manual entry.
            setStep("result");
        }
    };

    const handleReset = () => {
        setStep("intro");
        setGridData([]);
    };

    return (
        <main className="min-h-screen bg-[#0f172a] text-slate-50 flex flex-col items-center justify-center p-4">

            {step === "intro" && (
                <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500 max-w-2xl">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent">
                        Mandalart 2025
                    </h1>
                    <p className="text-xl text-slate-400 leading-relaxed">
                        나를 찾는 8가지 질문으로<br />
                        당신의 2025년을 설계해보세요.
                    </p>
                    <button
                        onClick={handleStart}
                        className="px-8 py-4 text-lg font-semibold bg-white text-slate-900 rounded-full hover:bg-slate-200 transition-all transform hover:scale-105"
                    >
                        시작하기
                    </button>
                </div>
            )}

            {step === "questions" && (
                <QuestionFlow onComplete={handleQuestionsComplete} />
            )}

            {step === "loading" && (
                <div className="flex flex-col items-center gap-4 animate-in fade-in">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-400" />
                    <p className="text-lg text-slate-300">내 답변을 분석하고, 만다라트를 그리는 중...</p>
                    <p className="text-sm text-slate-500">잠시만 기다려주세요 (최대 1분 소요)</p>
                </div>
            )}

            {step === "result" && (
                <div className="w-full flex justify-center">
                    {/* We need to update MandalartGrid to accept 'initialGrid' or similar. 
                Currently it accepts 'initialAnswers'. 
                I will modify MandalartGrid next to accept 'overrideGrid'. */}
                    <MandalartGrid initialAnswers={[]} onReset={handleReset} overrideGrid={gridData.length > 0 ? gridData : undefined} />
                </div>
            )}
        </main>
    );
}

export default App;
