// Mandalart Grid Component - verified
import { useState, useEffect } from "react";
import { RefreshCw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateMandalartHtml } from "@/lib/exporter";
import { getPreFilledGrid } from "@/data/userData";

interface MandalartGridProps {
    initialAnswers: string[];
    onReset: () => void;
}

type GridState = string[][]; // 9 blocks, each has 9 cells.

const initialGrid = getPreFilledGrid();

export function MandalartGrid({ initialAnswers, onReset }: MandalartGridProps) {
    const [grid, setGrid] = useState<GridState>(initialGrid);

    useEffect(() => {
        // If initialAnswers are provided (from Question Flow), use them to override or fill.
        // But in this specific user scenario, we want to prioritize the pre-filled data 
        // if initialAnswers is empty or just generic.

        if (initialAnswers && initialAnswers.length > 0 && initialAnswers[0]) {
            const newGrid = Array(9).fill(null).map(() => Array(9).fill(""));
            if (initialAnswers[0]) newGrid[4][4] = initialAnswers[0];

            const surroundingIndices = [0, 1, 2, 3, 5, 6, 7, 8];
            for (let i = 1; i < initialAnswers.length; i++) {
                const targetIndex = surroundingIndices[i - 1];
                if (targetIndex !== undefined) {
                    newGrid[4][targetIndex] = initialAnswers[i];
                    newGrid[targetIndex][4] = initialAnswers[i];
                }
            }
            setGrid(newGrid);
        } else {
            // Use Default Pre-filled if reset or empty
            setGrid(getPreFilledGrid());
        }
    }, [initialAnswers]);

    const handleCellChange = (blockIndex: number, cellIndex: number, value: string) => {
        const newGrid = [...grid];
        newGrid[blockIndex] = [...newGrid[blockIndex]];
        newGrid[blockIndex][cellIndex] = value;

        // Propagate logic
        // If we changed a cell in Block 4 (Center Block)
        if (blockIndex === 4) {
            if (cellIndex === 4) {
                // Core Goal changed
            } else {
                // Key Area changed -> update corresponding Outer Block Center
                // The logic: Cell X in Block 4 corresponds to Center (4) of Block X.
                newGrid[cellIndex][4] = value;
            }
        }

        // If we changed a Center cell of an Outer Block (Block X, Cell 4) -> Update Block 4, Cell X
        if (blockIndex !== 4 && cellIndex === 4) {
            newGrid[4][blockIndex] = value;
        }

        setGrid(newGrid);
    };

    const handleDownload = () => {
        const html = generateMandalartHtml(grid);
        const blob = new Blob([html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "mandalart.html";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex flex-col items-center w-full max-w-6xl p-2 md:p-8 animate-in fade-in duration-500">
            <div className="flex justify-between w-full mb-6 items-center">
                <h2 className="text-2xl font-bold text-primary">My Mandalart</h2>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={onReset} className="border-muted-foreground/30">
                        <RefreshCw className="mr-2 h-4 w-4" /> 다시하기
                    </Button>
                    <Button onClick={handleDownload} className="bg-primary hover:bg-primary/90">
                        <Download className="mr-2 h-4 w-4" /> HTML 저장
                    </Button>
                </div>
            </div>

            {/* Grid Container */}
            <div className="grid grid-cols-3 gap-3 md:gap-6 p-2 md:p-6 bg-secondary/10 rounded-xl backdrop-blur-sm border border-white/5">
                {grid.map((block, blockIndex) => (
                    <div key={blockIndex} className={`grid grid-cols-3 gap-0.5 md:gap-1 aspect-square ${blockIndex === 4 ? "ring-2 ring-primary/20 rounded-xl" : ""}`}>
                        {block.map((cellValue, cellIndex) => {
                            const checkIsCenter = (bIdx: number, cIdx: number) => {
                                if (bIdx === 4 && cIdx === 4) return "core"; // Absolute Center
                                if (bIdx === 4) return "key"; // Key Area in Center Block
                                if (cIdx === 4) return "sub-key"; // Key Area in Outer Block
                                return "detail";
                            };

                            const type = checkIsCenter(blockIndex, cellIndex);

                            let bgClass = "bg-background";
                            let textClass = "text-foreground";

                            if (type === "core") {
                                bgClass = "bg-primary text-primary-foreground font-bold";
                            } else if (type === "key" || type === "sub-key") {
                                bgClass = "bg-secondary text-secondary-foreground font-semibold";
                            } else {
                                bgClass = "bg-card text-card-foreground hover:bg-accent/50";
                            }

                            return (
                                <textarea
                                    key={cellIndex}
                                    value={cellValue}
                                    onChange={(e) => handleCellChange(blockIndex, cellIndex, e.target.value)}
                                    className={`
                    w-full h-full resize-none
                    text-[9px] md:text-xs text-center p-0.5 md:p-1
                    flex items-center justify-center
                    border border-border/20 rounded-md focus:outline-none focus:ring-1 focus:ring-primary
                    transition-all duration-200
                    overflow-hidden
                    leading-tight
                    ${bgClass} ${textClass}
                  `}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                    }}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}
