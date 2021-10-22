import { withTranslation } from "react-i18next"
import { connect } from "react-redux"
import React from 'react'
import styles from './GatherComponents.module.css'
import { withTheme } from "@mui/styles";
import { LoadingButton } from "@mui/lab";
import { doRemoveUnit } from "@reducers/stagesActions";
import { CircularProgress, Paper } from "@mui/material";

export default withTheme(withTranslation()(connect(
  (store) => ({
    unitComponents: store.stages.getIn(['composition', 'unit_components'])?.toJS()
  }),
  (dispatch) => ({
    dropUnit: (successChecker, errorChecker) => doRemoveUnit(dispatch, successChecker, errorChecker),
  })
)(class GatherComponents extends React.Component {

  state = {
    loading: false
  }

  render () {
    const {t, unitComponents} = this.props
    const {loading}           = this.state
    return (
      <div className={styles.wrapper}>
        <div className={styles.cancelButton}>
          <LoadingButton
            loadingIndicator={<CircularProgress color='inherit' size={28}/>}
            variant='outlined'
            color='secondary'
            disabled={loading}
            loading={loading}
            onClick={() => {
              this.setState({loading: true})
              this.props.dropUnit(
                (res) => {
                  if(res.status_code === 200) {
                    setTimeout(() => this.setState({loading: false}), 400)
                    return true
                  } else {
                    return false
                  }
                }, null
              )
            }}
          >{t('CancelComposition')}</LoadingButton>
        </div>
        <div className={styles.header}>{t('RequiredComponents')}</div>
        <div className={styles.componentsWrapper}>
          {unitComponents && Object.keys(unitComponents).map((item, index) => {
            return (
              <Paper key={item} elevation={Object.values(unitComponents)[index] === null ? 10 : 5} sx={{padding: '20px', borderRadius: '20px'}}>
                <div
                  className={styles.component + ' ' + (Object.values(unitComponents)[index] === null ? styles.missingComponent : styles.addedComponent)}
                >{item}</div>
              </Paper>
            )
          })}
        </div>
      </div>
    )
  }
})))
