import {combineReducers, createStore} from "redux"
import productParametersReducer from "./reducers/Geoscan/productParametersReducer"
import endoStarsReducer from "./reducers/EndoStars/endoStarsReducer";
import endoReducer from "./reducers/EndoStars/endoReducer";

let reducers = combineReducers({
    // productParameters: productParametersReducer,
    endoStars: endoStarsReducer,
    endoStarsState: endoReducer
})


let store = createStore(reducers)

window.store = store

export default store