import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, updateProfile, browserLocalPersistence, inMemoryPersistence, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import type { Auth, UserCredential } from 'firebase/auth';
import { PersistenceType } from '../utils/setPersistence';
import { usersDb } from '../../../database';
import { LandingTypes } from '../utils/LandingTypes';

class AccountManager {

    static setPersistence(val: PersistenceType) {
        const auth = getAuth();

        auth.setPersistence(val === PersistenceType.REMEMBER_USER ? browserLocalPersistence : inMemoryPersistence)
    }

    static async update(username: string) {
        const auth: Auth = getAuth();

        const user = auth.currentUser;

        if (!user) return console.log('Auth user update error, not signed in');

        try {
            await updateProfile(user, { displayName: username });
        } catch (e) {
            console.log('Auth user update error');
            console.log(e);
            // @ts-ignore
            return e.code;
        }

        return true;
    }


    static async signUpWithGoogle(type: LandingTypes) {
        const provider = new GoogleAuthProvider();
        const auth = getAuth();
        let result: UserCredential;
        try {
            result = await signInWithPopup(auth, provider);
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            // const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // IdP data available using getAdditionalUserInfo(result)
            // ...
            if (!auth.currentUser) return { error: true, detail: 'error' };

            // await updateProfile(auth.currentUser, { displayName: user.displayName });
            type === LandingTypes.SIGNUP && await usersDb.setUser(auth.currentUser);

        } catch (error: any) {                // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...

            console.log('Google Auth signup error');
            console.log(error);
            return { error: true, detail: (error as any).code };
        };

        // @ts-ignore
        const user = result.user;

        return { error: false, detail: user };

    }


    static async signUp(username: string, email: string, password: string) {

        const auth: Auth = getAuth();
        let result;
        try {
            result = await createUserWithEmailAndPassword(auth, email, password);

            if (!auth.currentUser) return { error: true, detail: 'error' };
            await updateProfile(auth.currentUser, { displayName: username });
            await usersDb.setUser(auth.currentUser);

        } catch (e) {
            console.log('Auth signup error');
            console.log(e);
            return { error: true, detail: (e as any).code };
        }



        const user = result.user;

        return { error: false, detail: user };
    }


    static async signIn(email: string, password: string) {

        const auth: Auth = getAuth();
        let result;
        try {
            result = await signInWithEmailAndPassword(auth, email, password);
        } catch (e) {
            console.log('Auth signin error');
            console.log();

            return { error: true, detail: (e as any).code };
        }

        const user = result.user;

        return { error: false, detail: user };
    }

    static async signOut() {
        console.log("signout called")
        const auth: Auth = getAuth();
        try {
            await signOut(auth);
        } catch (e) {
            console.log('Auth signout error');
            console.log(e);
        }
    }

}



export default AccountManager;