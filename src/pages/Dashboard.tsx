
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserProgress, getModules, Module, UserProgress, Badge } from "@/utils/contractUtils";
import ProgressBar from "@/components/ProgressBar";
import RewardBadge from "@/components/RewardBadge";
import { ArrowRight, Brain, ChevronRight, Coins, Star, Zap, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AnimatedModuleCard from "@/components/AnimatedModuleCard";
import { motion } from "framer-motion";

const Dashboard = () => {
  const navigate = useNavigate();
  const { wallet } = useWallet();
  const { toast } = useToast();
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user data and modules
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (wallet.address) {
          const progress = await getUserProgress(wallet.address);
          setUserProgress(progress);
          
          const availableModules = await getModules();
          setModules(availableModules);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load your progress. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [wallet.address, toast]);

  // Calculate level progress
  const calculateLevelProgress = () => {
    if (!userProgress) return { current: 0, target: 250, percentage: 0 };
    
    const currentLevel = userProgress.level;
    const baseXP = (currentLevel - 1) * 250;
    const currentLevelXP = userProgress.totalXP - baseXP;
    const targetXP = 250; // XP needed for next level
    
    return {
      current: currentLevelXP,
      target: targetXP,
      percentage: Math.min(Math.round((currentLevelXP / targetXP) * 100), 100),
    };
  };

  // Get recommended modules
  const getRecommendedModules = () => {
    if (!modules.length || !userProgress) return [];
    
    // Filter for incomplete modules
    const incompleteModules = modules.filter(
      module => !userProgress.completedModules.includes(module.id)
    );
    
    // Sort by level (beginner first, then intermediate, then advanced)
    const sortedModules = [...incompleteModules].sort((a, b) => {
      const levelOrder = { beginner: 1, intermediate: 2, advanced: 3 };
      return levelOrder[a.level] - levelOrder[b.level];
    });
    
    // Return up to 3 recommended modules
    return sortedModules.slice(0, 3);
  };

  // Handle module selection
  const handleModuleSelect = (moduleId: string) => {
    navigate(`/modules/${moduleId}`);
  };

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Placeholder when wallet is not connected
  if (!wallet.connected) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <motion.div 
          className="container max-w-5xl mx-auto pt-24 px-4 pb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <motion.div 
              className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.3 }}
            >
              <Coins className="h-8 w-8 text-muted-foreground" />
            </motion.div>
            <motion.h1 
              className="text-3xl font-bold mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Connect Your Wallet
            </motion.h1>
            <motion.p 
              className="text-muted-foreground max-w-md mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Connect your wallet to access your learning dashboard and track your progress.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button onClick={() => navigate("/")} className="group">
                Return to Home
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  const levelProgress = calculateLevelProgress();
  const recommendedModules = getRecommendedModules();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container max-w-5xl mx-auto pt-24 px-4 pb-16">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* User progress card */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            <Card className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle>
                  <div className="flex justify-between items-center">
                    <span>Your Learning Journey</span>
                    {userProgress && (
                      <div className="flex items-center gap-1 text-sm font-normal bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full">
                        <Brain className="h-4 w-4" />
                        <span>Level {userProgress.level}</span>
                      </div>
                    )}
                  </div>
                </CardTitle>
                <CardDescription>
                  Track your progress and earn rewards as you learn
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="animate-pulse flex flex-col gap-4">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-2 bg-muted rounded w-full"></div>
                    <div className="h-20 bg-muted rounded w-full"></div>
                  </div>
                ) : (
                  <>
                    {userProgress && (
                      <div className="space-y-5">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-medium">Level Progress</span>
                            <span className="text-muted-foreground">
                              {levelProgress.current}/{levelProgress.target} XP to Level {userProgress.level + 1}
                            </span>
                          </div>
                          <ProgressBar 
                            progress={levelProgress.current} 
                            total={levelProgress.target} 
                            showPercentage={false}
                            height="lg"
                            barClassName="bg-gradient-to-r from-purple-500 to-blue-500"
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          <div className="bg-muted/50 rounded-lg p-4 flex items-center gap-3 group hover:bg-muted/80 transition-colors">
                            <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                              <Zap className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Total XP</p>
                              <p className="text-2xl font-bold">{userProgress.totalXP}</p>
                            </div>
                          </div>
                          
                          <div className="bg-muted/50 rounded-lg p-4 flex items-center gap-3 group hover:bg-muted/80 transition-colors">
                            <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                              <Coins className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">EDU Tokens</p>
                              <p className="text-2xl font-bold">{userProgress.tokenBalance}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Badges card */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Your Badges</CardTitle>
                <CardDescription>
                  Achievements you've unlocked
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="animate-pulse flex gap-2 justify-center">
                    <div className="h-12 w-12 bg-muted rounded-full"></div>
                    <div className="h-12 w-12 bg-muted rounded-full"></div>
                    <div className="h-12 w-12 bg-muted rounded-full"></div>
                  </div>
                ) : (
                  <>
                    {userProgress && userProgress.badges.length > 0 ? (
                      <div className="flex flex-wrap gap-3 justify-center py-2">
                        {userProgress.badges.map((badge: Badge, index) => (
                          <motion.div
                            key={badge.id}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ 
                              delay: 0.5 + (index * 0.1),
                              type: "spring",
                              stiffness: 400,
                              damping: 10
                            }}
                          >
                            <RewardBadge badge={badge} />
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground py-8">
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ 
                            delay: 0.5,
                            type: "spring",
                            stiffness: 300,
                            damping: 15
                          }}
                        >
                          <Star className="h-8 w-8 mx-auto mb-2 opacity-40" />
                          <p className="text-sm">Complete modules to earn badges</p>
                        </motion.div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
        
        {/* Recommended modules */}
        <motion.div 
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">Recommended Modules</h2>
              <Sparkles className="h-5 w-5 text-purple-400 animate-pulse" />
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/modules")} className="gap-1 group">
              View all <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-card rounded-xl p-6 border">
                  <div className="h-4 bg-muted rounded w-1/3 mb-3"></div>
                  <div className="h-6 bg-muted rounded w-2/3 mb-6"></div>
                  <div className="h-24 bg-muted rounded w-full mb-6"></div>
                  <div className="h-9 bg-muted rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {recommendedModules.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recommendedModules.map((module, index) => (
                    <AnimatedModuleCard 
                      key={module.id} 
                      module={module} 
                      onModuleSelect={handleModuleSelect}
                      delay={index}
                    />
                  ))}
                </div>
              ) : (
                <motion.div 
                  className="text-center py-12 bg-muted/30 rounded-xl border"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <h3 className="text-xl font-medium mb-2">You've completed all modules!</h3>
                  <p className="text-muted-foreground mb-6">Great job! Check back soon for new content.</p>
                  <Button onClick={() => navigate("/modules")} className="group">
                    Review All Modules <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
