let initialState = {
    pages: [
        {
            header: "Название этапа производства",
            context: "Описание этапа производства",
            startTime: null,
            endTime: null,
            duration: null,
            idealDuration: 365, // В секундах
        }
    ],
    compositionStartTime: null,
    compositionEndTime: null,
    compositionDuration: null,
    compositionIdealDuration: 6000, // В секундах
    generalStageNumber: 0,
    currentPageNumber: 0
}

const endoReducer = (state = initialState, action) => {
    switch (action.type){
        default:
            return {

            }
    }
}



export default endoReducer