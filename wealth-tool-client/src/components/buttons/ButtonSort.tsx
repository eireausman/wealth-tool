import React, { useState } from "react";
import { motion } from "framer-motion";
import { BiSortAlt2 } from "react-icons/bi";
import SelectDropDown from "../viewCard/SelectDropDown";

interface selectDropDownSortArray {
  readableString: string;
  dbField: string;
}

interface ButtonSortProps {
  sortArray: Array<selectDropDownSortArray>;
  orderByThisColumn: string;
  setorderByThisColumn: React.Dispatch<React.SetStateAction<string>>;
}

const ButtonSort: React.FC<ButtonSortProps> = ({
  sortArray,
  orderByThisColumn,
  setorderByThisColumn,
}) => {
  const [showDropdown, setshowDropdown] = useState<Boolean>(false);
  return (
    <>
      <motion.button
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        className="buttonWhite buttonAddNewEntry"
        onMouseEnter={() => setshowDropdown(true)}
        onMouseLeave={() => setshowDropdown(false)}
        onClick={() => setshowDropdown(!showDropdown)}
      >
        sort
        <BiSortAlt2 />
      </motion.button>

      {showDropdown === true && (
        <>
          {
            <SelectDropDown
              sortArray={sortArray}
              setshowDropdown={setshowDropdown}
              orderByThisColumn={orderByThisColumn}
              setorderByThisColumn={setorderByThisColumn}
            />
          }
        </>
      )}
    </>
  );
};

export default ButtonSort;
