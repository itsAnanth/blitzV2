import { useState, useEffect, useContext } from 'react';
import { FireBaseContext } from '../../contexts/firebase.context';
import Loader from '../Loader/Loader';
import { useNavigate } from 'react-router-dom';


function AuthGuard({ children }: any) {
    const authContext = useContext(FireBaseContext);
    const [loaderActive, setLoaderActive] = useState(true);
    const user = authContext.user;
    const navigate = useNavigate();

    useEffect(() => {
        if (user === undefined) return console.log('Auth guard, state changing');

        // navigate(window.location.pathname);
        setLoaderActive(false);
    }, [user]);

    return (
        <Loader active={loaderActive}>
            {children}
        </Loader>
    )
}

export default AuthGuard;
