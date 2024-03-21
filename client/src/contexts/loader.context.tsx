import React, { createContext, useState } from 'react';
import WsManager from '../structures/WsManager';
import { AuthGuard } from '../components';


const LoaderContext = createContext<{ 
    loader: boolean, 
    setLoader: React.Dispatch<React.SetStateAction<boolean>>,
    loaderText: string,
    setLoaderText: React.Dispatch<React.SetStateAction<string>> }
>({ loader: true, setLoader: null as any, loaderText: '', setLoaderText: null as any });


const LoaderProvider = ({ children }: any) => {
    const [loaderActive, setLoaderActive] = useState(true);
    const [loaderText, setLoaderText] = useState('');


    return (
        <LoaderContext.Provider value={{ loader: loaderActive, setLoader: setLoaderActive, loaderText, setLoaderText }}>
            <AuthGuard>
                {children}
            </AuthGuard>
        </LoaderContext.Provider>
    )
}

export default LoaderProvider;
export { LoaderContext };

