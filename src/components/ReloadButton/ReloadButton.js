import React from "react";
import styles from "./ReloadButton.module.css";
import { LoadingButton } from "@mui/lab";
import { useTranslation } from "react-i18next";

export default function ReloadButton(props) {
  const {t} = useTranslation();

  return (
    <div className={styles.buttonWrapper}>
      <LoadingButton 
        variant="outlined"
        color="secondary"
        size="large"
        onClick={() => window.location.href = window.location.href}
      >{t('ReloadPage')}</LoadingButton>
    </div>
  );
}
