import { motion } from "framer-motion";
import React, { Fragment, useState } from "react";
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
  const [spinIsActive, setspinIsActive] = useState(false);
  return (
    <Fragment>
      {windowWidth > wideWidthLimit ? (
        <motion.div
          whileTap={{ scale: 0.9 }}
          className="loginBox"
          onHoverStart={() => setspinIsActive(true)}
          onHoverEnd={() => setspinIsActive(false)}
        >
          <Tippy content={<span>Logout user {loggedInUser}</span>}>
            <div className="loginBoxLink" onClick={performLogoutAction}>
              {loggedInUser}
              <motion.span
                animate={{
                  rotate: spinIsActive ? 360 : 0,
                }}
              >
                <TbDoorExit />
              </motion.span>
            </div>
          </Tippy>
        </motion.div>
      ) : (
        <motion.div whileTap={{ scale: 0.9 }} className="loginBox">
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
