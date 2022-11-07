import { motion } from "framer-motion";
import React, { Fragment, useState } from "react";
import styles from "./SoftDeleteButtonConfirm.module.css";
import { SoftDeleteButtonConfirmProps } from "../../../../types/typeInterfaces";
import {
  deleteCashAccount,
  deleteInvestment,
  deleteProperty,
} from "../../modules/serverRequests";
import ModalSavingData from "../modals/ModalSavingData";

const SoftDeleteButtonConfirm: React.FC<SoftDeleteButtonConfirmProps> = ({
  assetType,
  assetID,
  assetTitle,
  triggerRecalculations,
  settriggerRecalculations,
  cancelForm,
  setentryIDWasDeleted,
}) => {
  const [showSavingMessage, setshowSavingMessage] = useState<boolean>(false);

  const saveProgressText = "Deleting. Not long now...";

  const assetTypeSwitch = async () => {
    switch (assetType) {
      case "cashAccount":
        await deleteCashAccount(assetID);
        break;
      case "property":
        await deleteProperty(assetID);
        break;
      case "investment":
        await deleteInvestment(assetID);
        break;
      default:
        console.log(`${assetType} is not a recognised asset type.`);
    }
  };

  const softDeleteThis = async () => {
    setshowSavingMessage(true);
    await assetTypeSwitch();
    settriggerRecalculations(triggerRecalculations + 1);
    cancelForm();
    setentryIDWasDeleted(assetID);
  };

  return (
    <div className={styles.confirmContainer}>
      <h4>{assetTitle}</h4>
      <p>Are you sure you want to delete this asset?</p>
      {showSavingMessage === true && (
        <ModalSavingData title={saveProgressText} />
      )}
      {showSavingMessage === false && (
        <Fragment>
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            whileTap={{ scale: 0.9 }}
            onClick={cancelForm}
            className={`buttonWhite ${styles.buttonSoftDeleteCancel}`}
          >
            Cancel - do not delete.
          </motion.button>
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            whileTap={{ scale: 0.9 }}
            onClick={softDeleteThis}
            className={`buttonTransparent ${styles.buttonSoftDeleteConfirm}`}
          >
            Click to confirm deletion.
          </motion.button>
        </Fragment>
      )}
    </div>
  );
};

export default SoftDeleteButtonConfirm;
