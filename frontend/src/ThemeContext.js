import { useEffect, createContext, useState } from "react";
import ApiService from "./Api/api";
import io from 'socket.io-client'

export const ThemeContext = createContext({})

const ThemeProvider = ({children}) => {
    const [isHohol, setIsHohol] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [socket, setSocket] = useState(null)
    
    useEffect(()=>{
        if (socket === null) {
            let sock = io(ApiService.endpoint)
            sock.on("hohol", (...args) => {
                console.log("hohol",args)
                setIsHohol(args[0])
            });
            sock.on("isupdating", (...args) => {
                console.log("update",args)
                setIsUpdating(args[0])
            });
            setSocket(sock)
        }
    },[])

    return(
        <ThemeContext.Provider value={{isHohol:isHohol, isUpdating:isUpdating}}>
            {children}
        </ThemeContext.Provider>
    )
}
export default ThemeProvider