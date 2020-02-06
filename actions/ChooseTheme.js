import { CHOOSE_THEME } from './types';

export const ChooseTheme = (theme) => {
    return {
        type: CHOOSE_THEME,
        payload: theme
    }
}