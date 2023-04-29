import React, { useState, useEffect, useContext } from 'react';
import { FireBaseContext } from '../../contexts/firebase.context';
import Loader from '../Loader/Loader';
import { useNavigate } from 'react-router-dom';
import { LoaderContext } from '../../contexts/loader.context';



function AuthGuard({ children }: any) {
    const authContext = useContext(FireBaseContext);
    const loaderContext = useContext(LoaderContext);

    const [state, setState] = useState(false);
    const user = authContext.user;
    // const navigate = useNavigate();

    useEffect(() => {
        if (user === undefined) return console.log('Auth guard, state changing');

        // navigate(window.location.pathname);
        // loaderContext.setLoader(false)
        // setLoaderActive(false);
        setState(true);
    }, [user]);

    return (
        <Loader active={loaderContext.loader}>
            {state && children}
        </Loader>
    )
}

export default AuthGuard;
