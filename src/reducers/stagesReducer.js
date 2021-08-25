import React from 'react'
import { fromJS, List } from 'immutable'
import { types } from './common'
import config from '../../configs/config.json'

export const stagesInitialState = fromJS({
    steps: {
      '0': {'title': 'title1', 'context': 'context1', 'duration': 300 },
      '1': {'title': 'title2', 'context': 'context2', 'duration': 250 }
    },
    user: {
        'name':' Vasya Pupkin',
        'position': 'Engineer',
        'authorized': false
    },
    composition: {},
    unit: {},
    modalsNotifications: {},
    workbench_no: 0
})

export const stagesReducer = (state={}, action) => {
    if (!action.type.startsWith('STAGES__'))
        return state
    if (config.dev_show_reducers)
        if (action.type !== types.STAGES__FETCH_COMPOSITION)
            console.log('reducer-stages', action)

    switch (action.type){
        case types.STAGES__REPORT_ERROR:
            return state
              .setIn(['notifications', 'error'], fromJS(action.error))
        case types.STAGES__FETCH_COMPOSITION:
            return state
              .set('composition', fromJS(action))
              .setIn(['unit', 'unit_internal_id'], action.unit_internal_id !== '' && action.unit_internal_id !== null ? action.unit_internal_id : (state.getIn(['unit', 'unit_internal_id']) !== '' ? state.getIn(['unit', 'unit_internal_id']) : ''))
              .setIn(['unit', 'unit_biography'], action.unit_biography !== null ? fromJS(action.unit_biography) : '')
              .deleteIn(['composition', 'type'])
        case types.STAGES__CREATE_NEW_UNIT:
            return state
              .setIn(['unit', 'unit_internal_id'], fromJS(action.unit_internal_id))
        case types.STAGES__ADD_NOTIFICATION:
            return state
              .setIn(['modalsNotifications', state.get('modalsNotifications').keySeq().toJS().length + 1], action.notificationMessage)
        case types.STAGES__REMOVE_NOTIFICATION:
            return state
              .deleteIn(['modalsNotifications', parseInt(action.notificationID)])
        case types.STAGES__RESET_UNIT:
            return state
              .deleteIn(['unit'])
        case types.STAGES__SET_STEPS:
            return state
              .set('steps', fromJS(action.steps))
              .deleteIn(['steps', Object.entries(action.steps).length-1])
        case types.STAGES__SET_WORKBENCH_NO:
            return state
              .set('workbench_number', 2)
        default:
            return state
    }
}
