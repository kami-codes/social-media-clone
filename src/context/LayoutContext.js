import { createContext, useState } from "react";

export const LayoutContext = createContext()

export const LayoutContextProvider = ({children})=>{

    const [addPostOpen, setAddPostOpen] = useState(false)
    const [followersOpen, setFollowersOpen] = useState(false);
    const [followingOpen, setFollowingOpen] = useState(false);

    return(
        <LayoutContext.Provider value={{addPostOpen, setAddPostOpen,followersOpen,setFollowersOpen,followingOpen,setFollowingOpen}}>
            {children}
        </LayoutContext.Provider>
    )
}