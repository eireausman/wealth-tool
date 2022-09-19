import { motion } from "framer-motion";
import React, { Fragment } from "react";
import { OptionsBoardLogoutLinkProps } from "../../../types/typeInterfaces";

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
          <div className="loginBoxLink" onClick={performLogoutAction}>
            Logout ({loggedInUser})
          </div>
        </motion.div>
      ) : (
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="loginBox"
        >
          <div className="loginBoxLink" onClick={performLogoutAction}>
            Logout
          </div>
        </motion.div>
      )}
    </Fragment>
  );
};

export default OptionsBoardLogoutLink;
