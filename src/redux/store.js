import {combineReducers, createStore} from "redux"
import productParametersReducer from "./reducers/productParametersReducer"

let reducers = combineReducers({
    productParameters: productParametersReducer
})


let store = createStore(reducers)

window.store = store

export default store