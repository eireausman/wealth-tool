import { motion } from "framer-motion";
import React from "react";
import CardSpinner from "../loaders/CardSpinner";
import styles from "./ModalSavingData.module.css";

interface ModalSavingDataProps {
  title: string;
}

const ModalSavingData: React.FC<ModalSavingDataProps> = ({ title }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={styles.modalSavingDataContainer}
    >
      <div className={styles.modalSavingDataCardSpinnerBumper}>
        <CardSpinner cardTitle={title} />
      </div>
    </motion.div>
  );
};

export default ModalSavingData;
