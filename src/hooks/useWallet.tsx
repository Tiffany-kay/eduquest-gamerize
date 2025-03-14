
import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";

// Mock interface for wallet implementation
export interface Wallet {
  address: string | null;
  balance: string | null;
  chainId: number | null;
  connected: boolean;
}

// Default wallet state
const defaultWalletState: Wallet = {
  address: null,
  balance: null,
  chainId: null,
  connected: false,
};

export const useWallet = () => {
  const [wallet, setWallet] = useState<Wallet>(() => {
    // Try to retrieve wallet state from localStorage on initialization
    if (typeof window !== "undefined") {
      const savedWallet = localStorage.getItem("wallet");
      if (savedWallet) {
        try {
          return JSON.parse(savedWallet);
        } catch (e) {
          console.error("Error parsing saved wallet:", e);
        }
      }
    }
    return defaultWalletState;
  });
  
  const [isConnecting, setIsConnecting] = useState(false);

  // Save wallet state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined" && wallet) {
      localStorage.setItem("wallet", JSON.stringify(wallet));
    }
  }, [wallet]);

  // Initialize metamask detection
  useEffect(() => {
    const checkMetaMask = async () => {
      // Check if MetaMask is installed
      if (typeof window.ethereum !== "undefined") {
        console.log("MetaMask is installed!");

        // If we have a saved address but not connected, reconnect automatically
        if (wallet.address && !wallet.connected) {
          try {
            const accounts = await window.ethereum.request({ 
              method: "eth_accounts" 
            });
            
            if (accounts.length > 0 && accounts[0] === wallet.address) {
              // User is still connected with the same account
              const chainId = await window.ethereum.request({ method: "eth_chainId" });
              
              setWallet(prev => ({
                ...prev,
                connected: true,
                chainId: parseInt(chainId, 16)
              }));
            }
          } catch (error) {
            console.error("Error checking accounts:", error);
          }
        }

        // Listen for account changes
        window.ethereum.on("accountsChanged", (accounts: string[]) => {
          if (accounts.length > 0) {
            setWallet(prev => ({
              ...prev,
              address: accounts[0],
              connected: true,
            }));
          } else {
            // User disconnected wallet
            disconnectWallet();
          }
        });

        // Listen for chain changes
        window.ethereum.on("chainChanged", (chainId: string) => {
          setWallet(prev => ({
            ...prev,
            chainId: parseInt(chainId, 16),
          }));
        });
      }
    };

    checkMetaMask();

    return () => {
      // Clean up listeners when component unmounts
      if (typeof window.ethereum !== "undefined") {
        window.ethereum.removeAllListeners();
      }
    };
  }, [wallet.address, wallet.connected]);

  // Connect wallet function
  const connectWallet = useCallback(async () => {
    if (typeof window.ethereum === "undefined") {
      toast({
        title: "MetaMask not detected",
        description: "Please install MetaMask to continue",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsConnecting(true);
      
      // Request account access
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      
      if (accounts.length > 0) {
        // Get chain ID
        const chainId = await window.ethereum.request({ method: "eth_chainId" });
        
        // Get balance
        const balance = await window.ethereum.request({
          method: "eth_getBalance",
          params: [accounts[0], "latest"],
        });
        
        setWallet({
          address: accounts[0],
          balance: parseInt(balance, 16).toString(),
          chainId: parseInt(chainId, 16),
          connected: true,
        });
        
        toast({
          title: "Wallet connected",
          description: "Your wallet has been connected successfully",
        });
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setWallet(defaultWalletState);
    // Clear from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("wallet");
    }
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected",
    });
  }, []);

  return {
    wallet,
    isConnecting,
    connectWallet,
    disconnectWallet,
  };
};

// Add TypeScript interface for window.ethereum
declare global {
  interface Window {
    ethereum: any;
  }
}
