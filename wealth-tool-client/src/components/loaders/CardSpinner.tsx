import React from "react";
import styles from "./CardSpinner.module.css";
import { motion } from "framer-motion";
import { ImSpinner7 } from "react-icons/im";

interface CardSpinnerInterface {
  cardTitle: string;
}

const CardSpinner: React.FC<CardSpinnerInterface> = ({ cardTitle }) => {
  return (
    <motion.div
      initial={{ opacity: 0.5, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={styles.spinnerContainer}
    >
      <ImSpinner7 className={styles.spinIcon} name="cardSpinner" />
      {cardTitle !== "" && <p className="spinnerText">{cardTitle}</p>}
    </motion.div>
  );
};

export default CardSpinner;
