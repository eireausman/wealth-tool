import { motion } from "framer-motion";
import React from "react";
import styles from "./SelectDropDown.module.css";

interface selectDropDownSortArray {
  readableString: string;
  dbField: string;
}

interface SelectDropDownProps {
  sortArray: Array<selectDropDownSortArray>;
  setshowDropdown: React.Dispatch<React.SetStateAction<Boolean>>;
  orderByThisColumn: string;
  setorderByThisColumn: React.Dispatch<React.SetStateAction<string>>;
}

const SelectDropDown: React.FC<SelectDropDownProps> = ({
  sortArray,
  setshowDropdown,
  orderByThisColumn,
  setorderByThisColumn,
}) => {
  const checkKeyEnter = (e: React.KeyboardEvent, DBsortField: string) => {
    if (e.key === "Enter") {
      setorderByThisColumn(() => DBsortField);
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.5 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={styles.selectContainer}
      onMouseEnter={() => setshowDropdown(true)}
      onMouseLeave={() => setshowDropdown(false)}
    >
      <ul className={styles.selectDropDownList}>
        {sortArray.map((item, index) => (
          <li
            key={index}
            tabIndex={0}
            className={
              orderByThisColumn === item.dbField
                ? styles.selectDropDownListItemActive
                : styles.selectDropDownListItem
            }
            onKeyUp={(e) => checkKeyEnter(e, item.dbField)}
            onClick={() => setorderByThisColumn(() => item.dbField)}
          >
            {item.readableString}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default SelectDropDown;
