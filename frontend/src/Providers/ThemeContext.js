import { useEffect, createContext, useState } from "react";
import io from 'socket.io-client'
import ApiService from "../Api/api";

export const ThemeContext = createContext({})

const ThemeProvider = ({children}) => {
    const [isOursUpdating, setIsOursUpdating] = useState(true)
    const [isUpdating, setIsUpdating] = useState(true)
    const [socket, setSocket] = useState(null)
    
    useEffect(()=>{
        if (socket === null) {
            let sock = io(ApiService.endpoint)
            sock.on("isupdatingours", (...args) => {
                console.log("update ours",args)
                setIsOursUpdating(args[0])
            });
            sock.on("isupdating", (...args) => {
                console.log("update",args)
                setIsUpdating(args[0])
            });
            setSocket(sock)
        }
    },[])

    return(
        <ThemeContext.Provider value={{isOursUpdating:isOursUpdating, isUpdating:isUpdating}}>
            {children}
        </ThemeContext.Provider>
    )
}
export default ThemeProvider