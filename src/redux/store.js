import {combineReducers, createStore} from "redux"
import productParametersReducer from "./reducers/Geoscan/productParametersReducer"
import endoStarsReducer from "./reducers/EndoStars/endoStarsReducer";

let reducers = combineReducers({
    // productParameters: productParametersReducer,
    endoStars: endoStarsReducer
})


let store = createStore(reducers)

window.store = store

export default store