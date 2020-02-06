import { ENTER_SERVER } from './types';

export const EnterServer = (text) => {
    return {
        type: ENTER_SERVER,
        payload: text
    }
}