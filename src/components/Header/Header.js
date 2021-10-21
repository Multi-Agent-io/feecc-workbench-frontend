import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import React from 'react'
import styles from './Header.module.css'
import robonomicsLogo from '../../static/imageCenter.png'
import MVASLogo from '../../static/imageLeft.png'
import { push } from "connected-react-router";
import Stopwatch from "@components/Stopwatch/Stopwatch";
import PropTypes from "prop-types";
import { doGetBarcode, doGetUnitBiography, doSetCompositionID } from "@reducers/stagesActions";
import { setQueryValues } from "@reducers/routerActions";
import config from '../../../configs/config.json'

export default withTranslation()(connect(
  (store) => ({
    composition: store.stages.get('composition').toJS(),
    location: store.router.location.pathname,
    unitID: store.stages.getIn(['unit', 'unit_internal_id']),
    finishedCompositions: store.stages.get('finishedCompositionsIDs')?.toJS(),
    usedTimestamps: store.stages.get('usedTimestamps')?.toJS(),
    state: store.stages.getIn(['composition', 'state'])
  }),
  (dispatch) => ({
    redirectToLogin: () => dispatch(push('/')),
    goToMenu: () => dispatch(push({pathname: '/menu'})),
    redirectToComposition: () => dispatch(push('/composition')),
    redirectToGatherComponents: () => dispatch(push('/gatherComponents')),
    // getBarcode: (successChecker, errorChecker) => doGetBarcode(dispatch, successChecker, errorChecker),
    setQuery: (query, url) => setQueryValues(dispatch, query, url),
    setCompositionID: (unitID) => doSetCompositionID(dispatch, unitID),
    getUnitBiography: (unitID, successChecker, errorChecker) => doGetUnitBiography(dispatch, unitID, successChecker, errorChecker),
  })
)(class Header extends React.Component {

  static propTypes = {
    composition: PropTypes.object,
    location: PropTypes.string,
    unitID: PropTypes.string,
    finishedCompositions: PropTypes.arrayOf(PropTypes.string),
    usedTimestamps: PropTypes.arrayOf(PropTypes.string),

    redirectToLogin: PropTypes.func.isRequired,
    goToMenu: PropTypes.func.isRequired,
    redirectToComposition: PropTypes.func.isRequired,
    getBarcode: PropTypes.func.isRequired,
    setQuery: PropTypes.func.isRequired,
    setCompositionID: PropTypes.func.isRequired,
    getUnitBiography: PropTypes.func.isRequired,
  }

  state = {
    timerID: null
  }

  constructor (props) {
    super(props)
    this.stopwatchRef = React.createRef()
  }

  componentDidMount () {

    if (!this.props.composition.employee_logged_in) {
      this.props.redirectToLogin()
    }
    // this.setState({
    //   timerID: setInterval(() => {
    //     this.props.getBarcode(
    //       (res) => {
    //         if (res && res.buffer !== undefined) {
    //           if (this.isNumeric(res.buffer) && res.buffer.length === 13) { // Check if code is valid composition code
    //             if (!this.props.finishedCompositions.includes(res.buffer) && this.props.unitID !== res.buffer) { // Check if composition is not marked as finished
    //               if (this.props.unitID !== undefined || this.props.unitID !== '') { // Check if unitID is not set
    //                 if (!this.props.usedTimestamps.includes((res.added_on).toString())){ // Check if timestamp was already used
    //                   if ((Date.now() / 1000).toFixed(0) - res.added_on <= config.pause_sensitivity) { // Check if recovery is still valid
    //                     this.props.setCompositionID(res.buffer)
    //                     setTimeout(() => {
    //                       this.props.setQuery({ afterPause: true, timestamp: res.added_on }, this.props.location)
    //                     }, 1000)
    //                   }
    //                 }
    //
    //               }
    //             }
    //           } else {
    //             this.props.setQuery({ afterPause: undefined }, this.props.location)
    //           }
    //         }
    //         return true
    //       },
    //       undefined)
    //   }, 1000)
    // })
  }

  isNumeric = (str) => {
    if (typeof str != "string") return false // we only process strings!
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
      !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    let page = this.props.location.split('/')[1]
    if (this.props.composition.employee_logged_in) {
      switch (this.props.state) {
        case 'AuthorizedIdling':
          if (page !== 'menu')
            this.props.goToMenu()
          break
        case 'AwaitLogin':
          if (page !== '')
            this.props.redirectToLogin()
          break
        case 'GatherComponents':
          if (page !== 'gatherComponents')
            this.props.redirectToGatherComponents()
          break
        case 'UnitAssignedIdling':
          if (page !== 'composition')
            this.props.redirectToComposition()
          break
        case 'ProductionStageOngoing':
          if (this.stopwatchRef !== undefined) {
            this.stopwatchRef?.current?.start()
          }

          if (page !== 'composition')
            this.props.redirectToComposition()
          break
        default:
          console.log(`default case -> ${this.props.state}`)
      }

    } else {
      if (page !== '') {
        this.props.redirectToLogin()
      }
    }
  }

  renderHeader = () => {
    const {t, composition, unitID} = this.props
    return (
      <div className={styles.wrapper}>
        <div className={styles.icons}>
          <img className={styles.robonomicsLogo} alt={"Robonomics logo"} src={robonomicsLogo}/>
          <img className={styles.mvasLogo} alt={"MVAS logo"} src={MVASLogo}/>
        </div>
        <div className={styles.info}>
          <div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{t('AuthorizedEmployee')} {composition?.employee?.name}</div>
              <div className={styles.userPosition}>{t('Position')} {composition?.employee?.position}</div>
            </div>
            {unitID && (<div>{t('CompositionNumber')} {unitID}</div>)}
          </div>
          <div>
            {this.props.state}
          </div>
          <div className={styles.mainTimer}>
            <div className={styles.timerHeader}>
              {composition.operation_ongoing ?
                <>
                  <div>{t('SessionDuration')}</div>
                  <Stopwatch ref={this.stopwatchRef}/>
                </>
                :
                <>
                  {composition.duration && (
                    <>
                      <div>{t('LastSessionDuration')}</div>
                      <div>00:00:00</div>
                    </>
                  )}
                </>
              }
            </div>
          </div>
        </div>
      </div>
    )
  }

  render () {
    return (
      <>
        {this.props.location.split('/')[1] !== '' && this.renderHeader()}
        {/*<div>header</div>*/}
      </>
    )
  }
}))
