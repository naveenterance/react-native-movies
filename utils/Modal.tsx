import React, { createContext, useState, useContext, ReactNode } from "react";

interface ModalContextType {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const modalVisibility = createContext<ModalContextType | undefined>(undefined);

const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modalVisible, setModalVisible] = useState(false); // Changed initial state to false

  return (
    <modalVisibility.Provider value={{ modalVisible, setModalVisible }}>
      {children}
    </modalVisibility.Provider>
  );
};

const useModal = (): ModalContextType => {
  const context = useContext(modalVisibility);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

export { ModalProvider, useModal };
