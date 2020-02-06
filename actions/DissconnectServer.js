import { DISSCONNECT } from './types';

export const DissconnectServer = (value) => {
    return {
        type: DISSCONNECT,
        payload: value
    }
}