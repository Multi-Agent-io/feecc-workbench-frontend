import React from 'react'
import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import { createBrowserHistory } from 'history'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import {stagesInitialState, stagesReducer} from "./stagesReducer";

import config from '../../configs/config.json'
import {revisionsInitialState, revisionsReducer} from "@reducers/RevisionsReducer";
import { composeWithDevTools } from "redux-devtools-extension";

export const history = createBrowserHistory()

export default createStore(
    combineReducers({
        stages: stagesReducer,
        revisions: revisionsReducer,
        router: connectRouter(history)
    }),
    {
        stages: stagesInitialState,
        revisions: revisionsInitialState
    },
    config.use_devtools 
    ? composeWithDevTools(applyMiddleware(routerMiddleware(history)))
    : compose(applyMiddleware(routerMiddleware(history)))
)
