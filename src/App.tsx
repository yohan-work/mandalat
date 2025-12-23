import { useState } from 'react';
import { QuestionFlow } from '@/components/QuestionFlow';
import { MandalartGrid } from '@/components/MandalartGrid';

function App() {
  const [step, setStep] = useState<"questions" | "grid">("questions");
  const [answers, setAnswers] = useState<string[]>([]);

  const handleQuestionsComplete = (collectedAnswers: string[]) => {
    setAnswers(collectedAnswers);
    setStep("grid");
  };

  const handleReset = () => {
    setStep("questions");
    setAnswers([]);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-10">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-primary">Mandalart Generator</h1>
        <p className="text-muted-foreground mt-2">Thoughts to Structure.</p>
      </header>

      <main className="w-full max-w-6xl px-4 flex flex-col items-center">
        {step === "questions" ? (
          <QuestionFlow onComplete={handleQuestionsComplete} />
        ) : (
          <MandalartGrid initialAnswers={answers} onReset={handleReset} />
        )}
      </main>

      <footer className="mt-16 text-sm text-muted-foreground">
        © 2024 Mandalart Generator. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
