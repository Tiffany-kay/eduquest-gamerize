
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";
import { 
  Module as ModuleType, 
  getModules, 
  getModuleById, 
  getUserProgress, 
  completeModule 
} from "@/utils/contractUtils";
import LevelCard from "@/components/LevelCard";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertCircle, 
  ArrowLeft, 
  BookOpen, 
  CheckCircle, 
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

const Modules = () => {
  const navigate = useNavigate();
  const { moduleId } = useParams<{ moduleId: string }>();
  const { wallet } = useWallet();
  const { toast } = useToast();
  
  const [modules, setModules] = useState<ModuleType[]>([]);
  const [selectedModule, setSelectedModule] = useState<ModuleType | null>(null);
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

  // Fetch modules data
  useEffect(() => {
    const fetchModules = async () => {
      setLoading(true);
      try {
        const modulesData = await getModules();
        setModules(modulesData);
        
        // If there's a moduleId in the URL, fetch that specific module
        if (moduleId) {
          const module = await getModuleById(moduleId);
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
  }, [moduleId, navigate, toast]);

  // Mark module as completed
  const handleCompleteModule = async () => {
    if (!selectedModule || !wallet.address) return;
    
    setCompletingModule(true);
    try {
      const result = await completeModule(wallet.address, selectedModule.id);
      
      if (result.success) {
        toast({
          title: "Module completed!",
          description: "Congratulations! You've successfully completed this module.",
        });
        
        // Update modules list with the completed module
        setModules(prevModules => 
          prevModules.map(module => 
            module.id === selectedModule.id 
              ? { ...module, completed: true } 
              : module
          )
        );
        
        // Update selected module
        setSelectedModule(prev => prev ? { ...prev, completed: true } : null);
        
        // Show reward dialog
        if (result.reward && result.txHash) {
          setReward({
            xp: result.reward.xp,
            tokens: result.reward.tokens,
            newBadge: result.reward.newBadge,
            txHash: result.txHash,
          });
          setShowRewardDialog(true);
        }
      } else {
        toast({
          title: "Already completed",
          description: "You've already completed this module.",
        });
      }
    } catch (error) {
      console.error("Error completing module:", error);
      toast({
        title: "Error",
        description: "Failed to complete the module. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCompletingModule(false);
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

  // Go back to modules list
  const handleBackToModules = () => {
    setSelectedModule(null);
    navigate("/modules");
  };

  // Placeholder when wallet is not connected
  if (!wallet.connected) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container max-w-5xl mx-auto pt-24 px-4 pb-16">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-3">Connect Your Wallet</h1>
            <p className="text-muted-foreground max-w-md mb-8">
              Connect your wallet to access learning modules and track your progress.
            </p>
            <Button onClick={() => navigate("/")}>
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container max-w-5xl mx-auto pt-24 px-4 pb-16">
        {selectedModule ? (
          // Module detail view
          <div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mb-6"
              onClick={handleBackToModules}
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Modules
            </Button>
            
            <div className="bg-card rounded-xl border overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-6 md:p-8 border-b">
                <div className="flex items-center gap-2 mb-2">
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
                </div>
                
                <h1 className="text-3xl font-bold mb-4">{selectedModule.title}</h1>
                <p className="text-muted-foreground max-w-2xl mb-6">{selectedModule.description}</p>
                
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Reward</p>
                      <p className="font-medium">{selectedModule.xpReward} XP</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                      <Coins className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Tokens</p>
                      <p className="font-medium">{selectedModule.tokenReward} EDU</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 md:p-8">
                {/* Sample module content - this would be dynamic in a real app */}
                <div className="prose dark:prose-invert max-w-none">
                  <h2>Module Overview</h2>
                  <p>In this module, you'll learn about the core concepts of {selectedModule.title.toLowerCase()}. We'll cover the fundamental principles, practical applications, and how this technology is shaping the future of finance and digital interactions.</p>
                  
                  <h3>Learning Objectives</h3>
                  <ul>
                    <li>Understand the key terminology and concepts</li>
                    <li>Learn how to apply these principles in real-world scenarios</li>
                    <li>Explore case studies and examples from the industry</li>
                    <li>Complete practical exercises to reinforce your knowledge</li>
                  </ul>
                  
                  <Alert className="my-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Important Note</AlertTitle>
                    <AlertDescription>
                      This is a prototype experience. In a full implementation, this module would contain interactive lessons, quizzes, and hands-on exercises.
                    </AlertDescription>
                  </Alert>
                  
                  <h3>Ready to Complete This Module?</h3>
                  <p>When you feel confident with the material, click the "Complete Module" button below to record your achievement on the EduChain blockchain and receive your rewards.</p>
                </div>
                
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    disabled={selectedModule.completed || completingModule}
                    onClick={handleCompleteModule}
                    className="w-full sm:w-auto"
                  >
                    {completingModule ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : selectedModule.completed ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Module Completed
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Complete Module
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={handleBackToModules}
                    className="w-full sm:w-auto"
                  >
                    Explore Other Modules
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Modules list view
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Learning Modules</h1>
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
            </div>
            
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filteredModules.map((module) => (
                      <LevelCard 
                        key={module.id} 
                        module={module}
                        onModuleSelect={handleModuleSelect}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-muted/30 rounded-xl border">
                    <h3 className="text-xl font-medium mb-2">No modules found</h3>
                    <p className="text-muted-foreground">
                      No modules match your current filter. Try selecting a different level.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
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
          
          <div className="bg-purple-50 dark:bg-purple-900/10 rounded-lg p-6 my-4 text-center">
            <div className="flex justify-center items-center gap-8 mb-6">
              <div className="text-center">
                <Zap className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                <span className="block text-sm text-muted-foreground mb-1">XP Earned</span>
                <span className="text-2xl font-bold">{reward?.xp}</span>
              </div>
              
              <div className="text-center">
                <Coins className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <span className="block text-sm text-muted-foreground mb-1">EDU Tokens</span>
                <span className="text-2xl font-bold">{reward?.tokens}</span>
              </div>
            </div>
            
            {reward?.newBadge && (
              <div className="border-t pt-6">
                <div className="text-center mb-4">
                  <Gift className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                  <h3 className="text-lg font-bold">New Badge Unlocked!</h3>
                </div>
                
                <div className="flex justify-center mb-2">
                  <RewardBadge badge={reward.newBadge} size="lg" />
                </div>
                
                <p className="text-sm font-medium">{reward.newBadge.name}</p>
                <p className="text-xs text-muted-foreground">{reward.newBadge.description}</p>
              </div>
            )}
          </div>
          
          <div className="text-xs text-muted-foreground text-center break-all">
            Transaction Hash: {reward?.txHash}
          </div>
          
          <div className="flex justify-center">
            <Button onClick={() => setShowRewardDialog(false)}>
              Continue Learning
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Modules;
