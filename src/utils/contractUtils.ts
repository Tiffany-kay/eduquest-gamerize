
// This is a mock implementation of blockchain contract interaction
// In a real implementation, you would use ethers.js or web3.js to interact with actual contracts

export interface Module {
  id: string;
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  xpReward: number;
  tokenReward: number;
  completed: boolean;
}

export interface UserProgress {
  address: string;
  totalXP: number;
  level: number;
  completedModules: string[];
  tokenBalance: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  image: string;
  description: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

// Mock modules data
const mockModules: Module[] = [
  {
    id: "intro-blockchain",
    title: "Introduction to Blockchain",
    description: "Learn the fundamentals of blockchain technology and how it works.",
    level: "beginner",
    xpReward: 100,
    tokenReward: 5,
    completed: false,
  },
  {
    id: "crypto-wallets",
    title: "Cryptocurrency Wallets",
    description: "Understand different types of wallets and how to secure your assets.",
    level: "beginner",
    xpReward: 150,
    tokenReward: 10,
    completed: false,
  },
  {
    id: "smart-contracts",
    title: "Smart Contracts 101",
    description: "Explore how smart contracts work and their real-world applications.",
    level: "intermediate",
    xpReward: 200,
    tokenReward: 15,
    completed: false,
  },
  {
    id: "defi-basics",
    title: "DeFi Fundamentals",
    description: "Discover the world of decentralized finance and its core concepts.",
    level: "intermediate",
    xpReward: 250,
    tokenReward: 20,
    completed: false,
  },
  {
    id: "nft-creation",
    title: "Creating NFTs",
    description: "Learn how to mint and trade non-fungible tokens on EduChain.",
    level: "advanced",
    xpReward: 300,
    tokenReward: 25,
    completed: false,
  },
];

// Mock badges data
const mockBadges: Badge[] = [
  {
    id: "blockchain-beginner",
    name: "Blockchain Rookie",
    image: "badge-rookie.svg",
    description: "Completed your first blockchain module",
    rarity: "common",
  },
  {
    id: "smart-thinker",
    name: "Smart Contract Whiz",
    image: "badge-whiz.svg",
    description: "Mastered the fundamentals of smart contracts",
    rarity: "rare",
  },
  {
    id: "defi-explorer",
    name: "DeFi Explorer",
    image: "badge-explorer.svg",
    description: "Navigated the complex world of decentralized finance",
    rarity: "epic",
  },
  {
    id: "nft-creator",
    name: "NFT Creator",
    image: "badge-creator.svg",
    description: "Created your first non-fungible token",
    rarity: "legendary",
  },
];

// Default user progress
let userProgress: UserProgress = {
  address: "",
  totalXP: 0,
  level: 1,
  completedModules: [],
  tokenBalance: 0,
  badges: [],
};

// Get all modules
export const getModules = async (): Promise<Module[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  return mockModules;
};

// Get module by ID
export const getModuleById = async (id: string): Promise<Module | undefined> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockModules.find((module) => module.id === id);
};

// Get user progress
export const getUserProgress = async (address: string): Promise<UserProgress> => {
  await new Promise((resolve) => setTimeout(resolve, 700));
  
  if (userProgress.address === address) {
    return userProgress;
  }
  
  // Initialize user progress for new user
  userProgress = {
    address,
    totalXP: 0,
    level: 1,
    completedModules: [],
    tokenBalance: 0,
    badges: [],
  };
  
  return userProgress;
};

// Complete a module and receive rewards
export const completeModule = async (address: string, moduleId: string): Promise<{
  success: boolean;
  txHash?: string;
  reward?: {
    xp: number;
    tokens: number;
    newBadge?: Badge;
  };
}> => {
  // Simulate blockchain transaction delay
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  const module = mockModules.find((m) => m.id === moduleId);
  
  if (!module) {
    return { success: false };
  }
  
  // Update user progress
  if (!userProgress.completedModules.includes(moduleId)) {
    userProgress.completedModules.push(moduleId);
    userProgress.totalXP += module.xpReward;
    userProgress.tokenBalance += module.tokenReward;
    
    // Calculate new level (1 level per 250 XP)
    userProgress.level = Math.max(1, Math.floor(userProgress.totalXP / 250) + 1);
    
    // Check if user earned a badge
    let newBadge: Badge | undefined;
    
    if (moduleId === "intro-blockchain" && !userProgress.badges.some(b => b.id === "blockchain-beginner")) {
      newBadge = mockBadges.find(b => b.id === "blockchain-beginner");
      if (newBadge) userProgress.badges.push(newBadge);
    } else if (moduleId === "smart-contracts" && !userProgress.badges.some(b => b.id === "smart-thinker")) {
      newBadge = mockBadges.find(b => b.id === "smart-thinker");
      if (newBadge) userProgress.badges.push(newBadge);
    } else if (moduleId === "defi-basics" && !userProgress.badges.some(b => b.id === "defi-explorer")) {
      newBadge = mockBadges.find(b => b.id === "defi-explorer");
      if (newBadge) userProgress.badges.push(newBadge);
    } else if (moduleId === "nft-creation" && !userProgress.badges.some(b => b.id === "nft-creator")) {
      newBadge = mockBadges.find(b => b.id === "nft-creator");
      if (newBadge) userProgress.badges.push(newBadge);
    }
    
    // Update module status
    const moduleIndex = mockModules.findIndex(m => m.id === moduleId);
    if (moduleIndex !== -1) {
      mockModules[moduleIndex].completed = true;
    }
    
    return {
      success: true,
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      reward: {
        xp: module.xpReward,
        tokens: module.tokenReward,
        newBadge,
      },
    };
  }
  
  // Module already completed
  return { success: false };
};
