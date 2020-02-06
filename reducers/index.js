import { combineReducers } from 'redux';
import OptionsReducer from './OptionsReducer';

export default combineReducers({
    options: OptionsReducer
})