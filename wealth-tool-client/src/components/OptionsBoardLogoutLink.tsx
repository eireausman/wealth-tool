import { motion } from "framer-motion";
import React, { Fragment, useState } from "react";
import { OptionsBoardLogoutLinkProps } from "../../../types/typeInterfaces";
import { TbDoorExit } from "react-icons/tb";
import "./OptionsBoardLogoutLink.css";

const OptionsBoardLogoutLink: React.FC<OptionsBoardLogoutLinkProps> = ({
  performLogoutAction,
  loggedInUser,
}) => {
  return (
    <motion.div
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className="loginBox"
    >
      <button className="loginButtonLink" onClick={performLogoutAction}>
        Logout user {loggedInUser}
        <TbDoorExit />
      </button>
    </motion.div>
  );
};

export default OptionsBoardLogoutLink;
