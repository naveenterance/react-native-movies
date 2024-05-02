import React, { createContext, useState, useContext, ReactNode } from "react";

interface IDContextType {
  id: string;
  setId: React.Dispatch<React.SetStateAction<string>>;
}

const CurrentId = createContext<IDContextType | undefined>(undefined);

const IDProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [id, setId] = useState("");

  return (
    <CurrentId.Provider value={{ id, setId }}>{children}</CurrentId.Provider>
  );
};

const useID = (): IDContextType => {
  const context = useContext(CurrentId);
  if (!context) {
    throw new Error("useID must be used within a IDProvider");
  }
  return context;
};

export { IDProvider, useID };
