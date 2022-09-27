import { motion } from "framer-motion";
import React, { Fragment } from "react";
import { OptionsBoardLogoutLinkProps } from "../../../types/typeInterfaces";
import { TbDoorExit } from "react-icons/tb";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const OptionsBoardLogoutLink: React.FC<OptionsBoardLogoutLinkProps> = ({
  performLogoutAction,
  loggedInUser,
  windowWidth,
  wideWidthLimit,
}) => {
  return (
    <Fragment>
      {windowWidth > wideWidthLimit ? (
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="loginBox"
        >
          <Tippy content={<span>Logout user {loggedInUser}</span>}>
            <div className="loginBoxLink" onClick={performLogoutAction}>
              {loggedInUser} <TbDoorExit />
            </div>
          </Tippy>
        </motion.div>
      ) : (
        <motion.div
          whileHover={{ scale: 1 }}
          whileTap={{ scale: 0.9 }}
          className="loginBox"
        >
          <Tippy content={<span>Logout user {loggedInUser}</span>}>
            <div className="loginBoxLink" onClick={performLogoutAction}>
              logout
              <TbDoorExit />
            </div>
          </Tippy>
        </motion.div>
      )}
    </Fragment>
  );
};

export default OptionsBoardLogoutLink;
