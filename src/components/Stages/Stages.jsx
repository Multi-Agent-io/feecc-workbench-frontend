import React, {useEffect, useState} from 'react';
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
    setTimer, setPages, logoutUserCheck, setLogoutTimer
} from "../../redux/reducers/EndoStars/endoReducer";
import {ThemeProvider} from "@material-ui/styles";
import {createMuiTheme} from '@material-ui/core/styles';
import {indigo} from "@material-ui/core/colors";
import s from "./Stages.module.css"
import {CircularProgress} from "@material-ui/core";
// import {readString} from "react-papaparse";
// import csvFile from "../../configs/pages.csv"
// import axios from "axios";

// Styles for material-ui stepper
const useStyles = makeStyles((theme) => ({
    root: {
        width: '50%',
        marginLeft: "25%",
        display: "flex",
        justifyContent: "flex-start",
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

let transliterate = (text) => {
    text = text
        .replace(/\u0401/g, 'YO')
        .replace(/\u0419/g, 'I')
        .replace(/\u0426/g, 'TS')
        .replace(/\u0423/g, 'U')
        .replace(/\u041A/g, 'K')
        .replace(/\u0415/g, 'E')
        .replace(/\u041D/g, 'N')
        .replace(/\u0413/g, 'G')
        .replace(/\u0428/g, 'SH')
        .replace(/\u0429/g, 'SCH')
        .replace(/\u0417/g, 'Z')
        .replace(/\u0425/g, 'H')
        .replace(/\u042A/g, '')
        .replace(/\u0451/g, 'yo')
        .replace(/\u0439/g, 'i')
        .replace(/\u0446/g, 'ts')
        .replace(/\u0443/g, 'u')
        .replace(/\u043A/g, 'k')
        .replace(/\u0435/g, 'e')
        .replace(/\u043D/g, 'n')
        .replace(/\u0433/g, 'g')
        .replace(/\u0448/g, 'sh')
        .replace(/\u0449/g, 'sch')
        .replace(/\u0437/g, 'z')
        .replace(/\u0445/g, 'h')
        .replace(/\u044A/g, "'")
        .replace(/\u0424/g, 'F')
        .replace(/\u042B/g, 'I')
        .replace(/\u0412/g, 'V')
        .replace(/\u0410/g, 'a')
        .replace(/\u041F/g, 'P')
        .replace(/\u0420/g, 'R')
        .replace(/\u041E/g, 'O')
        .replace(/\u041B/g, 'L')
        .replace(/\u0414/g, 'D')
        .replace(/\u0416/g, 'ZH')
        .replace(/\u042D/g, 'E')
        .replace(/\u0444/g, 'f')
        .replace(/\u044B/g, 'i')
        .replace(/\u0432/g, 'v')
        .replace(/\u0430/g, 'a')
        .replace(/\u043F/g, 'p')
        .replace(/\u0440/g, 'r')
        .replace(/\u043E/g, 'o')
        .replace(/\u043B/g, 'l')
        .replace(/\u0434/g, 'd')
        .replace(/\u0436/g, 'zh')
        .replace(/\u044D/g, 'e')
        .replace(/\u042F/g, 'Ya')
        .replace(/\u0427/g, 'CH')
        .replace(/\u0421/g, 'S')
        .replace(/\u041C/g, 'M')
        .replace(/\u0418/g, 'I')
        .replace(/\u0422/g, 'T')
        .replace(/\u042C/g, "'")
        .replace(/\u0411/g, 'B')
        .replace(/\u042E/g, 'YU')
        .replace(/\u044F/g, 'ya')
        .replace(/\u0447/g, 'ch')
        .replace(/\u0441/g, 's')
        .replace(/\u043C/g, 'm')
        .replace(/\u0438/g, 'i')
        .replace(/\u0442/g, 't')
        .replace(/\u044C/g, "'")
        .replace(/\u0431/g, 'b')
        .replace(/\u044E/g, 'yu');

    return text;
};


const Stages = (props) => {
    let [step, addStep] = useState(0)

    let currStep = useSelector((state) => state.endoStarsState.currentPageNumber)
    let pages = useSelector((state) => state.endoStarsState.pages)
    let duration = useSelector((state) => state.endoStarsState.pages[currStep].duration)
    let generalStageNumber = useSelector((state) => state.endoStarsState.generalStageNumber)
    let fullDuration = useSelector((state) => state.endoStarsState.compositionDuration)
    // let socket = useSelector((state) => state.endoStarsState.socket)
    // let workbenchNumber = useSelector((state) => state.endoStarsState.workbenchNumber)

    const classes = useStyles();
    const dispatch = useDispatch()

    useEffect(() => {
        // Для счётчика таймера текущего этапа
        dispatch(setTimer(setInterval(() => {
            // debugger
            dispatch(countStageDuration())
        }, 1000)))

        // Таймер для отмены авторизации и полного завершения сессии
        dispatch(setLogoutTimer(setInterval(() => {
            dispatch(logoutUserCheck())
        }, 2000)))

    }, [])
    useEffect(() => {
        // Установка стартового времени после получения их из csv или после завершения сессии
        if (pages[currStep].startTime === "null") {
            dispatch(setStageStartTime())
        }
        // Тестирование логаута с переходом на первую страницу
        // if (generalStageNumber === 2){
        //     dispatch(logoutUser())
        // }
    })

    return (
        <ThemeProvider theme={testTheme}>
            <div className={classes.root}>
                <Stepper activeStep={step} orientation="vertical">
                    {pages.map((label, index) => (
                        <Step id={transliterate(label.header)} key={label.header}>
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
                                                // Если последний этап
                                                if (step === pages.length - 1) {
                                                    // console.log("final stage")
                                                    addStep(step + 1)
                                                    dispatch(finishComposition())
                                                    // Для плавного скролла элемента до конца
                                                    // ЭТО не работает, тк нужный конец страницы ещё не подгрузился
                                                    // window.scrollTo({top: window.innerHeight, behavior: "smooth"})
                                                    // let el = document.getElementById("printing")
                                                    // el.scrollIntoView({
                                                    //     block: "center",
                                                    //     inline: "center",
                                                    //     behavior: "smooth"
                                                    // })
                                                } else {
                                                    addStep(step + 1)
                                                    dispatch(nextPage())
                                                    // Для плавного скролла элемента до "центра"
                                                    let el = document.getElementById(transliterate(label.header))
                                                    el.scrollIntoView({
                                                        block: "center",
                                                        inline: "center",
                                                        behavior: "smooth"
                                                    })
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
                            <div id="printing" className={s.passportProgress}>
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