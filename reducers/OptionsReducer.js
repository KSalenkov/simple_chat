import { ENTER_SERVER, 
        ENTER_NICKNAME, 
        CHOOSE_THEME, 
        DISSCONNECT,
        DATA_LOADED } from '../actions/types'

const INITIAL_STATE = {
    server: '',
    dissconnect: false,
    nickName: '',
    theme: '',
    dataLoaded: ''
}

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case ENTER_SERVER:
            return {
                ...state,
                server: action.payload
            }
        case ENTER_NICKNAME:
            return {
                ...state,
                nickName: action.payload
            }
        case CHOOSE_THEME:
            return {
                ...state,
                theme: action.payload
            }
        case DISSCONNECT:
            return {
                ...state,
                dissconnect: action.payload
            }
        case DATA_LOADED:
            return {
                ...state,
                dataLoaded: action.payload
            }
        default: return state
    }

    
}