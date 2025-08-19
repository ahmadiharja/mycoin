"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface ContractAddressContextType {
  contractAddress: string;
  setContractAddress: (addr: string) => void;
}

const ContractAddressContext = createContext<ContractAddressContextType | undefined>(undefined);

export const ContractAddressProvider = ({ children }: { children: ReactNode }) => {
  const [contractAddress, setContractAddressState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch contract address from API on mount
  React.useEffect(() => {
    fetch("/api/contract-address")
      .then((res) => res.json())
      .then((data) => {
        setContractAddressState(data.contractAddress);
        setLoading(false);
      })
      .catch(() => {
        setContractAddressState("GQsefQc5YPEI2wkMnYMxD8RqIwrRX7f9iFgpBjNpBAGS");
        setLoading(false);
      });
  }, []);

  // Setter that updates API and state
  const setContractAddress = (addr: string) => {
    setContractAddressState(addr);
    fetch("/api/contract-address", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contractAddress: addr }),
    });
  };

  if (loading || contractAddress == null) {
    return null;
  }

  return (
    <ContractAddressContext.Provider value={{ contractAddress, setContractAddress }}>
      {children}
    </ContractAddressContext.Provider>
  );
};

export function useContractAddress() {
  const context = useContext(ContractAddressContext);
  if (!context) throw new Error("useContractAddress must be used within a ContractAddressProvider");
  return context;
}
