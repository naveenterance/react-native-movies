// Auth.js
import React, { createContext, useState, useEffect, useContext } from "react";

const CurrentId = createContext();

const IDProvider = ({ children }) => {
  const [id, setId] = useState("");

  return <CurrentId.Provider value={{ id }}>{children}</CurrentId.Provider>;
};

const useID = () => useContext(CurrentId);

export { IDProvider, useID };
