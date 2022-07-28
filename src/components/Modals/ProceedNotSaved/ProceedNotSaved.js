import React, { useContext } from "react";
import ModalActionsContext from "@reducers/context/modal-context";
import { LoadingButton } from "@mui/lab";
import { CircularProgress } from "@mui/material";
import styles from "./ProceedNotSaved.module.css";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import CloseActionButton from "../../CloseActionButton/CloseActionButton";

const ProceedNotSaved = (props) => {
  const { onClose } = useContext(ModalActionsContext);
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  return (
    <div className={styles.contentWrapper}>
      <div className={styles.contentHeader}>{t("ImportantMessage")}</div>
      <div className={styles.contentText}>
        При продолжении <strong>без</strong> сохранения вам нужно будет
        выполнить определённые действия позже. Без этих действий изделие не
        будет считатся завершённым. Данные об изделии <strong>не</strong> были выгружены в сеть IPFS, 
        но они <strong>сохранены локально</strong> и к этому изделию всегда можно будет
        вернуться позже.
        <br />
        <br />
        При появлении возможности сохранить изделие вам нужно будет:
        <br />
        - Просканировать штрих-код изделия.
        <br />
        - Сохранить паспорт.
        <br />
        <br />
        При удачном сохранении изделие будет считаться полностью завершённым и будет выгружено в сеть IPFS.
        Если возникает текущая ошибка, то следует попробовать позже.
      </div>
      <div className={styles.buttonsWrapper}>
        <LoadingButton
          size="large"
          loadingIndicator={<CircularProgress color="inherit" size={28} />}
          loading={false}
          color="secondary"
          variant="outlined"
          onClick={() => {
            props.onNoSave && props.onNoSave();
            enqueueSnackbar(
              `Паспорт ${props.unitID} не был сохранён в IPFS. Вам следует вернуться к нему позже`,
              { variant: "warning", action: CloseActionButton }
            );
            onClose();
          }}
        >
          Продолжить без сохранения
        </LoadingButton>
        <LoadingButton
          size="large"
          loadingIndicator={<CircularProgress color="inherit" size={28} />}
          loading={false}
          color="primary"
          variant="contained"
          onClick={onClose}
        >
          Вернуться
        </LoadingButton>
      </div>
    </div>
  );
};

export default ProceedNotSaved;
