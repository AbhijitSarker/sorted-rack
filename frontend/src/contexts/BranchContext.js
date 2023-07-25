import { createContext, useState } from 'react';

const BranchContext = createContext("");

export const BranchProvider = ({ children }) => {
    const [branch, setBranch] = useState("All");
    return(
        <BranchContext.Provider value={{branch, setBranch}}>
            {children}
        </BranchContext.Provider>
    )
}
export default BranchContext;