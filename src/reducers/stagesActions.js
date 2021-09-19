import { axiosWrapper, fetchWrapper, types } from "@reducers/common";
import store from './main'
import config from '../../configs/config.json'
import axios from "axios";

export const doFetchComposition = (dispatch, successChecker, errorChecker) => {
  // To check if one record stopped and new started without /status request as it drops composition timer
  if (!store.getState().stages.get('betweenEndAndStartFlag')) {
    fetchWrapper(
      dispatch,
      `/api/workbench/${store.getState().stages.get('workbench_no')}/status`,
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

export const doCreateUnit = (dispatch, unit_type, successChecker, errorChecker) => {
  axiosWrapper(
    dispatch,
    types.STAGES__CREATE_NEW_UNIT,
    {
      method: "post",
      url   : `${config.socket}/api/unit/new`,
      data  : {
        unit_type: unit_type
      }
    },
    successChecker
  ).then(errorChecker)
}

export const doLogout = (dispatch, successChecker, errorChecker) => {
  axiosWrapper(
    dispatch,
    types.STAGES__FETCH_COMPOSITION,
    {
      method: 'post',
      url   : `${config.socket}/api/employee/log-out`,
      data  : {
        workbench_no: store.getState().stages.get('workbench_no')
      }
    },
    successChecker
  ).then(errorChecker)
}

export const doStartStepRecord = (dispatch, unitInternalID, productionStageName, additionalInfo, successChecker, errorChecker) => {
  axiosWrapper(
    dispatch,
    undefined,
    {
      method: 'post',
      url   : `${config.socket}/api/unit/${unitInternalID}/start`,
      data  : {
        workbench_no         : store.getState().stages.get('workbench_no'),
        production_stage_name: productionStageName,
        additional_info      : additionalInfo
      }
    },
    successChecker
  ).then(errorChecker)
}

export const doStopStepRecord = (dispatch, unitInternalID, additionalInfo, successChecker, errorChecker) => {
  axiosWrapper(
    dispatch,
    undefined,
    {
      method: 'post',
      url   : `${config.socket}/api/unit/${unitInternalID}/end`,
      data  : {
        workbench_no   : store.getState().stages.get('workbench_no'),
        additional_info: additionalInfo
      }
    },
    successChecker
  ).then(errorChecker)
}

export const doCompositionUpload = (dispatch, unitInternalID, successChecker, errorChecker) => {
  axiosWrapper(
    dispatch,
    types.STAGES__RESET_UNIT,
    {
      method: 'post',
      url   : `${config.socket}/api/unit/${unitInternalID}/upload`,
      data  : {
        workbench_no: store.getState().stages.get('workbench_no')
      }
    },
    successChecker
  ).then(errorChecker)
}

export const doRaiseNotification = (dispatch, notificationMessage) => {
  dispatch({
    type               : types.STAGES__ADD_NOTIFICATION,
    notificationMessage: notificationMessage
  })
}

export const doRemoveNotification = (dispatch, notificationID) => {
  dispatch({
    type          : types.STAGES__REMOVE_NOTIFICATION,
    notificationID: notificationID
  })
}

export const doSetSteps = (dispatch, steps) => {
  dispatch({
    type : types.STAGES__SET_STEPS,
    steps: steps
  })
}

export const doGetWorkbenchNumber = (dispatch, successChecker, errorChecker) => {
  fetchWrapper(
    dispatch,
    '/api/status/client_info',
    types.STAGES__SET_WORKBENCH_NO,
    {
      method : 'GET',
      headers: {
        'Content-Type'               : 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    }, successChecker
  ).then(errorChecker)
}

export const doSetBetweenFlag = (dispatch, state) => {
  dispatch({
    type : types.STAGES__SET_BETWEEN_FLAG,
    state: state
  })
}

export const doGetBarcode = (dispatch, successChecker, errorChecker) => {
  axiosWrapper(
    dispatch,
    undefined,
    {
      method : 'GET',
      url    : 'http://127.0.0.2:8080/api/hid_buffer',
      headers: {
        'Content-Type'               : 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    },
    successChecker
  ).then(errorChecker)
}

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

export const doResetUnit = (dispatch) => {
  dispatch({
    type: types.STAGES__RESET_UNIT
  })
}
