import React, { useState, useEffect, Fragment } from "react";
import {
  PropertiesProps,
  editingPropertyDetails,
} from "../../../types/typeInterfaces";

import { motion } from "framer-motion";
import CardSpinner from "./CardSpinner";
import "./Properties.css";
import editIcon from "../assets/images/edit.png";

import PropertiesUpdateVal from "./PropertiesUpdateVal";
import getDisplayNumber from "../modules/getDisplayNumber";
import PropertiesNewProp from "./PropertiesNewProp";
import { propertiesAPIData } from "../../../types/typeInterfaces";
import {
  getPropertiesData,
  getNetPropertyTotal,
} from "../modules/serverRequests";
import { AxiosResponse } from "axios";
import NoAssets from "./NoAssetsMessage";

const Properties: React.FC<PropertiesProps> = ({
  selectedCurrencyCode,
  selectedCurrencySymbol,
  currencyCodesFromDB,
  settriggerRecalculations,
  triggerRecalculations,
}) => {
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [showNoAccountsMessage, setshowNoAccountsMessage] = useState(false);

  const [propertyToEdit, setpropertyToEdit] = useState<number>();
  const [editingPropertyDetails, seteditingPropertyDetails] =
    useState<editingPropertyDetails>();
  const [showAddNewForm, setshowAddNewForm] = useState(false);
  const [propertyAccAPIData, setpropertyAccAPIData] =
    useState<Array<propertiesAPIData>>();
  const [netTotalPropValue, setnetTotalPropValue] = useState<number>(0);

  const refreshPropertiesValues = async () => {
    setpropertyAccAPIData(undefined);
    setShowSpinner(true);
    const propData: AxiosResponse<any, any> | undefined =
      await getPropertiesData(selectedCurrencyCode);
    if (
      propData !== undefined &&
      propData.status === 200 &&
      propData.data !== undefined
    ) {
      setpropertyAccAPIData(propData.data);
      setshowNoAccountsMessage(false);
    } else if (propData !== undefined && propData.status === 204) {
      setshowNoAccountsMessage(true);
    }

    const total = await getNetPropertyTotal(selectedCurrencyCode);
    setnetTotalPropValue(total);
    setShowSpinner(false);
  };

  //reload API data if currency changes:
  useEffect(() => {
    refreshPropertiesValues();
  }, [selectedCurrencyCode]);

  // remove the loading status if cash account data populated in state
  useEffect(() => {
    if (propertyAccAPIData && propertyAccAPIData.length !== 0) {
      setShowSpinner(false);
    }
  }, [propertyAccAPIData]);

  const editThisProperty = (
    property_id: number,
    property_nickname: string,
    property_valuation: number,
    property_loan_value: number,
    property_valuation_curr_symbol: string
  ) => {
    setpropertyToEdit(property_id);

    const editPropertyDetails = {
      property_id,
      property_nickname,
      property_valuation,
      property_loan_value,
      property_valuation_curr_symbol,
    };
    seteditingPropertyDetails(editPropertyDetails);
  };

  const showAddPropForm = () => {
    setshowAddNewForm(true);
  };

  const closeModal = (e: React.FormEvent<EventTarget>) => {
    const target = e.target as HTMLElement;
    if (target.className === "newAdditionModal") {
      setshowAddNewForm(false);
    }
  };

  return (
    <section className="viewCard">
      {showSpinner === true && <CardSpinner cardTitle="Properties" />}
      {showNoAccountsMessage === true && (
        <Fragment>
          <NoAssets
            cardTitle="Property"
            cardText="No properties being tracked"
            assetType="property"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="buttonWhite buttonAddNewEntry"
            onClick={showAddPropForm}
          >
            + Add Property
          </motion.button>
        </Fragment>
      )}
      {propertyAccAPIData !== undefined && (
        <Fragment>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="viewCardHeaderRow"
          >
            <h3 className="viewCardHeading">PROPERTY</h3>

            <h3 className="viewCardTotal">
              {selectedCurrencySymbol} {getDisplayNumber(netTotalPropValue)}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="buttonWhite buttonAddNewEntry"
                onClick={showAddPropForm}
              >
                + Add Property
              </motion.button>
            </h3>
          </motion.div>
          <div className="propertiesOflowContainer scrollbarstyles">
            {propertyAccAPIData?.map((data) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="viewCardRow propertiesViewCardRow"
                key={data.property_id}
              >
                {propertyToEdit === data.property_id ? (
                  <PropertiesUpdateVal
                    setpropertyToEdit={setpropertyToEdit}
                    editingPropertyDetails={editingPropertyDetails}
                    seteditingPropertyDetails={seteditingPropertyDetails}
                    refreshPropertiesValues={refreshPropertiesValues}
                    settriggerRecalculations={settriggerRecalculations}
                    triggerRecalculations={triggerRecalculations}
                  />
                ) : (
                  <Fragment>
                    <div
                      className="viewCardRowLeftBox PropertyLeftBox"
                      onClick={() =>
                        editThisProperty(
                          data.property_id,
                          data.property_nickname,
                          data.property_valuation,
                          data.property_loan_value,
                          data.property_valuation_curr_symbol
                        )
                      }
                    >
                      <span className="propertyName">
                        {data.property_nickname.toUpperCase()}
                        <img
                          src={editIcon}
                          className="editValueIcon"
                          alt="Edit Value"
                        />
                      </span>
                      <span className="ownerText">
                        Owner: {data.property_owner_name}
                      </span>
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
                            <td>Net {selectedCurrencyCode}: </td>
                            <td>
                              {selectedCurrencySymbol}{" "}
                              {getDisplayNumber(
                                data.propertyValuationInSelCurr
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td>Valuation: </td>
                            <td>
                              {data.property_valuation_curr_symbol}{" "}
                              {getDisplayNumber(data.property_valuation)}
                            </td>
                          </tr>
                          <tr>
                            <td>Loan: </td>
                            <td>
                              {data.property_valuation_curr_symbol}{" "}
                              {getDisplayNumber(data.property_loan_value)}
                            </td>
                          </tr>
                          <tr>
                            <td>Net Val: </td>
                            <td>
                              {data.property_valuation_curr_symbol}{" "}
                              {getDisplayNumber(
                                data.property_valuation -
                                  data.property_loan_value
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </motion.table>
                    </div>
                  </Fragment>
                )}
              </motion.div>
            ))}
          </div>
        </Fragment>
      )}

      {showAddNewForm === true && (
        <div className="newAdditionModal" onClick={(e) => closeModal(e)}>
          <div className="newAdditionModalInner">
            <PropertiesNewProp
              currencyCodesFromDB={currencyCodesFromDB}
              setshowAddNewForm={setshowAddNewForm}
              refreshPropertiesValues={refreshPropertiesValues}
              settriggerRecalculations={settriggerRecalculations}
              triggerRecalculations={triggerRecalculations}
            />
          </div>
        </div>
      )}
    </section>
  );
};
export default Properties;
