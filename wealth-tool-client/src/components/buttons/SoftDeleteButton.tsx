import { motion } from "framer-motion";
import React from "react";
import { SoftDeleteButtonProps } from "../../../../types/typeInterfaces";

import styles from "./SoftDeleteButton.module.css";

const SoftDeleteButton: React.FC<SoftDeleteButtonProps> = ({
  setshowSoftDelConfirm,
}) => {
  return (
    <div className={styles.softDeleteButtonContainer}>
      <motion.button
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`buttonRed ${styles.softDeleteButton}`}
        onClick={() => setshowSoftDelConfirm(true)}
      >
        Delete
      </motion.button>
    </div>
  );
};

export default SoftDeleteButton;
