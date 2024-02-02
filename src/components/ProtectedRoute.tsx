import { PropsWithChildren, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from './AuthProvider';

type ProtectedRouteProps = PropsWithChildren;

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {

        const loadauth = async () => {
            const data = await localStorage.getItem("auth");


            console.log("data at local storage", data);
            if (data) {
                const parseData = JSON.parse(data);

                // Update the state, and use the callback function of setAuth
                setAuth(prevAuth => ({
                    ...prevAuth,
                    user: parseData.user,
                    token: parseData.token,
                }));

            } else {
                console.log("at procted route else")
                if (auth.user === null) {
                    navigate('/signup', { replace: true });
                }
            }
        }


        loadauth();



    }, [auth]);



    return children;
}
