import React, { createContext, useState, useContext } from "react";

const CurrentId = createContext();

const IDProvider = ({ children }) => {
  const [id, setId] = useState("");

  return (
    <CurrentId.Provider value={{ id, setId }}>{children}</CurrentId.Provider>
  );
};

const useID = () => useContext(CurrentId);

export { IDProvider, useID };
