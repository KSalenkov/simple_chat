import { DATA_LOADED } from './types';

export const CheckDataLoaded = (value) => {
    return {
        type: DATA_LOADED,
        payload: value
    }
}