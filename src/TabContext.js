// TabContext.js
import { createContext, useContext, useState } from "react";

const TabContext = createContext();

export const useTabContext = () => useContext(TabContext);

export const TabProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState("one");

  const value = {
    activeTab,
    setActiveTab,
  };

  return <TabContext.Provider value={value}>{children}</TabContext.Provider>;
};
