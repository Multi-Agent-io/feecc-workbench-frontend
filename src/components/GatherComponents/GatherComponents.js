import { withTranslation } from "react-i18next"
import { connect } from "react-redux"
import React from 'react'
import styles from './GatherComponents.module.css'

export default withTranslation()(connect(
  (store) => ({
    unitComponents: store.stages.getIn(['composition', 'unit_components'])?.toJS()
  }),
)(class GatherComponents extends React.Component {

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
    return (
      <div className={styles.wrapper}>
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
}))
