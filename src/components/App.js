import React, { Component } from "react";
import './App.css';
import { connect } from "react-redux";
import PropTypes from 'prop-types'
import { withTranslation } from "react-i18next";
import config from '../../configs/config.json'
import Header from '@components/Header/Header'
import Login from "@components/Login/Login"
import Menu from "@components/Menu/Menu"
import Composition from "@components/Composition/Composition"
import Notifications from "@components/Notifications/Notifications"
import {readString} from "react-papaparse"
import steps from '../../configs/pages.csv'
import { doSetSteps } from "@reducers/stagesActions";

export default withTranslation()(connect(
  (store) => ({
    location: store.router.location.pathname
  }),
  (dispatch) => ({
    setSteps: (steps) => doSetSteps(dispatch, steps)
  })
)(class App extends Component {
  
  static propTypes = {
    location: PropTypes.string.isRequired,
  }
  
  routes = [
    ['^/$', () => <Login/>],
    ['^/menu', () => <Menu/>],
    ['^/composition', () => <Composition/>],
  ]
  
  constructor(props) {
    super(props)
  }
  
  componentDidMount() {
    if (!config.use_dev_steps){
      this.props.setSteps(steps)
    }
  }
  
  route = path => this.routes.find(r => path.match(r[0]) !== null)?.[1]?.()
  render() {
    const { t } = this.props
    return (
      <div>
        <Header />
        {this.route(this.props.location)}
        <Notifications/>
      </div>
    );
  }
}))

