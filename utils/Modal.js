import React, { createContext, useState, useContext } from "react";

const modalVisibility = createContext();

const ModalProvider = ({ children }) => {
  const [modalVisible, setModalVisible] = useState(false); // Changed initial state to false

  return (
    <modalVisibility.Provider value={{ modalVisible, setModalVisible }}>
      {children}
    </modalVisibility.Provider>
  );
};

const useModal = () => useContext(modalVisibility);

export { ModalProvider, useModal };
