import { motion } from "framer-motion";
import React from "react";
import "./SoftDeleteButtonConfirm.css";
import { SoftDeleteButtonConfirmProps } from "../../../types/typeInterfaces";
import {
  deleteCashAccount,
  deleteInvestment,
  deleteProperty,
} from "../modules/serverRequests";

const SoftDeleteButtonConfirm: React.FC<SoftDeleteButtonConfirmProps> = ({
  assetType,
  assetID,
  refreshBalances,
  triggerRecalculations,
  settriggerRecalculations,
  cancelForm,
}) => {
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
    await assetTypeSwitch();
    refreshBalances();
    settriggerRecalculations(triggerRecalculations + 1);
    cancelForm();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="confirmContainer"
      onClick={softDeleteThis}
    >
      Click to confirm deletion.
    </motion.div>
  );
};

export default SoftDeleteButtonConfirm;
