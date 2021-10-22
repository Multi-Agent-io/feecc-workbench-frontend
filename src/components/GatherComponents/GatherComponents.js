import { withTranslation } from "react-i18next"
import { connect } from "react-redux"
import React from 'react'
import styles from './GatherComponents.module.css'
import { withTheme } from "@mui/styles";
import { LoadingButton } from "@mui/lab";
import { doRemoveUnit } from "@reducers/stagesActions";

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

  componentDidMount () {
    setTimeout(() => {
      console.log(this.props?.unitComponents)
      // Object.values(this.props?.unitComponents)?.map(item => console.log(item))
      console.log(Object.keys(this.props.unitComponents))
      console.log(Object.values(this.props.unitComponents))
    }, 2000)
  }

  render () {
    const {t, unitComponents} = this.props
    const {loading}           = this.state
    return (
      <div className={styles.wrapper}>
        <div className={styles.cancelButton}>
          <LoadingButton
            variant='outlined'
            color='secondary'
            disabled={loading}
            loading={loading}
            onClick={() => {
              this.props.dropUnit()
            }}
          >{t('CancelComposition')}</LoadingButton>
        </div>
        <div className={styles.header}>{t('RequiredComponents')}</div>
        <div className={styles.componentsWrapper}>
          {unitComponents && Object.keys(unitComponents).map((item, index) => {
            return (
              <div
                className={styles.component + ' ' + (Object.values(unitComponents)[index] === null ? styles.missingComponent : styles.addedComponent)}
                key={item}
              >{item}</div>
            )
          })}
        </div>
      </div>
    )
  }
})))
