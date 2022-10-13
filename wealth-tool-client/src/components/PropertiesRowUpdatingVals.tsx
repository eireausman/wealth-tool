import { motion } from "framer-motion";
import React, { Fragment, useState } from "react";
import {
  propertiesAPIData,
  selectedCurrencyDetails,
} from "../../../types/typeInterfaces";
import PropertiesUpdateVal from "./PropertiesUpdateVal";
import getDisplayNumber from "../modules/getDisplayNumber";
import { FaEdit } from "react-icons/fa";
import Shimmer from "./Shimmer";

interface PropertiesRowProps {
  data: propertiesAPIData;
  selectedCurrency: selectedCurrencyDetails;
  refreshPropertiesValues: () => Promise<void>;
  settriggerRecalculations: React.Dispatch<React.SetStateAction<number>>;
  triggerRecalculations: number;
}

const PropertiesRowUpdatingVals: React.FC<PropertiesRowProps> = ({
  data,
  refreshPropertiesValues,
  settriggerRecalculations,
  triggerRecalculations,
  selectedCurrency,
}) => {
  const [styleRowID, setstyleRowID] = useState<number>(-1);
  const [showEditPropertyForm, setshowEditPropertyForm] =
    useState<boolean>(false);
  const [styleForHoverDiv, setStyleForHoverDiv] = useState<object>({
    opacity: 0,
  });

  const editThisProperty = () => {
    setshowEditPropertyForm(true);
  };

  const checkKeyEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setshowEditPropertyForm(true);
    }
  };

  const checkForEscapeKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setshowEditPropertyForm(false);
    }
  };

  const closeModal = (e: React.FormEvent<EventTarget>) => {
    const target = e.target as HTMLElement;
    if (target.className === "newAdditionModal") {
      setshowEditPropertyForm(false);
    }
  };

  return (
    <Fragment>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="viewCardRow propertiesViewCardRow"
        key={data.property_id}
        onMouseEnter={(e) => {
          setstyleRowID(data.property_id);
          setStyleForHoverDiv({ opacity: "1" });
        }}
        onMouseLeave={(e) => {
          setStyleForHoverDiv({ opacity: "0" });
          setstyleRowID(-1);
        }}
        onClick={() => editThisProperty()}
        tabIndex={0}
        onKeyUp={(e) => checkKeyEnter(e)}
      >
        <div className="viewCardRowLeftBox PropertyLeftBox">
          <span className="propertyName">
            {data.property_nickname.toUpperCase()}
            <FaEdit
              className="editValueIcon"
              color={"#087fed"}
              style={
                styleRowID === data.property_id
                  ? styleForHoverDiv
                  : { opacity: "0" }
              }
            />
          </span>
          <span className="ownerText">Owner: {data.property_owner_name}</span>
          <span className="valueBaseCurrency">
            Currency: {data.property_valuation_currency}
          </span>
        </div>
        <div className="viewCardRowRightBox">
          <motion.table
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="valuesTable"
          >
            <tbody>
              <tr className="calculatedBalanceValueRow">
                <td>
                  <Shimmer height={20} width={120} borderRadiusPX={1} />
                </td>
              </tr>
              <tr>
                <td>
                  <Shimmer height={20} width={120} borderRadiusPX={1} />
                </td>
              </tr>
              <tr>
                <td>
                  <Shimmer height={20} width={120} borderRadiusPX={1} />
                </td>
              </tr>
              <tr>
                <td>
                  <Shimmer height={20} width={120} borderRadiusPX={1} />
                </td>
              </tr>
            </tbody>
          </motion.table>
        </div>
      </motion.div>
      {showEditPropertyForm === true && (
        <div className="newAdditionModal" onClick={(e) => closeModal(e)}>
          <div className="newAdditionModalInner">
            <PropertiesUpdateVal
              data={data}
              refreshPropertiesValues={refreshPropertiesValues}
              settriggerRecalculations={settriggerRecalculations}
              triggerRecalculations={triggerRecalculations}
              setshowEditPropertyForm={setshowEditPropertyForm}
              checkForEscapeKey={checkForEscapeKey}
            />
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default PropertiesRowUpdatingVals;