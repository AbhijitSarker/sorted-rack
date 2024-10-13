// HeaderContext.js
import { createContext, useState } from "react";

export const HeaderContext = createContext();

export function HeaderTextProvider({ children }) {
  const [headerText, setHeaderText] = useState("Dashboard");

  return (
    <HeaderContext.Provider value={{ headerText, setHeaderText }}>
      {children}
    </HeaderContext.Provider>
  );
}