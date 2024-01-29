export function setPersistence(val: boolean): void {
    localStorage.setItem('rememberme', String(val));
}

export function getPersistence() {
    return Boolean(localStorage.getItem('rememberme') ? localStorage.getItem('rememberme') : 'false')
}