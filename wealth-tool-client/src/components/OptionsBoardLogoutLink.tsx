import { motion } from "framer-motion";
import React, { Fragment, useState } from "react";
import { OptionsBoardLogoutLinkProps } from "../../../types/typeInterfaces";
import { TbDoorExit } from "react-icons/tb";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const OptionsBoardLogoutLink: React.FC<OptionsBoardLogoutLinkProps> = ({
  performLogoutAction,
  loggedInUser,
}) => {
  const [spinIsActive, setspinIsActive] = useState(false);

  return (
    <Fragment>
      {2 > 1 ? (
        <motion.div
          whileTap={{ scale: 0.9 }}
          className="loginBox"
          onMouseEnter={() => setspinIsActive(true)}
          onMouseLeave={() => setspinIsActive(false)}
        >
          <Tippy content={<span>Logout user {loggedInUser}</span>}>
            <button className="loginBoxLink" onClick={performLogoutAction}>
              {loggedInUser}
              <motion.span
                animate={{
                  rotate: spinIsActive ? 360 : 0,
                }}
              >
                <TbDoorExit />
              </motion.span>
            </button>
          </Tippy>
        </motion.div>
      ) : (
        <motion.div whileTap={{ scale: 0.9 }} className="loginBox">
          <Tippy content={<span>Logout user {loggedInUser}</span>}>
            <button className="loginBoxLink" onClick={performLogoutAction}>
              logout
              <TbDoorExit />
            </button>
          </Tippy>
        </motion.div>
      )}
    </Fragment>
  );
};

export default OptionsBoardLogoutLink;
