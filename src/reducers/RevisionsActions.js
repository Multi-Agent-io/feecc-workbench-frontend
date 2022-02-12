import {axiosWrapper, types} from "@reducers/common";
import config from '../../configs/config.json'

export const doFetchRevisions = (dispatch, successChecker, errorChecker) => {
    axiosWrapper(
        dispatch,
        types.REVISIONS__FETCH_PASSPORTS,
        {
            url: `${config.socket}/unit/pending_revision/`,
            method: "GET"
        },
        successChecker
    ).then(errorChecker)
}