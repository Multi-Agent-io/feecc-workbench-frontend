import React from "react";
import ReactDOM, { render } from "react-dom";
import App from "./components/App.js";
import {Provider} from "react-redux";
import store, { history } from './reducers/main'
import $ from 'jquery'
import './index.scss'
import { ConnectedRouter } from "connected-react-router";
import './i18n'

const build = () => render(
  <React.StrictMode>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
)

$(window).on('load', build)

