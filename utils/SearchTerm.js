import React, { createContext, useState, useContext } from "react";

const CurrentSearchTerm = createContext();

const SearchTermProvider = ({ children }) => {
  const [searchedUser, setSearchedUser] = useState("");

  return (
    <CurrentSearchTerm.Provider value={{ searchedUser, setSearchedUser }}>
      {children}
    </CurrentSearchTerm.Provider>
  );
};

const useSearchTerm = () => useContext(CurrentSearchTerm);

export { SearchTermProvider, useSearchTerm };
