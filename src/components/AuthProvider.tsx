import React, { createContext, PropsWithChildren, useState, useEffect, useContext, Dispatch, SetStateAction } from "react";
import axios from "axios";
import { User } from "../types/User";

interface AuthContextType {
    auth: User;
    setAuth: Dispatch<SetStateAction<User>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: PropsWithChildren) => {
    const [auth, setAuth] = useState<User>({
        user: null,
        token: "",
    });

    // default axios
    axios.defaults.headers.common["Authorization"] = auth?.token;

    useEffect(() => {
        const data = localStorage.getItem("auth");


        // console.log("local storage data", data);
        if (data) {
            const parseData = JSON.parse(data);

            console.log("local storage data", parseData);
            setAuth((prevAuth) => ({

                user: parseData.user,
                token: parseData.token,
            }));
        }
        // eslint-disable-next-line
    }, []);


    const contextValue: AuthContextType = { auth, setAuth };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// custom hook
const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    if (!context?.auth) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export { useAuth, AuthProvider };

