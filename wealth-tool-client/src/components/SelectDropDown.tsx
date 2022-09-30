import React from "react";
import "./SelectDropDown.css";

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
  return (
    <div
      className="selectContainer"
      onMouseEnter={() => setshowDropdown(true)}
      onMouseLeave={() => setshowDropdown(false)}
    >
      <ul className="selectDropDownList">
        {sortArray.map((item, index) => (
          <li
            key={index}
            className={
              orderByThisColumn === item.dbField
                ? "selectDropDownListItemActive"
                : "selectDropDownListItem"
            }
            onClick={() => setorderByThisColumn(() => item.dbField)}
          >
            {item.readableString}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectDropDown;
