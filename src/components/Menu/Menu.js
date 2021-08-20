import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import React from 'react'
import styles from './Menu.module.css'
import { doCreateUnit, doLogout, doRaiseNotification } from "@reducers/stagesActions";
import Button from "@/uikit/Button";
import PropTypes from "prop-types"

export default withTranslation()(connect(
  (store) => ({
    unitID: store.stages.getIn(['unit', 'unit_internal_id'])
  }),
  (dispatch) => ({
    raiseNotification: (notificationMessage) => doRaiseNotification(dispatch, notificationMessage),
    doCreateUnit     : () => doCreateUnit(dispatch, (r) => {
      if (r.status === false) {
        this.props.raiseNotification(r.comment)
        this.setState({ createLoading: false })
        return false
      }
      return true
    }, (r) => {
      if (r !== undefined) {
        this.props.raiseNotification('Error connecting to server, try again later. (Response code != 200)')
        this.setState({ createLoading: false })
      }
    }),
    doLogout         : (successChecker, errorChecker) => doLogout(dispatch, successChecker, errorChecker)
  })
)(class Menu extends React.Component {
  
  static propTypes = {
    unitID           : PropTypes.string,
    
    raiseNotification: PropTypes.func.isRequired,
    doCreateUnit     : PropTypes.func.isRequired,
    doLogout         : PropTypes.func.isRequired
  }
  
  state = {
    createLoading: false,
    logoutLoading: false
  }
  
  handleCreateUnit = () => {
    this.setState({ createLoading: true })
    this.props.doCreateUnit()
  }
  
  handleUserLogout = () => {
    this.setState({ logoutLoading: true })
    this.props.doLogout(
      (r) => {
        this.setState({ logoutLoading: false })
        return true
      }, (r) => {
        this.setState({ logoutLoading: false })
      }
    )
  }
  
  render() {
    const { t } = this.props
    const { createLoading, logoutLoading } = this.state
    return (
      <div className={styles.wrapper}>
        <div className={styles.buttons}>
          <Button
            button
            color="blue1"
            radius="15px"
            onClick={this.handleCreateUnit}
            className={styles.startComposition} loading={createLoading}>{t('StartComposition')}</Button>
        </div>
        <div className={styles.buttons}>
          <Button
            button
            color="red1"
            radius="15px"
            onClick={this.handleUserLogout}
            className={styles.startComposition} loading={logoutLoading}>{t('FinishSession')}</Button>
        </div>
      </div>
    )
  }
}))
