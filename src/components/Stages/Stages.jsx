import React, {Component, useEffect, useLayoutEffect, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import {useDispatch, useSelector} from "react-redux";
import {
    finishComposition,
    nextPage,
    countStageDuration,
    setStageStartTime,
    setTimer
} from "../../redux/reducers/EndoStars/endoReducer";
import {ThemeProvider} from "@material-ui/styles";
import {createMuiTheme} from '@material-ui/core/styles';
// import purple from '@m aterial-ui/core/colors/purple'
import {blue, deepPurple, indigo, lightBlue} from "@material-ui/core/colors";
import s from "./Stages.module.css"
import {CircularProgress} from "@material-ui/core";

// Styles for material-ui stepper
const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        display: "flex",
        justifyContent: "center",
        marginTop: theme.spacing(6)
    },
    button: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    actionsContainer: {
        marginBottom: theme.spacing(2),
    },
    resetContainer: {
        padding: theme.spacing(3),
    },
}));

const testTheme = createMuiTheme({
    palette: {
        primary: indigo,
        secondary: {
            main: '#00838f',
        },
    },
});


const Stages = (props) => {
    let [step, addStep] = useState(0)

    let currStep = useSelector((state) => state.endoStarsState.currentPageNumber)
    let pages = useSelector((state) => state.endoStarsState.pages)
    let duration = useSelector((state) => state.endoStarsState.pages[currStep].duration)
    let generalStageNumber = useSelector((state) => state.endoStarsState.generalStageNumber)
    let fullDuration = useSelector((state) => state.endoStarsState.compositionDuration)

    const classes = useStyles();
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(setTimer(setInterval(() => {
            dispatch(countStageDuration())
        }, 1000)))

    }, [])

    useEffect(() => {
        if (pages[currStep].startTime === null) {
            dispatch(setStageStartTime())
        }
    })

    return (
        <ThemeProvider theme={testTheme}>
            <div className={classes.root}>
                <Stepper activeStep={step} orientation="vertical">
                    {pages.map((label, index) => (
                        <Step key={label.header}>
                            <StepLabel>{label.header}</StepLabel>
                            <StepContent>
                                <Typography>
                                    Норма: {parseInt(label.idealDuration / 3600)}
                                    :
                                    {parseInt((label.idealDuration / 60) % 60) < 10 ? "0" + parseInt((label.idealDuration / 60) % 60) : parseInt((label.idealDuration / 60) % 60)}
                                    :
                                    {parseInt(label.idealDuration % 60) < 10 ? "0" + parseInt(label.idealDuration % 60) : parseInt(label.idealDuration % 60)}
                                </Typography>
                                <Typography>{label.context}</Typography>
                                <div className={classes.actionsContainer}>
                                    <div className={s.buttonAndTime}>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => {
                                                if (step === pages.length - 1) {
                                                    // console.log("final stage")
                                                    addStep(step + 1)
                                                    dispatch(finishComposition())
                                                } else {
                                                    addStep(step + 1)
                                                    dispatch(nextPage())
                                                }

                                            }}
                                            className={classes.button}
                                        >
                                            {currStep === pages.length - 1 ? 'Закончить сборку' : 'Продолжить'}
                                        </Button>
                                        <div className={s.timeAtButton}>
                                            Продолжительность{" "}
                                            этапа: {parseInt(((duration) / 1000) / 3600)}
                                            :
                                            {parseInt(((duration / 1000) / 60) % 60) < 10 ? "0" + parseInt((((duration) / 1000) / 60) % 60) : parseInt((((duration) / 1000) / 60) % 60)}
                                            :
                                            {parseInt(((duration) / 1000) % 60) < 10 ? "0" + parseInt(((duration) / 1000) % 60) : parseInt(((duration) / 1000) % 60)}
                                        </div>
                                    </div>
                                </div>
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>
            </div>
            <div className={s.finishText}>
                {generalStageNumber === 2
                    ?
                    <div>
                        <Paper className={s.paperDuration} elevation={3}>
                            <Typography>
                                Вы потратили на сборку: {" "}
                                {parseInt(((fullDuration) / 1000) / 3600) % 24}
                                :
                                {parseInt(((fullDuration / 1000) / 60) % 60) < 10 ? "0" + parseInt((((fullDuration) / 1000) / 60) % 60) : parseInt((((fullDuration) / 1000) / 60) % 60)}
                                :
                                {parseInt(((fullDuration) / 1000) % 60) < 10 ? "0" + parseInt(((fullDuration) / 1000) % 60) : parseInt(((fullDuration) / 1000) % 60)}
                            </Typography>
                        </Paper>
                        <div className={s.passportPrinting}>
                            <div className={s.passportHeader}>Идёт печать паспорта</div>
                            <div className={s.passportProgress}>
                                <CircularProgress/>
                            </div>
                        </div>
                    </div>
                    :
                    <Typography>

                    </Typography>
                }
            </div>

        </ThemeProvider>
    );
}


export default Stages