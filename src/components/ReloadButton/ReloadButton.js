import React from "react";
import styles from "./ReloadButton.module.css";
import { LoadingButton } from "@mui/lab";
import { withTranslation } from "react-i18next";
import { withContext } from "@reducers/context/withContext";
import ReloadWarning from "../Modals/ReloadWarning/ReloadWarning";

class ReloadButton extends React.Component {
  render() {
    return (
      <div className={styles.buttonWrapper}>
        <LoadingButton
          variant="outlined"
          color="secondary"
          size="large"
          onClick={() => {
            const href = window.location.href;
            const hrefElementsNum = href.split("/").length;
            const page = href.split("/")[hrefElementsNum - 1];
            if (page === "composition" || page === "gatherComponents") {
              this.props.context.onOpen(
                <ReloadWarning
                  reloadAction={() =>
                    (window.location.href = window.location.href)
                  }
                />
              );
            }
          }}
        >
          {this.props.t("ReloadPage")}
        </LoadingButton>
      </div>
    );
  }
}

export default withContext(withTranslation()(ReloadButton));
