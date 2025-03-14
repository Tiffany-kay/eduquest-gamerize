
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";
import { 
  Module as ModuleType, 
  Submodule,
  getModules, 
  getModuleById, 
  getUserProgress
} from "@/utils/contractUtils";
import AnimatedModuleCard from "@/components/AnimatedModuleCard";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertCircle, 
  ArrowLeft, 
  BookOpen, 
  CheckCircle, 
  ChevronRight,
  Coins, 
  Gift, 
  Loader2, 
  Sparkles, 
  Zap 
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProgressBar from "@/components/ProgressBar";
import RewardBadge from "@/components/RewardBadge";
import { motion, AnimatePresence } from "framer-motion";
import SubmoduleView from "@/components/SubmoduleView";

const Modules = () => {
  const navigate = useNavigate();
  const { moduleId } = useParams<{ moduleId: string }>();
  const { wallet } = useWallet();
  const { toast } = useToast();
  
  const [modules, setModules] = useState<ModuleType[]>([]);
  const [selectedModule, setSelectedModule] = useState<ModuleType | null>(null);
  const [selectedSubmodule, setSelectedSubmodule] = useState<Submodule | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [completingModule, setCompletingModule] = useState(false);
  const [showRewardDialog, setShowRewardDialog] = useState(false);
  const [reward, setReward] = useState<{
    xp: number;
    tokens: number;
    newBadge?: any;
    txHash: string;
  } | null>(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    },
    exit: { 
      opacity: 0, 
      y: 20,
      transition: { duration: 0.3 }
    }
  };

  // Fetch modules data
  useEffect(() => {
    const fetchModules = async () => {
      setLoading(true);
      try {
        const modulesData = await getModules();
        
        // If user has already completed modules (from localStorage), mark them as completed
        if (wallet.address) {
          const progress = await getUserProgress(wallet.address);
          if (progress) {
            // Mark completed modules
            if (progress.completedModules.length > 0) {
              modulesData.forEach(module => {
                if (progress.completedModules.includes(module.id)) {
                  module.completed = true;
                }
              });
            }
            
            // Mark completed submodules
            if (progress.completedSubmodules.length > 0) {
              modulesData.forEach(module => {
                module.submodules.forEach(submodule => {
                  if (progress.completedSubmodules.includes(submodule.id)) {
                    submodule.completed = true;
                  }
                });
              });
            }
            
            // Mark completed quizzes
            if (progress.completedQuizzes.length > 0) {
              modulesData.forEach(module => {
                module.submodules.forEach(submodule => {
                  submodule.quizzes.forEach(quiz => {
                    if (progress.completedQuizzes.includes(quiz.id)) {
                      quiz.completed = true;
                    }
                  });
                });
              });
            }
          }
        }
        
        setModules(modulesData);
        
        // If there's a moduleId in the URL, fetch that specific module
        if (moduleId) {
          const module = modulesData.find(m => m.id === moduleId);
          if (module) {
            setSelectedModule(module);
          } else {
            navigate("/modules");
            toast({
              title: "Module not found",
              description: "The requested module could not be found.",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching modules:", error);
        toast({
          title: "Error",
          description: "Failed to load modules. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchModules();
  }, [moduleId, navigate, toast, wallet.address]);

  // Handle submodule completion
  const handleSubmoduleComplete = (reward: { xp: number; tokens: number }) => {
    // Show a toast notification
    toast({
      title: "Submodule Completed!",
      description: `You earned ${reward.xp} XP and ${reward.tokens} EDU tokens.`,
    });

    // Update the UI to reflect completion
    if (selectedModule && selectedSubmodule) {
      // Mark the submodule as completed
      const updatedModules = [...modules];
      const moduleIndex = updatedModules.findIndex(m => m.id === selectedModule.id);
      
      if (moduleIndex !== -1) {
        const submoduleIndex = updatedModules[moduleIndex].submodules.findIndex(
          s => s.id === selectedSubmodule.id
        );
        
        if (submoduleIndex !== -1) {
          updatedModules[moduleIndex].submodules[submoduleIndex].completed = true;
          
          // Also update the selectedModule and selectedSubmodule
          setSelectedModule({
            ...selectedModule,
            submodules: selectedModule.submodules.map(s =>
              s.id === selectedSubmodule.id ? { ...s, completed: true } : s
            )
          });
          
          setSelectedSubmodule({ ...selectedSubmodule, completed: true });
          setModules(updatedModules);
        }
      }
    }
  };

  // Filter modules based on active tab
  const filteredModules = modules.filter(module => {
    if (activeTab === "all") return true;
    return module.level === activeTab;
  });

  // Select a module to view
  const handleModuleSelect = (moduleId: string) => {
    navigate(`/modules/${moduleId}`);
  };

  // Select a submodule to view
  const handleSubmoduleSelect = (submodule: Submodule) => {
    setSelectedSubmodule(submodule);
  };

  // Go back to modules list
  const handleBackToModules = () => {
    setSelectedModule(null);
    setSelectedSubmodule(null);
    navigate("/modules");
  };

  // Go back to module from submodule
  const handleBackToModule = () => {
    setSelectedSubmodule(null);
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
              <BookOpen className="h-8 w-8 text-muted-foreground" />
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
              Connect your wallet to access learning modules and track your progress.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button onClick={() => navigate("/")} className="group">
                Return to Home
                <ArrowLeft className="ml-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container max-w-5xl mx-auto pt-24 px-4 pb-16">
        <AnimatePresence mode="wait">
          {selectedSubmodule ? (
            // Submodule view
            <SubmoduleView
              moduleId={selectedModule!.id}
              submodule={selectedSubmodule}
              onBack={handleBackToModule}
              onComplete={handleSubmoduleComplete}
            />
          ) : selectedModule ? (
            // Module detail view
            <motion.div
              key="module-detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mb-6 group"
                  onClick={handleBackToModules}
                >
                  <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Modules
                </Button>
              </motion.div>
              
              <motion.div 
                className="bg-card rounded-xl border overflow-hidden mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-6 md:p-8 border-b relative overflow-hidden">
                  <motion.div 
                    className="absolute -top-10 -right-10 w-40 h-40 bg-purple-400/10 rounded-full blur-2xl"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ 
                      duration: 5, 
                      repeat: Infinity,
                      repeatType: "reverse" 
                    }}
                  />
                  
                  <motion.div 
                    className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-400/10 rounded-full blur-2xl"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ 
                      duration: 7, 
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: 1 
                    }}
                  />
                
                  <motion.div 
                    className="flex items-center gap-2 mb-2"
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {selectedModule.level === "beginner" && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 capitalize">
                        Beginner
                      </span>
                    )}
                    {selectedModule.level === "intermediate" && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 capitalize">
                        Intermediate
                      </span>
                    )}
                    {selectedModule.level === "advanced" && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 capitalize">
                        Advanced
                      </span>
                    )}
                    
                    {selectedModule.completed && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" /> Completed
                      </span>
                    )}
                  </motion.div>
                  
                  <motion.h1 
                    className="text-3xl font-bold mb-4 relative z-10"
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {selectedModule.title}
                    <motion.span 
                      className="absolute -top-1 -right-4 text-purple-500"
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.8, type: "spring" }}
                    >
                      <Sparkles className="h-5 w-5" />
                    </motion.span>
                  </motion.h1>
                  
                  <motion.p 
                    className="text-muted-foreground max-w-2xl mb-6 relative z-10"
                    initial={{ y: -5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {selectedModule.description}
                  </motion.p>
                  
                  <motion.div 
                    className="flex flex-wrap gap-6 relative z-10"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <motion.div 
                      className="flex items-center gap-2 group"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                        <Zap className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Reward</p>
                        <p className="font-medium">{selectedModule.xpReward} XP</p>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-center gap-2 group"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                        <Coins className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Tokens</p>
                        <p className="font-medium">{selectedModule.tokenReward} EDU</p>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
                
                <div className="p-6 md:p-8">
                  <motion.h2 
                    className="text-2xl font-bold mb-6 flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <BookOpen className="h-5 w-5 text-purple-500" />
                    Learning Submodules
                  </motion.h2>
                  
                  <motion.div 
                    className="grid grid-cols-1 gap-4 mb-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {selectedModule.submodules.map((submodule, index) => (
                      <motion.div
                        key={submodule.id}
                        variants={itemVariants}
                        whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                        className="border rounded-lg p-5 bg-card transition-all cursor-pointer"
                        onClick={() => handleSubmoduleSelect(submodule)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {submodule.completed ? (
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3" /> Completed
                                </span>
                              ) : (
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                  In Progress
                                </span>
                              )}
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{submodule.title}</h3>
                            <p className="text-sm text-muted-foreground mb-4">{submodule.description}</p>
                            
                            <div className="flex gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Zap className="h-4 w-4 text-amber-500" />
                                <span>{submodule.xpReward} XP</span>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <BookOpen className="h-4 w-4 text-blue-500" />
                                <span>{submodule.quizzes.length} {submodule.quizzes.length === 1 ? 'Quiz' : 'Quizzes'}</span>
                              </div>
                            </div>
                          </div>
                          
                          <Button size="sm" variant="outline" className="ml-4 whitespace-nowrap">
                            Start Learning <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 }}
                  >
                    <Alert className="my-6">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Gamified Learning Experience</AlertTitle>
                      <AlertDescription>
                        Complete all submodules and quizzes to earn XP, tokens, and special badges that will be recorded on the EduChain blockchain.
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            // Modules list view
            <motion.div
              key="modules-list"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div 
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
                variants={itemVariants}
              >
                <div>
                  <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                    Learning Modules
                    <motion.span
                      initial={{ rotate: -10, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ delay: 0.4, type: "spring" }}
                    >
                      <Sparkles className="h-5 w-5 text-purple-400" />
                    </motion.span>
                  </h1>
                  <p className="text-muted-foreground">Choose a module to start your learning journey</p>
                </div>
                
                <Tabs 
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full sm:w-auto"
                >
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="beginner">Beginner</TabsTrigger>
                    <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  </TabsList>
                </Tabs>
              </motion.div>
              
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
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
                  {filteredModules.length > 0 ? (
                    <motion.div 
                      className="grid grid-cols-1 md:grid-cols-3 gap-6"
                      variants={containerVariants}
                    >
                      {filteredModules.map((module, index) => (
                        <AnimatedModuleCard 
                          key={module.id} 
                          module={module}
                          onModuleSelect={handleModuleSelect}
                          delay={index}
                        />
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="text-center py-12 bg-muted/30 rounded-xl border"
                      variants={itemVariants}
                    >
                      <h3 className="text-xl font-medium mb-2">No modules found</h3>
                      <p className="text-muted-foreground">
                        No modules match your current filter. Try selecting a different level.
                      </p>
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      {/* Reward dialog */}
      <Dialog open={showRewardDialog} onOpenChange={setShowRewardDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center mb-2 flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              Rewards Earned!
            </DialogTitle>
            <DialogDescription className="text-center">
              Congratulations! Your achievements have been recorded on the EduChain blockchain.
            </DialogDescription>
          </DialogHeader>
          
          <motion.div 
            className="bg-purple-50 dark:bg-purple-900/10 rounded-lg p-6 my-4 text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <div className="flex justify-center items-center gap-8 mb-6">
              <motion.div 
                className="text-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, 0, -5, 0],
                  }}
                  transition={{ 
                    duration: 1,
                    delay: 0.5,
                    type: "spring"
                  }}
                >
                  <Zap className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                </motion.div>
                <span className="block text-sm text-muted-foreground mb-1">XP Earned</span>
                <motion.span 
                  className="text-2xl font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {reward?.xp}
                </motion.span>
              </motion.div>
              
              <motion.div 
                className="text-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, -5, 0, 5, 0],
                  }}
                  transition={{ 
                    duration: 1,
                    delay: 0.7,
                    type: "spring"
                  }}
                >
                  <Coins className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                </motion.div>
                <span className="block text-sm text-muted-foreground mb-1">EDU Tokens</span>
                <motion.span 
                  className="text-2xl font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {reward?.tokens}
                </motion.span>
              </motion.div>
            </div>
            
            {reward?.newBadge && (
              <motion.div 
                className="border-t pt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="text-center mb-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      delay: 0.8,
                      type: "spring",
                      stiffness: 400,
                      damping: 10
                    }}
                  >
                    <Gift className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                  </motion.div>
                  <h3 className="text-lg font-bold">New Badge Unlocked!</h3>
                </div>
                
                <motion.div 
                  className="flex justify-center mb-2"
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    delay: 1,
                    type: "spring",
                    stiffness: 300,
                    damping: 15
                  }}
                >
                  <RewardBadge badge={reward.newBadge} size="lg" />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  <p className="text-sm font-medium">{reward.newBadge.name}</p>
                  <p className="text-xs text-muted-foreground">{reward.newBadge.description}</p>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
          
          <motion.div 
            className="text-xs text-muted-foreground text-center break-all"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            Transaction Hash: {reward?.txHash}
          </motion.div>
          
          <motion.div 
            className="flex justify-center"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.6 }}
          >
            <Button onClick={() => setShowRewardDialog(false)}>
              Continue Learning
            </Button>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Modules;
