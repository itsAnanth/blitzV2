import { createContext, useState } from 'react';
import WsManager from '../structures/WsManager';
import { AuthGuard } from '../components';


const LoaderContext = createContext<{ loader: boolean, setLoader: React.Dispatch<React.SetStateAction<boolean>> }>({ loader: true, setLoader: null as any });


const LoaderProvider = ({ children }: any) => {
    const [loaderActive, setLoaderActive] = useState(true);


    return (
        <LoaderContext.Provider value={{ loader: loaderActive, setLoader: setLoaderActive }}>
            <AuthGuard>
                {children}
            </AuthGuard>
        </LoaderContext.Provider>
    )
}

export default LoaderProvider;
export { LoaderContext };

