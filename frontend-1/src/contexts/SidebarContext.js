import { useState, createContext } from "react";

export const SidebarContext = createContext();

function SidebarContextProvider(props) {
  const [activeMenu, setActiveMenu] = useState(false);

  return (
    <SidebarContext.Provider value={{ activeMenu, setActiveMenu }}>
      {props.children}
    </SidebarContext.Provider>
  )
}

export default SidebarContextProvider;