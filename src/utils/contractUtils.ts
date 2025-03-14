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
  submodules: Submodule[];
}

export interface Submodule {
  id: string;
  title: string;
  description: string;
  content: string;
  quizzes: Quiz[];
  completed: boolean;
  xpReward: number;
  tokenReward: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  completed: boolean;
  xpReward: number;
  tokenReward: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface UserProgress {
  address: string;
  totalXP: number;
  level: number;
  completedModules: string[];
  completedSubmodules: string[];
  completedQuizzes: string[];
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

// Mock modules data with submodules and quizzes
const mockModules: Module[] = [
  {
    id: "intro-blockchain",
    title: "Introduction to Blockchain",
    description: "Learn the fundamentals of blockchain technology and how it works.",
    level: "beginner",
    xpReward: 100,
    tokenReward: 5,
    completed: false,
    submodules: [
      {
        id: "intro-blockchain-basics",
        title: "Blockchain Basics",
        description: "Understand the core concepts of blockchain technology.",
        content: "Blockchain is a distributed ledger technology that enables secure, transparent, and immutable record-keeping without the need for a central authority...",
        completed: false,
        xpReward: 30,
        tokenReward: 2,
        quizzes: [
          {
            id: "blockchain-basics-quiz",
            title: "Blockchain Fundamentals Quiz",
            description: "Test your understanding of basic blockchain concepts",
            completed: false,
            xpReward: 15,
            tokenReward: 1,
            questions: [
              {
                id: "q1-blockchain-basics",
                question: "What is the primary benefit of blockchain technology?",
                options: [
                  "Centralized control",
                  "Fast transaction processing",
                  "Decentralized trust",
                  "Low energy consumption"
                ],
                correctOptionIndex: 2,
                explanation: "Blockchain enables decentralized trust through its distributed ledger, eliminating the need for a central authority."
              },
              {
                id: "q2-blockchain-basics",
                question: "What is a block in blockchain?",
                options: [
                  "A digital currency",
                  "A collection of transactions",
                  "A type of encryption",
                  "A consensus mechanism"
                ],
                correctOptionIndex: 1,
                explanation: "A block contains a collection of transactions that are added to the blockchain after validation."
              },
              {
                id: "q3-blockchain-basics",
                question: "What is a hash function used for in blockchain?",
                options: [
                  "To encrypt user passwords",
                  "To create unique identifiers for blocks",
                  "To speed up transactions",
                  "To store user data"
                ],
                correctOptionIndex: 1,
                explanation: "Hash functions create unique fixed-length identifiers for blocks, ensuring data integrity and chain security."
              }
            ]
          }
        ]
      },
      {
        id: "intro-blockchain-history",
        title: "History of Blockchain",
        description: "Explore the origins and evolution of blockchain technology.",
        content: "The concept of blockchain was first introduced in 2008 by a person or group using the pseudonym Satoshi Nakamoto...",
        completed: false,
        xpReward: 25,
        tokenReward: 1,
        quizzes: [
          {
            id: "blockchain-history-quiz",
            title: "Blockchain History Quiz",
            description: "Test your knowledge of blockchain's history",
            completed: false,
            xpReward: 10,
            tokenReward: 1,
            questions: [
              {
                id: "q1-blockchain-history",
                question: "Who created Bitcoin?",
                options: [
                  "Vitalik Buterin",
                  "Satoshi Nakamoto",
                  "Charles Hoskinson",
                  "Gavin Wood"
                ],
                correctOptionIndex: 1,
                explanation: "Bitcoin was created by a person or group using the pseudonym Satoshi Nakamoto, whose real identity remains unknown."
              },
              {
                id: "q2-blockchain-history",
                question: "When was the Bitcoin whitepaper published?",
                options: [
                  "2006",
                  "2008",
                  "2010",
                  "2013"
                ],
                correctOptionIndex: 1,
                explanation: "The Bitcoin whitepaper titled 'Bitcoin: A Peer-to-Peer Electronic Cash System' was published in 2008."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "crypto-wallets",
    title: "Cryptocurrency Wallets",
    description: "Understand different types of wallets and how to secure your assets.",
    level: "beginner",
    xpReward: 150,
    tokenReward: 10,
    completed: false,
    submodules: [
      {
        id: "crypto-wallets-types",
        title: "Types of Wallets",
        description: "Learn about hot wallets, cold wallets, and more.",
        content: "Cryptocurrency wallets come in various forms, each with different security levels and convenience tradeoffs...",
        completed: false,
        xpReward: 50,
        tokenReward: 3,
        quizzes: [
          {
            id: "wallet-types-quiz",
            title: "Wallet Types Quiz",
            description: "Test your knowledge of different wallet types",
            completed: false,
            xpReward: 20,
            tokenReward: 2,
            questions: [
              {
                id: "q1-wallet-types",
                question: "Which wallet type offers the highest security?",
                options: [
                  "Hot wallet",
                  "Mobile wallet",
                  "Cold wallet",
                  "Web wallet"
                ],
                correctOptionIndex: 2,
                explanation: "Cold wallets (hardware wallets) offer the highest security as they're not connected to the internet, protecting from online attacks."
              },
              {
                id: "q2-wallet-types",
                question: "What is a paper wallet?",
                options: [
                  "A wallet made of paper",
                  "A printed record of your keys",
                  "A type of mobile wallet",
                  "A wallet that only works with paper money"
                ],
                correctOptionIndex: 1,
                explanation: "A paper wallet is a physical printout of your public and private keys, often with QR codes for easy scanning."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "smart-contracts",
    title: "Smart Contracts 101",
    description: "Explore how smart contracts work and their real-world applications.",
    level: "intermediate",
    xpReward: 200,
    tokenReward: 15,
    completed: false,
    submodules: [
      {
        id: "smart-contracts-basics",
        title: "Smart Contracts Basics",
        description: "Understand the basics of smart contracts.",
        content: "Smart contracts are self-executing contracts with the terms of the agreement directly written into code...",
        completed: false,
        xpReward: 40,
        tokenReward: 3,
        quizzes: [
          {
            id: "smart-contracts-basics-quiz",
            title: "Smart Contracts Basics Quiz",
            description: "Test your understanding of smart contracts",
            completed: false,
            xpReward: 15,
            tokenReward: 1,
            questions: [
              {
                id: "q1-smart-contracts-basics",
                question: "What is a smart contract?",
                options: [
                  "A decentralized application",
                  "A self-executing contract",
                  "A traditional contract",
                  "A legal document"
                ],
                correctOptionIndex: 1,
                explanation: "A smart contract is a self-executing contract with the terms of the agreement directly written into code."
              },
              {
                id: "q2-smart-contracts-basics",
                question: "What is the purpose of a smart contract?",
                options: [
                  "To automate transactions",
                  "To enforce agreements",
                  "To create new assets",
                  "To store data"
                ],
                correctOptionIndex: 2,
                explanation: "The purpose of a smart contract is to automate transactions, enforce agreements, and create new assets."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "defi-basics",
    title: "DeFi Fundamentals",
    description: "Discover the world of decentralized finance and its core concepts.",
    level: "intermediate",
    xpReward: 250,
    tokenReward: 20,
    completed: false,
    submodules: [
      {
        id: "defi-basics-basics",
        title: "DeFi Basics",
        description: "Understand the basics of decentralized finance.",
        content: "Decentralized finance (DeFi) is a financial system that operates without a central authority...",
        completed: false,
        xpReward: 50,
        tokenReward: 3,
        quizzes: [
          {
            id: "defi-basics-quiz",
            title: "DeFi Basics Quiz",
            description: "Test your understanding of DeFi",
            completed: false,
            xpReward: 15,
            tokenReward: 1,
            questions: [
              {
                id: "q1-defi-basics",
                question: "What is decentralized finance?",
                options: [
                  "A traditional financial system",
                  "A financial system that operates without a central authority",
                  "A financial system that is controlled by a single entity",
                  "A financial system that is regulated by the government"
                ],
                correctOptionIndex: 1,
                explanation: "Decentralized finance (DeFi) is a financial system that operates without a central authority."
              },
              {
                id: "q2-defi-basics",
                question: "What is a decentralized exchange?",
                options: [
                  "A traditional exchange",
                  "A financial system that operates without a central authority",
                  "A financial system that is controlled by a single entity",
                  "A financial system that is regulated by the government"
                ],
                correctOptionIndex: 1,
                explanation: "A decentralized exchange is a financial system that operates without a central authority."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "nft-creation",
    title: "Creating NFTs",
    description: "Learn how to mint and trade non-fungible tokens on EduChain.",
    level: "advanced",
    xpReward: 300,
    tokenReward: 25,
    completed: false,
    submodules: [
      {
        id: "nft-creation-basics",
        title: "NFT Creation Basics",
        description: "Understand the basics of NFT creation.",
        content: "Non-fungible tokens (NFTs) are unique digital assets that cannot be replicated...",
        completed: false,
        xpReward: 60,
        tokenReward: 4,
        quizzes: [
          {
            id: "nft-creation-basics-quiz",
            title: "NFT Creation Basics Quiz",
            description: "Test your understanding of NFT creation",
            completed: false,
            xpReward: 15,
            tokenReward: 1,
            questions: [
              {
                id: "q1-nft-creation-basics",
                question: "What is an NFT?",
                options: [
                  "A traditional asset",
                  "A unique digital asset",
                  "A digital asset that can be replicated",
                  "A digital asset that is not unique"
                ],
                correctOptionIndex: 1,
                explanation: "An NFT is a unique digital asset that cannot be replicated."
              },
              {
                id: "q2-nft-creation-basics",
                question: "What is the purpose of an NFT?",
                options: [
                  "To store data",
                  "To create new assets",
                  "To automate transactions",
                  "To enforce agreements"
                ],
                correctOptionIndex: 2,
                explanation: "The purpose of an NFT is to create new assets."
              }
            ]
          }
        ]
      }
    ]
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
  completedSubmodules: [],
  completedQuizzes: [],
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

// Get submodule by ID
export const getSubmoduleById = async (moduleId: string, submoduleId: string): Promise<Submodule | undefined> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const module = mockModules.find((module) => module.id === moduleId);
  return module?.submodules.find((submodule) => submodule.id === submoduleId);
};

// Get quiz by ID
export const getQuizById = async (moduleId: string, submoduleId: string, quizId: string): Promise<Quiz | undefined> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const module = mockModules.find((module) => module.id === moduleId);
  const submodule = module?.submodules.find((submodule) => submodule.id === submoduleId);
  return submodule?.quizzes.find((quiz) => quiz.id === quizId);
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
    completedSubmodules: [],
    completedQuizzes: [],
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

// Complete a submodule and receive rewards
export const completeSubmodule = async (address: string, moduleId: string, submoduleId: string): Promise<{
  success: boolean;
  txHash?: string;
  reward?: {
    xp: number;
    tokens: number;
    newBadge?: Badge;
  };
}> => {
  // Simulate blockchain transaction delay
  await new Promise((resolve) => setTimeout(resolve, 1200));
  
  const module = mockModules.find((m) => m.id === moduleId);
  if (!module) return { success: false };
  
  const submodule = module.submodules.find((s) => s.id === submoduleId);
  if (!submodule) return { success: false };
  
  // Update user progress
  if (!userProgress.completedSubmodules.includes(submoduleId)) {
    userProgress.completedSubmodules.push(submoduleId);
    userProgress.totalXP += submodule.xpReward;
    userProgress.tokenBalance += submodule.tokenReward;
    
    // Calculate new level (1 level per 250 XP)
    userProgress.level = Math.max(1, Math.floor(userProgress.totalXP / 250) + 1);
    
    // Update submodule status
    const moduleIndex = mockModules.findIndex(m => m.id === moduleId);
    if (moduleIndex !== -1) {
      const submoduleIndex = mockModules[moduleIndex].submodules.findIndex(s => s.id === submoduleId);
      if (submoduleIndex !== -1) {
        mockModules[moduleIndex].submodules[submoduleIndex].completed = true;
      }
    }
    
    // Check if all submodules are completed for this module
    const allSubmodulesCompleted = module.submodules.every(submodule => 
      userProgress.completedSubmodules.includes(submodule.id)
    );
    
    // If all submodules completed, also mark the module as completed
    if (allSubmodulesCompleted && !userProgress.completedModules.includes(moduleId)) {
      return await completeModule(address, moduleId);
    }
    
    return {
      success: true,
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      reward: {
        xp: submodule.xpReward,
        tokens: submodule.tokenReward,
      },
    };
  }
  
  // Submodule already completed
  return { success: false };
};

// Complete a quiz and receive rewards
export const completeQuiz = async (
  address: string, 
  moduleId: string, 
  submoduleId: string, 
  quizId: string,
  userAnswers: number[]
): Promise<{
  success: boolean;
  txHash?: string;
  answers?: {
    correct: boolean[];
    score: number;
    totalQuestions: number;
  };
  reward?: {
    xp: number;
    tokens: number;
    newBadge?: Badge;
  };
}> => {
  // Simulate blockchain transaction delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  const module = mockModules.find((m) => m.id === moduleId);
  if (!module) return { success: false };
  
  const submodule = module.submodules.find((s) => s.id === submoduleId);
  if (!submodule) return { success: false };
  
  const quiz = submodule.quizzes.find((q) => q.id === quizId);
  if (!quiz) return { success: false };
  
  // If quiz is already completed, return false
  if (userProgress.completedQuizzes.includes(quizId)) {
    return { 
      success: false,
      answers: {
        correct: quiz.questions.map((_, i) => userAnswers[i] === quiz.questions[i].correctOptionIndex),
        score: quiz.questions.filter((q, i) => userAnswers[i] === q.correctOptionIndex).length,
        totalQuestions: quiz.questions.length
      }
    };
  }
  
  // Check answers
  const correctAnswers = quiz.questions.map((q, i) => userAnswers[i] === q.correctOptionIndex);
  const score = correctAnswers.filter(Boolean).length;
  const passingScore = Math.ceil(quiz.questions.length * 0.7); // 70% to pass
  
  // Only reward if passing score achieved
  if (score >= passingScore) {
    userProgress.completedQuizzes.push(quizId);
    userProgress.totalXP += quiz.xpReward;
    userProgress.tokenBalance += quiz.tokenReward;
    
    // Calculate new level (1 level per 250 XP)
    userProgress.level = Math.max(1, Math.floor(userProgress.totalXP / 250) + 1);
    
    // Update quiz status
    const moduleIndex = mockModules.findIndex(m => m.id === moduleId);
    if (moduleIndex !== -1) {
      const submoduleIndex = mockModules[moduleIndex].submodules.findIndex(s => s.id === submoduleId);
      if (submoduleIndex !== -1) {
        const quizIndex = mockModules[moduleIndex].submodules[submoduleIndex].quizzes.findIndex(q => q.id === quizId);
        if (quizIndex !== -1) {
          mockModules[moduleIndex].submodules[submoduleIndex].quizzes[quizIndex].completed = true;
        }
      }
    }
    
    // If all quizzes are completed for this submodule, also mark the submodule as completed
    const allQuizzesCompleted = submodule.quizzes.every(quiz => 
      userProgress.completedQuizzes.includes(quiz.id)
    );
    
    if (allQuizzesCompleted && !userProgress.completedSubmodules.includes(submoduleId)) {
      return await completeSubmodule(address, moduleId, submoduleId);
    }
    
    return {
      success: true,
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      answers: {
        correct: correctAnswers,
        score,
        totalQuestions: quiz.questions.length
      },
      reward: {
        xp: quiz.xpReward,
        tokens: quiz.tokenReward,
      },
    };
  }
  
  // Failed the quiz, return answers but no rewards
  return {
    success: false,
    answers: {
      correct: correctAnswers,
      score,
      totalQuestions: quiz.questions.length
    }
  };
};
