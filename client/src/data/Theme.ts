type Theme = {
    type: 'dark' | 'light';
    primary: string;
    secondary: string;
    tertiary: string;
    bg: string;
    text: string;
    bg50: string;
    tertiary50: string;
    secondary50: string;
}



export const blueThemeLight: Theme = {
    type: 'light',
    primary: '#4e65fa',
    secondary: '#667aff',
    tertiary: '#7386ff',
    bg: '#e6e9ff',
    text: '#000000',
    bg50: '#e6e9ff50',
    tertiary50: '#7386ff50',
    secondary50: '#667aff50'

}

const type = {
    light: {
        blueThemeLight
    }
};

const all = {
    blueThemeLight
}

export { type, all };

export type { Theme };