import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { questions } from "@/data/questions";

interface QuestionFlowProps {
    onComplete: (answers: string[]) => void;
}

export function QuestionFlow({ onComplete }: QuestionFlowProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));

    const handleNext = () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep((prev) => prev + 1);
        } else {
            onComplete(answers);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newAnswers = [...answers];
        newAnswers[currentStep] = e.target.value;
        setAnswers(newAnswers);
    };

    const currentQ = questions[currentStep];

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-xl"
                >
                    <Card className="border-none shadow-lg bg-card text-card-foreground">
                        <CardHeader>
                            <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
                                <span>{currentQ.category}</span>
                                <span>{currentStep + 1} / {questions.length}</span>
                            </div>
                            <CardTitle className="text-xl md:text-2xl leading-relaxed">
                                {currentQ.text}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                value={answers[currentStep]}
                                onChange={handleChange}
                                placeholder="여기에 생각을 적어보세요..."
                                className="min-h-[150px] text-lg bg-transparent border-input focus:border-primary resize-none"
                                autoFocus
                            />
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button
                                variant="ghost"
                                onClick={handlePrev}
                                disabled={currentStep === 0}
                                className="text-muted-foreground hover:text-primary"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" /> 이전
                            </Button>
                            <Button
                                onClick={handleNext}
                                disabled={!answers[currentStep].trim()}
                                className="bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                {currentStep === questions.length - 1 ? (
                                    <>완료 <Check className="ml-2 h-4 w-4" /></>
                                ) : (
                                    <>다음 <ArrowRight className="ml-2 h-4 w-4" /></>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            </AnimatePresence>

            {/* Progress Indicator */}
            <div className="flex gap-2 mt-8">
                {questions.map((_, idx) => (
                    <div
                        key={idx}
                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentStep ? "w-8 bg-primary" : "w-1.5 bg-muted"
                            } ${idx < currentStep ? "bg-primary/50" : ""}`}
                    />
                ))}
            </div>
        </div>
    );
}
