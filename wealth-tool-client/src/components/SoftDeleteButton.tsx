import React from "react";
import { SoftDeleteButtonProps } from "../../../types/typeInterfaces";

import "./SoftDeleteButton.css";

const SoftDeleteButton: React.FC<SoftDeleteButtonProps> = ({
  setshowSoftDelConfirm,
}) => {
  return (
    <button
      className="buttonRed softDeleteButton"
      onClick={() => setshowSoftDelConfirm(true)}
    >
      Delete
    </button>
  );
};

export default SoftDeleteButton;
