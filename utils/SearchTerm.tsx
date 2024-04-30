import React, { createContext, useState, useContext, ReactNode } from "react";

interface SearchTermContextType {
  searchedUser: string;
  setSearchedUser: React.Dispatch<React.SetStateAction<string>>;
}

const CurrentSearchTerm = createContext<SearchTermContextType | undefined>(
  undefined
);

const SearchTermProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [searchedUser, setSearchedUser] = useState("");

  return (
    <CurrentSearchTerm.Provider value={{ searchedUser, setSearchedUser }}>
      {children}
    </CurrentSearchTerm.Provider>
  );
};

const useSearchTerm = (): SearchTermContextType => {
  const context = useContext(CurrentSearchTerm);
  if (!context) {
    throw new Error("useSearchTerm must be used within a SearchTermProvider");
  }
  return context;
};

export { SearchTermProvider, useSearchTerm };
