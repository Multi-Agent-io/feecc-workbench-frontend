import React, {Component} from 'react';
import {connect} from 'react-redux';
import StagePage from "./StagePage";

function mapStateToProps(state) {
    return {
        page: state.endoStarsState.pages[state.endoStarsState.currentPageNumber],
        pageNumber: state.endoStarsState.currentPageNumber,
        generalStageNumber: state.endoStarsState.generalStageNumber
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

class StagePageContainer extends Component {
    render() {
        return (
            <div>

            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StagePage);