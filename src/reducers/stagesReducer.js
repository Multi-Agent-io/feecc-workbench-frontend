import React from 'react'
import { fromJS, List } from 'immutable'
import { types } from './common'

export const stagesInitialState = fromJS({
    steps: {
      '0': {'title': 'title1', 'context': 'context1' },
      '1': {'title': 'title2', 'context': 'context2' }
    },
    user: {
        'name':' Vasya Pupkin',
        'position': 'Engineer',
        'authorized': false
    },
    composition: {},
    unit: {},
    modalsNotifications: {}
})

export const stagesReducer = (state={}, action) => {
    if (!action.type.startsWith('STAGES__'))
        return state
    if (action.type !== types.STAGES__FETCH_COMPOSITION)
    console.log('reducer-stages', action)

    switch (action.type){
        case types.STAGES__REPORT_ERROR:
            return state
              .setIn(['notifications', 'error'], fromJS(action.error))
        
        case types.STAGES__FETCH_COMPOSITION:
            return state
              .set('composition', fromJS(action))
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
        default:
            return state
    }
}
