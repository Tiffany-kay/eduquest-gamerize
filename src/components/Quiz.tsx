
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Quiz as QuizType, completeQuiz } from "@/utils/contractUtils";
import { useWallet } from "@/hooks/useWallet";
import { AlertCircle, CheckCircle, ChevronLeft, ChevronRight, Loader2, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import FlipCard from "./FlipCard";

interface QuizProps {
  quiz: QuizType;
  moduleId: string;
  submoduleId: string;
  onComplete: (success: boolean, reward?: { xp: number; tokens: number }) => void;
}

const Quiz = ({ quiz, moduleId, submoduleId, onComplete }: QuizProps) => {
  const { wallet } = useWallet();
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>(Array(quiz.questions.length).fill(-1));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<{
    correct: boolean[];
    score: number;
    totalQuestions: number;
    reward?: { xp: number; tokens: number };
  } | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const hasAnsweredCurrent = userAnswers[currentQuestionIndex] !== -1;
  const allQuestionsAnswered = userAnswers.every(answer => answer !== -1);

  const handleAnswerSelect = (value: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = parseInt(value);
    setUserAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowExplanation(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowExplanation(false);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!wallet.address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to submit the quiz",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await completeQuiz(
        wallet.address,
        moduleId,
        submoduleId,
        quiz.id,
        userAnswers
      );

      if (result.answers) {
        setResults({
          correct: result.answers.correct,
          score: result.answers.score,
          totalQuestions: result.answers.totalQuestions,
          reward: result.reward,
        });

        // Notify parent component
        if (result.success && result.reward) {
          onComplete(true, result.reward);
        } else {
          onComplete(false);
        }
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast({
        title: "Error",
        description: "Failed to submit quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If showing results screen
  if (results) {
    const passThreshold = Math.ceil(quiz.questions.length * 0.7);
    const passed = results.score >= passThreshold;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <Card className="border shadow-md">
          <CardHeader className="pb-4 text-center">
            <CardTitle className="text-2xl flex justify-center items-center gap-2">
              {passed ? (
                <>
                  <Trophy className="h-6 w-6 text-yellow-500" />
                  Quiz Completed!
                </>
              ) : (
                <>
                  <AlertCircle className="h-6 w-6 text-red-500" />
                  Almost There!
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.3 }}
                className="mb-4"
              >
                <div className="relative h-32 w-32 flex items-center justify-center">
                  <svg className="h-32 w-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="60"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-muted"
                    />
                    <motion.circle
                      cx="64"
                      cy="64"
                      r="60"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 60}
                      strokeDashoffset={
                        2 * Math.PI * 60 * (1 - results.score / results.totalQuestions)
                      }
                      className={passed ? "text-green-500" : "text-amber-500"}
                      initial={{ strokeDashoffset: 2 * Math.PI * 60 }}
                      animate={{
                        strokeDashoffset:
                          2 * Math.PI * 60 * (1 - results.score / results.totalQuestions),
                      }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span
                      className="text-3xl font-bold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {Math.round((results.score / results.totalQuestions) * 100)}%
                    </motion.span>
                  </div>
                </div>
              </motion.div>

              <motion.p
                className="text-xl font-semibold mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Score: {results.score}/{results.totalQuestions}
              </motion.p>

              <motion.p
                className="text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {passed
                  ? "Great job! You've passed the quiz."
                  : `You need at least ${passThreshold} correct answers to pass.`}
              </motion.p>
            </div>

            {passed && results.reward && (
              <motion.div
                className="bg-primary/10 rounded-lg p-4 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <p className="font-semibold mb-2">Rewards Earned:</p>
                <div className="flex justify-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
                      <Trophy className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">XP</p>
                      <p className="font-medium">+{results.reward.xp}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                      <Trophy className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Tokens</p>
                      <p className="font-medium">+{results.reward.tokens} EDU</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {!passed && (
              <Alert variant="destructive" className="bg-destructive/10 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Don't worry!</AlertTitle>
                <AlertDescription>
                  You can review the material and try the quiz again.
                </AlertDescription>
              </Alert>
            )}

            <div className="pt-4">
              <p className="font-medium mb-2">Question Review:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {results.correct.map((isCorrect, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className={cn(
                      "w-10 h-10 font-semibold",
                      isCorrect
                        ? "bg-green-100 border-green-300 dark:bg-green-900/20 dark:border-green-800"
                        : "bg-red-100 border-red-300 dark:bg-red-900/20 dark:border-red-800"
                    )}
                    onClick={() => {
                      setCurrentQuestionIndex(index);
                      setShowExplanation(true);
                      setResults(null);
                    }}
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => {
                setResults(null);
                setCurrentQuestionIndex(0);
                setUserAnswers(Array(quiz.questions.length).fill(-1));
              }}
            >
              Try Again
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">{quiz.title}</h3>
        <div className="text-sm font-medium">
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </div>
      </div>

      <Progress value={((currentQuestionIndex + 1) / quiz.questions.length) * 100} className="h-2" />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {showExplanation ? (
            <FlipCard
              frontContent={
                <div className="h-full flex flex-col">
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg mb-2">{currentQuestion.question}</h3>
                    <RadioGroup
                      value={userAnswers[currentQuestionIndex].toString()}
                      className="space-y-3"
                    >
                      {currentQuestion.options.map((option, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            "flex items-center space-x-2 rounded-md border p-3",
                            userAnswers[currentQuestionIndex] === idx &&
                              idx === currentQuestion.correctOptionIndex &&
                              "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800",
                            userAnswers[currentQuestionIndex] === idx &&
                              idx !== currentQuestion.correctOptionIndex &&
                              "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800",
                            idx === currentQuestion.correctOptionIndex &&
                              "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                          )}
                        >
                          <RadioGroupItem value={idx.toString()} id={`option-${idx}`} disabled />
                          <Label htmlFor={`option-${idx}`} className="flex-1">
                            {option}
                          </Label>
                          {idx === currentQuestion.correctOptionIndex && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <p className="text-sm text-muted-foreground mt-auto">Click to see explanation</p>
                </div>
              }
              backContent={
                <div className="h-full flex flex-col">
                  <h3 className="font-semibold text-lg mb-4">Explanation</h3>
                  <p className="text-muted-foreground flex-1">
                    {currentQuestion.explanation}
                  </p>
                  <p className="text-sm text-muted-foreground mt-auto">Click to see question</p>
                </div>
              }
            />
          ) : (
            <Card className="border shadow-md">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-4">{currentQuestion.question}</h3>
                <RadioGroup
                  value={
                    userAnswers[currentQuestionIndex] === -1
                      ? undefined
                      : userAnswers[currentQuestionIndex].toString()
                  }
                  onValueChange={handleAnswerSelect}
                  className="space-y-3"
                >
                  {currentQuestion.options.map((option, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "flex items-center space-x-2 rounded-md border p-3 transition-colors",
                        userAnswers[currentQuestionIndex] === idx &&
                          "bg-primary/10 border-primary/30"
                      )}
                    >
                      <RadioGroupItem value={idx.toString()} id={`option-${idx}`} />
                      <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-4 mt-4">
                <Button
                  variant="outline"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                {currentQuestionIndex === quiz.questions.length - 1 ? (
                  <Button
                    onClick={() => setShowExplanation(true)}
                    variant="outline"
                    disabled={!hasAnsweredCurrent}
                  >
                    Check Answer
                  </Button>
                ) : (
                  <Button onClick={handleNextQuestion} disabled={!hasAnsweredCurrent}>
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </CardFooter>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between items-center mt-6">
        <div className="flex gap-2">
          {quiz.questions.map((_, idx) => (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              className={cn(
                "w-8 h-8 font-medium",
                idx === currentQuestionIndex && "bg-primary text-primary-foreground",
                userAnswers[idx] !== -1 &&
                  idx !== currentQuestionIndex &&
                  "bg-primary/20 border-primary/30"
              )}
              onClick={() => {
                setCurrentQuestionIndex(idx);
                setShowExplanation(false);
              }}
            >
              {idx + 1}
            </Button>
          ))}
        </div>

        <Button
          onClick={handleSubmitQuiz}
          disabled={!allQuestionsAnswered || isSubmitting}
          className="px-6"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
            </>
          ) : (
            "Submit Quiz"
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default Quiz;
