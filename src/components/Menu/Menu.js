import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import React from 'react'
import styles from './Menu.module.css'
import { doCreateUnit, doLogout, doRaiseNotification, doSetSteps } from "@reducers/stagesActions";
import Button from "@/uikit/Button";
import PropTypes from "prop-types"
import config from '../../../configs/config.json'
import steps_unit_1 from '@steps/pages_unit_1.csv'
import steps_unit_2 from '@steps/pages_unit_2.csv'

export default withTranslation()(connect(
  (store) => ({
    unitID: store.stages.getIn(['unit', 'unit_internal_id'])
  }),
  (dispatch) => ({
    raiseNotification: (notificationMessage) => doRaiseNotification(dispatch, notificationMessage),
    doCreateUnit     : (unit_type) => doCreateUnit(dispatch, unit_type, (r) => {
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
    doLogout         : (successChecker, errorChecker) => doLogout(dispatch, successChecker, errorChecker),
    setSteps         : (steps) => doSetSteps(dispatch, steps)
  })
)(class Menu extends React.Component {
  
  static propTypes = {
    unitID           : PropTypes.string,
    raiseNotification: PropTypes.func.isRequired,
    doCreateUnit     : PropTypes.func.isRequired,
    doLogout         : PropTypes.func.isRequired
  }
  
  state = {
    createLoading_1   : false,
    createLoading_2   : false,
    logoutLoading     : false,
    chooseVariantModal: false
  }
  
  handleCreateUnit = (unitType) => {
    if (unitType === config.unit_type_1) {
      this.props.setSteps(steps_unit_1)
      this.setState({ createLoading_1: true })
    }
    if (unitType === config.unit_type_2) {
      this.props.setSteps(steps_unit_2)
      this.setState({ createLoading_2: true })
    }
    
    this.props.doCreateUnit(unitType)
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
    const { createLoading_1, createLoading_2, logoutLoading, chooseVariantModal } = this.state
    return (
      <div className={styles.wrapper}>
        {!chooseVariantModal ? (
            <div>
              <div className={styles.buttons}>
                <Button
                  button
                  color="#20639B"
                  radius="15px"
                  onClick={() => this.setState({ chooseVariantModal: true })}
                  className={styles.startComposition} loading={createLoading_1}>{t('StartComposition')}</Button>
              </div>
              <div className={styles.buttons}>
                <Button
                  button
                  color="#ED553B"
                  radius="15px"
                  onClick={this.handleUserLogout}
                  className={styles.startComposition} loading={logoutLoading}>{t('FinishSession')}</Button>
              </div>
            </div>
          ) :
          <div>
            <div className={styles.header}>{t('SpecifyCompositionType')}</div>
            <div className={styles.buttons}>
              <Button
                button
                color="#20639B"
                radius="15px"
                onClick={() => this.handleCreateUnit(config.unit_type_1)}
                className={styles.chooseOptions} loading={createLoading_1}>{config.unit_type_1}</Button>
            </div>
            <div className={styles.buttons}>
              <Button
                button
                color="#20639B"
                radius="15px"
                onClick={() => this.handleCreateUnit(config.unit_type_2)}
                className={styles.chooseOptions} loading={createLoading_2}>{config.unit_type_2}</Button>
            </div>
            <div className={styles.buttons}>
              <Button
                button
                color="#ED553B"
                radius="15px"
                onClick={() => this.setState({ chooseVariantModal: false })}
                className={styles.startComposition} loading={logoutLoading}>{t('Back')}</Button>
            </div>
          </div>
        }
      </div>
    )
  }
}))
