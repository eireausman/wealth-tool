import React from "react";
import { motion } from "framer-motion";
import { HiOutlinePlusCircle } from "react-icons/hi";

interface ButtonAddAssetProps {
  clickFunction: () => void;
  buttonTextContent: string;
}

const ButtonAddAsset: React.FC<ButtonAddAssetProps> = ({
  clickFunction,
  buttonTextContent,
}) => {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className="buttonWhite buttonAddNewEntry"
      onClick={clickFunction}
    >
      {buttonTextContent}
      <HiOutlinePlusCircle />
    </motion.button>
  );
};

export default ButtonAddAsset;
