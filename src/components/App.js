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
import { doFetchComposition, doRaiseNotification } from "@reducers/stagesActions";
import GatherComponents from "@components/GatherComponents/GatherComponents";
import RevisionsTracker from "@components/RevisionsTracker/RevisionsTracker";
import { Modal } from "@components/Modal/Modal";
import { push } from "connected-react-router";
import { withSnackbar } from "notistack";

export default withSnackbar(withTranslation()(connect(
  (store) => ({
    location: store.router.location.pathname,
  }),
  (dispatch) => ({
    raiseNotification: (notificationMessage) => doRaiseNotification(dispatch, notificationMessage),
    goToMenu: () => dispatch(push('/menu')),
    goToGatheringComponents: () => dispatch(push('/gatherComponents')),
    goToComposition: () => dispatch(push('/composition')),

    doFetchComposition: (composition) => doFetchComposition(dispatch, composition)
  })
)(class App extends Component {

  static propTypes = {
    location: PropTypes.string.isRequired,

    goToMenu: PropTypes.func.isRequired,
    goToGatheringComponents: PropTypes.func.isRequired,
    goToComposition: PropTypes.func.isRequired,
    doFetchComposition: PropTypes.func.isRequired
  }

  routes = [
    ['^/$', () => <Login/>],
    ['^/menu', () => <Menu/>],
    ['^/composition', () => <Composition/>],
    ['^/gatherComponents', () => <GatherComponents/>]
  ]

  constructor (props) {
    super(props);
  }

  state = {
    eventSource: null,
    reconnectInterval: 10,
    SSEErrorFlag: false,
  }


  isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
  }
  
  debounce(func, wait) {
      let timeout;
      let waitFunc;
      
      return function() {
          if (this.isFunction(wait)) {
              waitFunc = wait;
          }
          else {
              waitFunc = function() { return wait };
          }
          
          let context = this, args = arguments;
          const later = function() {
              timeout = null;
              func.apply(context, args);
          };
          clearTimeout(timeout);
          timeout = setTimeout(later, waitFunc());
      };
  }

  setupSSEConnection () {
    this.eventSource = new EventSource(`${process.env.APPLICATION_SOCKET}/workbench/status/stream`)
    this.eventSource.onmessage = (e) => {
      let res = JSON.parse(e.data)

      this.props.doFetchComposition(res)

      let location = this.props.location.split('/')[1]
      switch(res.state){
        case 'ProductionStageOngoing':
          // console.log("PRODUCTION__ONGOING")
          if(location !== 'composition')
            this.props.goToComposition()
          break;
        case 'GatherComponents':
          // console.log("GATHER__COMPONENTS")
          if(location !== 'gatherComponents')
            this.props.goToGatheringComponents()
          break;
        case 'AwaitLogin':
          // console.log("AWAIT__LOGIN")
          break;
        case 'AuthorizedIdling':
          if(location !== 'menu') {
            this.props.goToMenu();
            console.log('==ROUTER== redirect to menu');
          }
          // console.log("AUTHORIZED__IDLING")
          break;
        case 'UnitAssignedIdling':
          // console.log('UNIT__ASSIGNED__IDLING')
          if(location !== 'composition')
            this.props.goToComposition()
          break;
        default:
          break;
      }

    }
    this.eventSource.onerror = (e) => {
      this.setState({SSEErrorFlag: true});
      this.props.enqueueSnackbar(`Соединение с сервером не может быть установлено. Попытка повторного подключения через ${this.state.reconnectInterval} секунд`, {variant: "error"});
      this.eventSource.close();
      this.reconnectSSE()
    }
    this.eventSource.onopen = (e) => {
      if(this.state.SSEErrorFlag) {
        this.props.enqueueSnackbar('Соединение с сервером восстановлено', { variant: 'success' });
      } else {
        this.props.enqueueSnackbar('Соединение с сервером установлено', { variant: 'success' });
      }
    }
  }

  reconnectSSE = this.debounce(function (){
    this.setupSSEConnection();
  }, () => {
      return this.state.reconnectInterval * 1000;
  }) 
  // 

  componentDidMount() {
    this.setupSSEConnection();
  }

  route = path => this.routes.find(r => path.match(r[0]) !== null)?.[1]?.()

  render () {
    return (
      <>
        <Modal/>
        <div className={styles.appWrapper} style={{paddingBottom: "50px"}}>
        <div className={styles.header}>
          <Header />
        </div>
        <div className={styles.pageWrapper}>
          {this.route(this.props.location)}
        </div>
        <div className={styles.NotificationsWrapper}>
          <Notifications/>
          {this.props.location !== '/' && (<RevisionsTracker/>)}
        </div>
      </div>

      </>
    );
  }
})))
