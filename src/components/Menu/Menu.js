import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import React from 'react'
import styles from './Menu.module.css'
import { doCreateUnit, doLogout, doRaiseNotification } from "@reducers/stagesActions";
import { push } from "connected-react-router";


export default withTranslation()(connect(
  (store) => ({
    unitID: store.stages.getIn(['unit', 'unit_internal_id'])
  }),
  (dispatch) => ({
    raiseNotification: (notificationMessage) => doRaiseNotification(dispatch, notificationMessage),
    doCreateUnit: () => doCreateUnit(dispatch, (r) => {
      if (r.status === false) {
        this.props.raiseNotification(r.comment)
        return false
      }
      return true
    }, (r) => {
      console.log('error check')
      if (r !== undefined) {
        console.log('raise error?')
        this.props.raiseNotification('Error connecting to server, try again later. (Response code != 200)')
      }
    }),
    doLogout    : (successChecker, errorChecker) => doLogout(dispatch, successChecker, errorChecker)
  })
)(class Menu extends React.Component {
  
  handleCreateUnit = () => {
    this.props.doCreateUnit()
  }
  
  handleUserLogout = () => {
    this.props.doLogout(
      (r) => {
        console.log('if OK')
        console.log(r)
        return true
      }, (r) => {
        console.log('if not oK')
        console.log(r)
      }
    )
  }
  
  render() {
    const { t } = this.props
    return (
      <div className={styles.wrapper}>
        <div className={styles.buttons}>
          <a className={styles.startComposition} onClick={() => {
            this.handleCreateUnit()
            // console.log(this.props.unit)
          }} href="#">
            {t('StartComposition')}
          </a>
        
        </div>
        <div className={styles.buttons}>
          <a className={styles.finishComposition} onClick={() => this.handleUserLogout()} href="#">
            {t('FinishSession')}
          </a>
        </div>
      </div>
    )
  }
}))
