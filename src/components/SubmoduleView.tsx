
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Submodule, Quiz as QuizType, completeSubmodule } from "@/utils/contractUtils";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@/hooks/useWallet";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle, Loader2, Sparkles, Zap } from "lucide-react";
import Quiz from "./Quiz";
import FlipCard from "./FlipCard";

interface SubmoduleViewProps {
  moduleId: string;
  submodule: Submodule;
  onBack: () => void;
  onComplete: (reward: { xp: number; tokens: number }) => void;
}

const SubmoduleView = ({ moduleId, submodule, onBack, onComplete }: SubmoduleViewProps) => {
  const { wallet } = useWallet();
  const { toast } = useToast();
  const [selectedQuiz, setSelectedQuiz] = useState<QuizType | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [flashcards, setFlashcards] = useState<{ term: string; definition: string }[]>([
    { term: "Blockchain", definition: "A distributed ledger that records transactions across multiple computers" },
    { term: "Decentralization", definition: "The distribution of power away from a central authority" },
    { term: "Smart Contract", definition: "Self-executing contracts where the terms are directly written into code" },
    { term: "Consensus", definition: "The process by which all nodes in a blockchain network agree on the state of the ledger" },
  ]);

  const handleQuizSelect = (quiz: QuizType) => {
    setSelectedQuiz(quiz);
  };

  const handleQuizComplete = (success: boolean, reward?: { xp: number; tokens: number }) => {
    if (success && reward) {
      toast({
        title: "Quiz Completed!",
        description: `You earned ${reward.xp} XP and ${reward.tokens} EDU tokens.`,
      });
    }
  };

  const handleCompleteSubmodule = async () => {
    if (!wallet.address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to complete this submodule",
        variant: "destructive",
      });
      return;
    }

    setIsCompleting(true);
    try {
      const result = await completeSubmodule(wallet.address, moduleId, submodule.id);

      if (result.success && result.reward) {
        toast({
          title: "Submodule completed!",
          description: "Congratulations! You've completed this submodule.",
        });
        onComplete(result.reward);
      } else {
        toast({
          title: "Already completed",
          description: "You've already completed this submodule.",
        });
      }
    } catch (error) {
      console.error("Error completing submodule:", error);
      toast({
        title: "Error",
        description: "Failed to complete the submodule. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCompleting(false);
    }
  };

  // If a quiz is selected, show the quiz component
  if (selectedQuiz) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => setSelectedQuiz(null)} className="mb-4">
          ← Back to Submodule
        </Button>
        
        <Quiz 
          quiz={selectedQuiz} 
          moduleId={moduleId} 
          submoduleId={submodule.id} 
          onComplete={handleQuizComplete}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Button variant="ghost" onClick={onBack} className="mb-4">
        ← Back to Module
      </Button>

      <div className="bg-card rounded-xl border shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-6 border-b">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 border-purple-200 dark:border-purple-800">
              {submodule.completed ? "Completed" : "In Progress"}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold mb-3">{submodule.title}</h1>
          <p className="text-muted-foreground">{submodule.description}</p>
        </div>

        <div className="p-6">
          <div className="prose dark:prose-invert max-w-none mb-6">
            <h2 className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-500" />
              Learning Material
            </h2>
            <p>{submodule.content}</p>

            <div className="my-8">
              <h3 className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-purple-500" />
                Interactive Flashcards
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {flashcards.map((card, index) => (
                  <FlipCard
                    key={index}
                    frontContent={
                      <div className="h-full flex flex-col justify-center items-center text-center">
                        <h3 className="text-xl font-bold mb-2">{card.term}</h3>
                        <p className="text-sm text-muted-foreground mt-auto">Click to flip</p>
                      </div>
                    }
                    backContent={
                      <div className="h-full flex flex-col justify-center items-center text-center">
                        <p className="text-md">{card.definition}</p>
                        <p className="text-sm text-muted-foreground mt-auto">Click to flip back</p>
                      </div>
                    }
                  />
                ))}
              </div>
            </div>

            {submodule.quizzes.length > 0 && (
              <div className="my-8">
                <h3 className="flex items-center gap-2 mb-4">
                  <Zap className="h-5 w-5 text-purple-500" />
                  Knowledge Checks
                </h3>
                <div className="grid grid-cols-1 gap-4 mt-4">
                  {submodule.quizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() => handleQuizSelect(quiz)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{quiz.title}</h4>
                          <p className="text-sm text-muted-foreground">{quiz.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {quiz.completed ? (
                            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800">
                              Completed
                            </Badge>
                          ) : (
                            <Badge>
                              +{quiz.xpReward} XP
                            </Badge>
                          )}
                          <Button size="sm" variant="outline">
                            Start Quiz
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-600">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Reward</p>
                <p className="font-medium">{submodule.xpReward} XP</p>
              </div>
            </div>
            
            <Button
              onClick={handleCompleteSubmodule}
              disabled={submodule.completed || isCompleting}
              className="px-6"
            >
              {isCompleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                </>
              ) : submodule.completed ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" /> Completed
                </>
              ) : (
                "Complete Submodule"
              )}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SubmoduleView;
