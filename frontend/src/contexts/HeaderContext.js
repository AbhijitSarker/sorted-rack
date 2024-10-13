import { useState, createContext } from "react";

export const HeaderContext = createContext();

function HeaderTextProvider({ children }) {
  const [headerText, setHeaderText] = useState("Dashboard");

  return <HeaderContext.Provider value={{ headerText, setHeaderText }}>{children}</HeaderContext.Provider>;
}

export default HeaderTextProvider;
