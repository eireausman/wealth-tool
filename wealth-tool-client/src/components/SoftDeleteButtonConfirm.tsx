import { motion } from "framer-motion";
import React, { Fragment, useState } from "react";
import "./SoftDeleteButtonConfirm.css";
import { SoftDeleteButtonConfirmProps } from "../../../types/typeInterfaces";
import {
  deleteCashAccount,
  deleteInvestment,
  deleteProperty,
} from "../modules/serverRequests";
import ModalSavingData from "./ModalSavingData";

const SoftDeleteButtonConfirm: React.FC<SoftDeleteButtonConfirmProps> = ({
  assetType,
  assetID,
  assetTitle,
  refreshBalances,
  triggerRecalculations,
  settriggerRecalculations,
  cancelForm,
}) => {
  const [showSavingMessage, setshowSavingMessage] = useState<boolean>(false);
  const [saveProgressText, setsaveProgressText] = useState<string>(
    "Deleting. Not long now..."
  );

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
    refreshBalances();
    settriggerRecalculations(triggerRecalculations + 1);
    cancelForm();
  };

  return (
    <div className="confirmContainer">
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
            onClick={softDeleteThis}
            className="buttonRed buttonSoftDeleteConfirm"
          >
            Click to confirm deletion.
          </motion.button>
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            whileTap={{ scale: 0.9 }}
            onClick={cancelForm}
            className="buttonWhite buttonSoftDeleteCancel"
          >
            Cancel - do not delete.
          </motion.button>
        </Fragment>
      )}
    </div>
  );
};

export default SoftDeleteButtonConfirm;
