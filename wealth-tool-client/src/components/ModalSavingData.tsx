import { motion } from "framer-motion";
import React from "react";
import CardSpinner from "./CardSpinner";
import "./ModalSavingData.css";

interface ModalSavingDataProps {
  title: string;
}

const ModalSavingData: React.FC<ModalSavingDataProps> = ({ title }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="modalSavingDataContainer"
    >
      <CardSpinner cardTitle={title} />
    </motion.div>
  );
};

export default ModalSavingData;