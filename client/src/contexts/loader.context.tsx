import React, { createContext, useState } from 'react';
import WsManager from '../structures/WsManager';
import { AuthGuard } from '../components';
import { wait } from '../utils';


const LoaderContext = createContext<{ 
    loader: boolean, 
    setLoader: any, // React.Dispatch<React.SetStateAction<boolean>>,
    loaderText: string,
    setLoaderText: React.Dispatch<React.SetStateAction<string>> }
>({ loader: true, setLoader: null as any, loaderText: '', setLoaderText: null as any });


const LoaderProvider = ({ children }: any) => {
    const [loaderActive, setLoaderActive] = useState(true);
    const [loaderText, setLoaderText] = useState('');

    const stopLoader = async() => {
        await wait(1500);
        setLoaderActive(false)
    }

    const startLoader = async() => {
        setLoaderActive(true);
    }

    function setLoaderActiveFn(status: boolean) {
        if (status == true)
                startLoader();
        else
            stopLoader()
    }


    return (
        <LoaderContext.Provider value={{ loader: loaderActive, setLoader: setLoaderActiveFn, loaderText, setLoaderText }}>
            <AuthGuard>
                {children}
            </AuthGuard>
        </LoaderContext.Provider>
    )
}

export default LoaderProvider;
export { LoaderContext };

