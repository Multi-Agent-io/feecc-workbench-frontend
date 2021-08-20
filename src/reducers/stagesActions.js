import { axiosWrapper, fetchWrapper, types } from "@reducers/common";
import config from '../../configs/config.json'
import axios from "axios";

export const doFetchComposition = (dispatch, successChecker, errorChecker) => {
  fetchWrapper(
    dispatch,
    `/api/workbench/${config.workbench_number}/status`,
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

export const doCreateUnit = (dispatch, successChecker, errorChecker) => {
  axiosWrapper(
    dispatch,
    types.STAGES__CREATE_NEW_UNIT,
    {
      method: "post",
      url   : `http://localhost:5000/api/unit/new`,
      data  : {
        unit_type: config.unit_type
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
        workbench_no: config.workbench_number
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
        workbench_no         : config.workbench_number,
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
        workbench_no   : config.workbench_number,
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
        workbench_no: config.workbench_number
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

