import { createContext, useState, useEffect, useContext } from 'react';
import { app as FirebaseApp, db as FirebaseDB } from '../structures/Firebase';
// import firebaseInit from '../structures/Firebase';
import firebase from 'firebase/app';
import { browserLocalPersistence, getAuth, inMemoryPersistence, User } from 'firebase/auth';
import { WebSocketContext } from './websocket.context';
import { getPersistence } from '../utils';
import { PersistenceType } from '../utils/setPersistence';
import { Firestore } from 'firebase/firestore';

const FireBaseContext = createContext<{ app: firebase.FirebaseApp, user: User | null | undefined, db: Firestore }>(null as any);


const FireBaseProvider = ({ children }: any) => {
    const wsm = useContext(WebSocketContext);
    const [firebaseUser, setFirebaseUser] = useState<User | null | undefined>(undefined)
    const app = FirebaseApp;

    useEffect(() => {
        console.log(firebaseUser);
        const auth = getAuth(app);
        const rememberme = getPersistence();
        console.log("????????????remember", rememberme)
        auth.setPersistence(rememberme === PersistenceType.REMEMBER_USER ? browserLocalPersistence : inMemoryPersistence)
        const unsub = auth.onAuthStateChanged((user) => {
            console.log('state change', user);
            setFirebaseUser(user);
            wsm.dispatchEvent(new CustomEvent('LOGIN_STATE_CHANGE'));
        });
        return unsub;
    }, [])

    return (
        <FireBaseContext.Provider value={{ app: app, user: firebaseUser, db: FirebaseDB }}>
            {children}
        </FireBaseContext.Provider>
    )
}

export default FireBaseProvider;
export { FireBaseContext };

