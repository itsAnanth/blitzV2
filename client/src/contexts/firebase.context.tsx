import { createContext, useState, useEffect, useContext } from 'react';
import firebaseInit from '../structures/Firebase';
import firebase from 'firebase/app';
import { browserLocalPersistence, getAuth, inMemoryPersistence, User } from 'firebase/auth';
import { WebSocketContext } from './websocket.context';

const FireBaseContext = createContext<{ app: firebase.FirebaseApp, user: User | null | undefined }>(null as any);


const FireBaseProvider = ({ children }: any) => {
    const wsm = useContext(WebSocketContext);
    const [firebaseUser, setFirebaseUser] = useState<User | null | undefined>(undefined)
    const app = firebaseInit();

    useEffect(() => {
        console.log(firebaseUser);
        const auth = getAuth(app);
        auth.setPersistence(inMemoryPersistence)
        const unsub = auth.onAuthStateChanged((user) => {
            console.log('state change', user);
            setFirebaseUser(user);
            wsm.dispatchEvent(new CustomEvent('LOGIN_STATE_CHANGE'));
        });
        return unsub;
    }, [])

    return (
        <FireBaseContext.Provider value={{ app: app, user: firebaseUser }}>
            {children}
        </FireBaseContext.Provider>
    )
}

export default FireBaseProvider;
export { FireBaseContext };

