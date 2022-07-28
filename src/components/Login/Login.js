import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import React from 'react'
import styles from './Login.module.css'
import robonomicsLogo from '../../static/imageCenter.png'
import multiAgentLogo from '../../static/imageLeft_black.png'
import endoStarsLogo from '../../static/imageRight.png'

export default withTranslation()(connect(
  (store) => ({}),
  (dispatch) => ({})
)(class Login extends React.Component {

  render () {
    const {t} = this.props
    return (
      <div className={styles.fullWrapper}>
        <div className={styles.wrapper}>
          <div className={styles.header}>{t('QualityMonitoringSystem')}</div>
          <div className={styles.icons}>
            <div className={styles.icon}><img className={styles.leftLogo} src={multiAgentLogo} alt="MVAS-logo(img1)"/></div>
            <div className={styles.icon}><img className={styles.centerLogo} src={robonomicsLogo}
                                              alt="robonomics-logo(img2)"/></div>
            <div className={styles.icon}><img className={styles.rightLogo} src={endoStarsLogo}
                                              alt="geoscan-logo(img3)"/>
            </div>
          </div>
          <div className={styles.message}>{t('AuthorizeToProceed')}</div>
        </div>
      </div>
    )
  }
}))
