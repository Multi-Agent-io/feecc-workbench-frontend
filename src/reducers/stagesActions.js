import { axiosWrapper, fetchWrapper, types } from "@reducers/common";
import store from './main'
import config from '../../configs/config.json'
import axios from "axios";

// Reworked
export const doFetchComposition = (dispatch, successChecker, errorChecker) => {
  // To check if one record stopped and new started without /status request as it drops composition timer
  if (!store.getState().stages.get('betweenEndAndStartFlag')) {
    fetchWrapper(
      dispatch,
      `/workbench/status`,
      types.STAGES__FETCH_COMPOSITION,
      {
        method : 'GET',
        headers: {
          'Content-Type'               : 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      },
      successChecker
    ).then(errorChecker)
  }
}
// Reworked
export const doCreateUnit = (dispatch, schemaID, successChecker, errorChecker) => {
  axiosWrapper(
    dispatch,
    types.STAGES__CREATE_NEW_UNIT,
    {
      method: "post",
      url   : `${config.socket}/unit/new/${schemaID}`,
    },
    successChecker
  ).then(errorChecker)
}
// Reworked
export const doAssignUnit = (dispatch, unit_id,  successChecker, errorChecker) => {
  axiosWrapper(
    dispatch,
    undefined,
    {
      method: 'post',
      url   : `${config.socket}/workbench/assign-unit/${unit_id}`
    },
    successChecker
  ).then(errorChecker)
}
// Reworked
export const doLogout = (dispatch, successChecker, errorChecker) => {
  axiosWrapper(
    dispatch,
    types.STAGES__FETCH_COMPOSITION,
    {
      method: 'post',
      url   : `${config.socket}/employee/log-out`,
      data  : {
        workbench_no: store.getState().stages.get('workbench_no')
      }
    },
    successChecker
  ).then(errorChecker)
}
// Reworked
export const doGetSchemasNames = (dispatch, successChecker, errorChecker)  => {
  axiosWrapper(
    dispatch,
    types.STAGES__SET_PRODUCTION_SCHEMAS,
    {
      method: 'get',
      url   : `${config.socket}/workbench/production-schemas/names`
    },
    successChecker
  ).then(errorChecker)
}
// Reworked
export const doGetSchema = (dispatch, schemaId, successChecker, errorChecker) => {
  axiosWrapper(
    dispatch,
    types.STAGES__SET_STEPS,
    {
      method: 'get',
      url: `${config.socket}/workbench/production-schemas/${schemaId}`
    },
    successChecker
  ).then(errorChecker)
}
// Reworked
export const doStartStepRecord = (dispatch, productionStageName, additionalInfo, successChecker, errorChecker) => {
  axiosWrapper(
    dispatch,
    undefined,
    {
      method: 'post',
      url   : `${config.socket}/workbench/start-operation`,
      data  : {
        production_stage_name: productionStageName,
        additional_info      : additionalInfo
      }
    },
    successChecker
  ).then(errorChecker)
}
// Reworked
export const doStopStepRecord = (dispatch, additionalInfo, successChecker, errorChecker) => {
  axiosWrapper(
    dispatch,
    undefined,
    {
      method: 'post',
      url   : `${config.socket}/workbench/end-operation`,
      data  : {
        workbench_no   : store.getState().stages.get('workbench_no'),
        additional_info: additionalInfo
      }
    },
    successChecker
  ).then(errorChecker)
}
// Reworked
export const doCompositionUpload = (dispatch, successChecker, errorChecker) => {
  axiosWrapper(
    dispatch,
    types.STAGES__RESET_UNIT,
    {
      method: 'post',
      url   : `${config.socket}/unit/upload`,
    },
    successChecker
  ).then(errorChecker)
}
// Reworked
export const doRaiseNotification = (dispatch, notificationMessage) => {
  dispatch({
    type               : types.STAGES__ADD_NOTIFICATION,
    notificationMessage: notificationMessage
  })
}
// Reworked
export const doRemoveNotification = (dispatch, notificationID) => {
  dispatch({
    type          : types.STAGES__REMOVE_NOTIFICATION,
    notificationID: notificationID
  })
}
// Reworked
export const doSetSteps = (dispatch, steps) => {
  dispatch({
    type : types.STAGES__SET_STEPS,
    steps: steps
  })
}

export const doGetUnitInformation = (dispatch, unitID, successChecker, errorChecker) => {
  axiosWrapper(
    dispatch,
    undefined,
    // types.STAGES__GET_UNIT_INFORMATION,
    {
      method: 'get',
      url: `${config.socket}/unit/${unitID}/info`,
    },
    successChecker
  ).then(errorChecker)
}

export const doSetBetweenFlag = (dispatch, state) => {
  dispatch({
    type : types.STAGES__SET_BETWEEN_FLAG,
    state: state
  })
}
// Reworked
// export const doGetBarcode = (dispatch, successChecker, errorChecker) => {
//   axiosWrapper(
//     dispatch,
//     undefined,
//     {
//       method : 'post',
//       url    : `${config.socket}/workbench/hid_event`,
//       headers: {
//         'Content-Type'               : 'application/json',
//         'Access-Control-Allow-Origin': '*',
//       }
//     },
//     successChecker
//   ).then(errorChecker)
// }

export const doGetUnitBiography = (dispatch, unitID, successChecker, errorChecker) => {
  fetchWrapper(
    dispatch,
    `/api/unit/${unitID}/info`,
    undefined,
    {
      method : "GET",
      headers: {
        'Content-Type'               : 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    },
    successChecker,
  ).then(errorChecker)
}

export const doSetCompositionID = (dispatch, unitID) => {
  dispatch({
    type  : types.STAGES__SET_UNIT_ID,
    unitID: unitID
  })
}
// Reworked
export const doRemoveUnit = (dispatch, successChecker, errorChecker) => {
  axiosWrapper(
    dispatch,
    types.STAGES__RESET_UNIT,
    {
      url: `${config.socket}/workbench/remove-unit`,
      method: 'post',
    },
    successChecker
  ).then(errorChecker)
}

export const doAddUnitToIgnore = (dispatch) => {
  dispatch({
    type: types.STAGES__ADD_UNIT_TO_IGNORE,
  })
}

export const doAddTimestampToIgnore = (dispatch, timestamp) => {
  dispatch({
    type: types.STAGES__ADD_TIMESTAMP_TO_IGNORE,
    timestamp: timestamp
  })
}
