import AccountManager from "../structures/AccountManager";

export function setPersistence(val: PersistenceType): void {
    localStorage.setItem('rememberme', String(val));
    AccountManager.setPersistence(val)
}

export function getPersistence() {
    let storage = localStorage.getItem('rememberme');
    let value = storage ? parseInt(storage) : PersistenceType.FORGET_USER;
    return value;
}

enum PersistenceType {
    REMEMBER_USER,
    FORGET_USER
}

export { PersistenceType };