import React from 'react'
import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import { createBrowserHistory } from 'history'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import {stagesInitialState, stagesReducer} from "./stagesReducer";

export const history = createBrowserHistory()

export default createStore(
    combineReducers({
        stages: stagesReducer,
        router: connectRouter(history)
    }),
    {
        stages: stagesInitialState
    },
    compose(
      applyMiddleware(routerMiddleware(history)),
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
)
