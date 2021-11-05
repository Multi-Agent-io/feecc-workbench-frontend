import React from "react";
import ReactDOM, { render } from "react-dom";
import App from "./components/App.js";
import { Provider } from "react-redux";
import store, { history } from './reducers/main'
import $ from 'jquery'
import './index.scss'
import { ConnectedRouter } from "connected-react-router";
import './i18n'
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: '#17183B',
    },
    secondary: {
      main: '#FF6B35'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          width: '100%',
          borderRadius: '15px',
          minHeight: '60px',
          fontSize: '16pt',
          minWidth: '300px',
          maxWidth: '300px'
        }
      }
    },
  }
})


const build = () => render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ConnectedRouter history={history}>
          <App/>
        </ConnectedRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
)

$(window).on('load', build)

