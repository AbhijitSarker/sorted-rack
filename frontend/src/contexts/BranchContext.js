import { createContext, useState } from 'react';

const BranchContext = createContext("");

export const BranchProvider = ({ children }) => {
    const userLocation = localStorage.userDetails ? JSON.parse(localStorage.getItem("userDetails")).branch : "All";
    
    const [branch, setBranch] = useState(userLocation);
    return(
        <BranchContext.Provider value={{branch, setBranch}}>
            {children}
        </BranchContext.Provider>
    )
}
export default BranchContext;