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
// import Button from "@/uikit/Button";
import PropTypes from "prop-types"
import { push } from "connected-react-router";
import { Button, CircularProgress } from "@mui/material";
import { LoadingButton } from '@mui/lab'
// import Button from '@mui/material'
import { withTheme } from '@mui/styles'

export default withTheme(withTranslation()(connect(
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
      () => {
        this.setState({logoutLoading: false})
        return true
      }, () => {
        this.setState({logoutLoading: false})
        return false
      }
    )
  }

  render () {
    const {t, schemas}                                                  = this.props
    const {createLoading_1, loading, logoutLoading, chooseVariantModal} = this.state
    return (
      <div className={styles.wrapper}>
        {!chooseVariantModal ? (
            <div className={styles.buttonsWrapper}>
              <div className={styles.buttons}>
                <LoadingButton
                  loadingIndicator={<CircularProgress color='inherit' size={28}/>}
                  loading={createLoading_1 === true}
                  color="primary"
                  variant="contained"
                  onClick={() => this.setState({chooseVariantModal: true})}
                >{t('StartComposition')}</LoadingButton>
              </div>
              <div className={styles.buttons}>
                <LoadingButton
                  loadingIndicator={<CircularProgress color='inherit' size={28}/>}
                  loading={logoutLoading}
                  color="secondary"
                  variant="outlined"
                  onClick={this.handleUserLogout}
                >{t('FinishSession')}</LoadingButton>
              </div>
            </div>
          ) :
          <div>
            <div className={styles.header}>{t('SpecifyCompositionType')}</div>
            <div className={styles.variantsWrapper}>
              <div className={styles.flexWrapperColumn}>
                <div className={styles.buttons}>
                  <LoadingButton
                    sx={{pointerEvents: 'none'}}
                    loadingIndicator={<CircularProgress color='inherit' size={28}/>}
                    color='secondary'
                  >{t('Simple')}</LoadingButton>
                </div>
                {schemas?.map((item, index) => {
                  if(!item.is_composite) {
                    return (
                      <div key={item.schema_id} className={styles.buttons}>
                        <LoadingButton
                          loadingIndicator={<CircularProgress color='inherit' size={28}/>}
                          loading={loading[index]}
                          color='primary'
                          variant='contained'
                          onClick={() => this.handleCreateUnit(item, index)}
                        >{item.schema_name}</LoadingButton>
                      </div>
                    )
                  }
                })}
              </div>
              <div className={styles.flexWrapperColumn}>
                <div className={styles.buttons}>
                  <LoadingButton
                    sx={{pointerEvents: 'none'}}
                    loadingIndicator={<CircularProgress color='inherit' size={28}/>}
                    color='secondary'
                  >{t('Complex')}</LoadingButton>
                </div>
                {schemas?.map((item, index) => {
                  if(item.is_composite) {
                    return (
                      <div key={item.schema_id} className={styles.buttons}>
                        <LoadingButton
                          loadingIndicator={<CircularProgress color='inherit' size={28}/>}
                          loading={loading[index]}
                          color='primary'
                          variant='contained'
                          onClick={() => this.handleCreateUnit(item, index)}
                        >{item.schema_name}</LoadingButton>
                      </div>
                    )
                  }
                })}
              </div>
            </div>
            <div className={styles.buttonsWrapper}>
              <div className={styles.buttons}>
                <LoadingButton
                  loadingIndicator={<CircularProgress color='inherit' size={28}/>}
                  loading={logoutLoading}
                  color='secondary'
                  variant='outlined'
                  onClick={() => this.setState({chooseVariantModal: false})}
                >{t('Back')}</LoadingButton>
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
})))
