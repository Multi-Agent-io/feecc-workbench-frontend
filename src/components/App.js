import React, { Component } from "react";
import styles from './App.module.css';
import { connect } from "react-redux";
import PropTypes from 'prop-types'
import { withTranslation } from "react-i18next";
import Header from '@components/Header/Header'
import Login from "@components/Login/Login"
import Menu from "@components/Menu/Menu"
import Composition from "@components/Composition/Composition"
import Notifications from "@components/Notifications/Notifications"
import { doRaiseNotification } from "@reducers/stagesActions";
import GatherComponents from "@components/GatherComponents/GatherComponents";


export default withTranslation()(connect(
  (store) => ({
    location: store.router.location.pathname,
  }),
  (dispatch) => ({
    raiseNotification: (notificationMessage) => doRaiseNotification(dispatch, notificationMessage),
  })
)(class App extends Component {

  static propTypes = {
    location: PropTypes.string.isRequired,
  }

  routes = [
    ['^/$', () => <Login/>],
    ['^/menu', () => <Menu/>],
    ['^/composition', () => <Composition/>],
    ['^/gatherComponents', () => <GatherComponents/>]
  ]

  constructor (props) {
    super(props)
  }

  route = path => this.routes.find(r => path.match(r[0]) !== null)?.[1]?.()

  render () {
    return (
      <div className={styles.appWrapper} style={{paddingBottom: "50px"}}>
        <div className={styles.header}>
          <Header />
        </div>
        <div className={styles.pageWrapper}>
          {this.route(this.props.location)}
        </div>
        <div className={styles.NotificationsWrapper}>
          <Notifications/>
        </div>
      </div>
    );
  }
}))

