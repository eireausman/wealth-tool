import React from "react";
import "./NoAssetsMessage.css";
import { motion } from "framer-motion";
import { TbZoomMoney } from "react-icons/tb";
import { BsHouseDoor } from "react-icons/bs";
import { GoGraph } from "react-icons/go";

interface NoAssetsInterface {
  cardTitle: string;
  cardText: string;
  assetType: string;
}

const NoAssets: React.FC<NoAssetsInterface> = ({
  cardTitle,
  cardText,
  assetType,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0.5, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="messageContainer"
    >
      <p className="messageText">{cardTitle}</p>
      {assetType === "cashAccount" && (
        <TbZoomMoney size={56} className="moneyIcon" />
      )}
      {assetType === "property" && (
        <BsHouseDoor size={56} className="moneyIcon" />
      )}
      {assetType === "investment" && (
        <GoGraph size={56} className="moneyIcon" />
      )}
      <p className="messageText">{cardText}</p>
    </motion.div>
  );
};

export default NoAssets;
