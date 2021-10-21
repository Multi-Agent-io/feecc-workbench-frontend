import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import React from 'react'
import styles from './Menu.module.css'
import {
  doAssignUnit,
  doCreateUnit, doGetSchema,
  doGetSchemasNames,
  doLogout,
  doRaiseNotification,
  doSetSteps
} from "@reducers/stagesActions";
import Button from "@/uikit/Button";
import PropTypes from "prop-types"
import config from '../../../configs/config.json'
import { push } from "connected-react-router";

export default withTranslation()(connect(
  (store) => ({
    unitID: store.stages.getIn(['unit', 'unit_internal_id']),
    schemas: store.stages.get('productionSchemas').toJS(),
    authorized: store.stages.getIn(['composition', 'employee_logged_in']),
  }),
  (dispatch) => ({
    raiseNotification: (notificationMessage) => doRaiseNotification(dispatch, notificationMessage),
    createUnit: (schemaID, successChecker, errorChecker) => doCreateUnit(dispatch, schemaID, successChecker, errorChecker),
    doAssignUnit: (unit_id, successChecker, errorChecker) => doAssignUnit(dispatch, unit_id, successChecker, errorChecker),
    doGetSchemasNames: (successChecker, errorChecker) => doGetSchemasNames(dispatch, successChecker, errorChecker),
    doGetSchema: (schemaId, successChecker, errorChecker) => doGetSchema(dispatch, schemaId, successChecker, errorChecker),
    doLogout: (successChecker, errorChecker) => doLogout(dispatch, successChecker, errorChecker),
    doRedirectToComposition: () => dispatch(push('/composition')),

    setSteps: (steps) => doSetSteps(dispatch, steps)
  })
)(class Menu extends React.Component {

  static propTypes = {
    authorized: PropTypes.bool,
    unitID: PropTypes.string,
    raiseNotification: PropTypes.func.isRequired,
    doCreateUnit: PropTypes.func.isRequired,
    doLogout: PropTypes.func.isRequired
  }

  state = {
    createLoading_1: false,
    createLoading_2: false,
    logoutLoading: false,
    chooseVariantModal: false,
    loading: []
  }

  componentDidMount () {
    // Get all schemas list with their names
    this.props.doGetSchemasNames(
      (res) => {
        if (res.status_code === 200) {
          if (res.available_schemas.length === 0 && this.props.authorized) {
            this.props.raiseNotification('Внимание! Доступно 0 сборок. Свяжитесь с администратором системы для добавления необходимых сборок в базу.')
          }
          return true
        } else {
          return false
        }
      }, null)
  }

  handleCreateUnit = (item, index) => {
    this.props.setSteps(item.pages)
    let arr    = this.state.loading
    arr[index] = true
    this.setState({loading: arr})
    this.props.doGetSchema(
      item.schema_id,
      (res) => {
        if (res.status_code === 200) {
          let schema = res.production_schema
          this.props.createUnit(
            item.schema_id,
            (r) => {
              this.props.doAssignUnit(
                r.unit_internal_id,
                (r) => {
                  if (r.status_code === 200) {
                    if (schema?.required_components_schema_ids === null) {
                      this.props.doRedirectToComposition()
                    } else {
                      console.log('complex redirect')
                    }
                    let arr    = this.state.loading
                    arr[index] = false
                    this.setState({loading: arr})

                    return true
                  } else {
                    let arr    = this.state.loading
                    arr[index] = false
                    this.setState({loading: arr})

                    return false
                  }
                }, null)
              return true
            }, null)

          return true
        } else {
          this.props.raiseNotification('Ошибка при получении схем сборки. Попробуйте перезагрузить страницу.')

          let arr    = this.state.loading
          arr[index] = false
          this.setState({loading: arr})

          return false
        }
      }, null)
  }

  handleUserLogout = () => {
    this.setState({logoutLoading: true})
    this.props.doLogout(
      (r) => {
        this.setState({logoutLoading: false})
        return true
      }, (r) => {
        this.setState({logoutLoading: false})
      }
    )
  }

  render () {
    const {t, schemas}                                                  = this.props
    const {createLoading_1, loading, logoutLoading, chooseVariantModal} = this.state
    return (
      <div className={styles.wrapper}>
        {!chooseVariantModal ? (
            <div>
              <div className={styles.buttons}>
                <Button
                  button
                  color="#20639B"
                  radius="15px"
                  onClick={() => this.setState({chooseVariantModal: true})}
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
            {schemas?.map((item, index) => {
              return (
                <div key={item.schema_id} className={styles.buttons}>
                  <Button
                    button
                    color="#20639B"
                    radius="15px"
                    onClick={() => this.handleCreateUnit(item, index)}
                    className={styles.chooseOptions} loading={loading[index]}>{item.schema_name}</Button>
                </div>
              )
            })
            }
            <div className={styles.buttons}>
              <Button
                button
                color="#ED553B"
                radius="15px"
                onClick={() => this.setState({chooseVariantModal: false})}
                className={styles.startComposition} loading={logoutLoading}>{t('Back')}</Button>
            </div>
          </div>
        }
      </div>
    )
  }
}))
