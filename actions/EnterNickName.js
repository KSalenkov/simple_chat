import { ENTER_NICKNAME } from './types';

export const EnterNickName = (text) => {
    return {
        type: ENTER_NICKNAME,
        payload: text
    }
}