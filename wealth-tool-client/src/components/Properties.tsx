import React, { useState, useEffect, Fragment } from "react";
import { PropertiesProps } from "../../../types/typeInterfaces";
import CardSpinner from "./CardSpinner";
import "./Properties.css";
import PropertiesNewProp from "./PropertiesNewProp";
import { propertiesAPIData } from "../../../types/typeInterfaces";
import {
  getPropertiesData,
  getNetPropertyTotal,
} from "../modules/serverRequests";
import { AxiosResponse } from "axios";
import NoAssets from "./NoAssetsMessage";
import ButtonAddAsset from "./ButtonAddAsset";
import { BsHouseDoor } from "react-icons/bs";

import ViewCardHeaderRow from "./ViewCardHeaderRow";
import PropertiesRow from "./PropertiesRow";

const Properties: React.FC<PropertiesProps> = ({
  triggerRecalculations,
  settriggerRecalculations,
  selectedCurrency,
}) => {
  const sortArray = [
    { readableString: "Property Name", dbField: "property_nickname" },
    { readableString: "Owner", dbField: "property_owner_name" },
    { readableString: "Valuation", dbField: "property_valuation" },
    { readableString: "Loan", dbField: "property_loan_value" },
  ];

  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [showNoAccountsMessage, setshowNoAccountsMessage] = useState(false);
  const [showAddNewForm, setshowAddNewForm] = useState(false);
  const [propertyAccAPIData, setpropertyAccAPIData] =
    useState<Array<propertiesAPIData>>();
  const [netTotalPropValue, setnetTotalPropValue] = useState<number>(0);
  const [orderByThisColumn, setorderByThisColumn] =
    useState<string>("property_nickname");

  const refreshPropertiesValues = async () => {
    setShowSpinner(true);
    setshowNoAccountsMessage(false);
    setpropertyAccAPIData(undefined);
    const propData: AxiosResponse<any, any> | undefined =
      await getPropertiesData(
        selectedCurrency.currency_code,
        orderByThisColumn
      );
    if (
      propData !== undefined &&
      propData.status === 200 &&
      propData.data !== undefined
    ) {
      setpropertyAccAPIData(propData.data);
      setShowSpinner(false);
      setshowNoAccountsMessage(false);
    } else if (propData !== undefined && propData.status === 204) {
      setShowSpinner(false);
      setshowNoAccountsMessage(true);
    }

    const total = await getNetPropertyTotal(selectedCurrency.currency_code);
    setnetTotalPropValue(total);
  };

  //reload API data if currency changes:
  useEffect(() => {
    refreshPropertiesValues();
  }, [selectedCurrency.currency_code, orderByThisColumn]);

  // remove the loading status if cash account data populated in state
  useEffect(() => {
    if (propertyAccAPIData && propertyAccAPIData.length !== 0) {
      setShowSpinner(false);
    }
  }, [propertyAccAPIData]);

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
      {showSpinner === true && showNoAccountsMessage === false && (
        <CardSpinner cardTitle="Properties" />
      )}
      {showSpinner === false && showNoAccountsMessage === true && (
        <Fragment>
          <NoAssets
            cardTitle="Property"
            cardText="No properties being tracked"
            assetType="property"
          />
          <ButtonAddAsset
            clickFunction={showAddPropForm}
            buttonTextContent="Add Property"
          />
        </Fragment>
      )}
      {propertyAccAPIData !== undefined &&
        showSpinner === false &&
        showNoAccountsMessage === false && (
          <Fragment>
            <ViewCardHeaderRow
              rowIcon={<BsHouseDoor size={25} color={"white"} />}
              rowTitle="PROPERTY"
              selectedCurrency={selectedCurrency}
              netTotal={netTotalPropValue}
              addNewFunction={showAddPropForm}
              sortArray={sortArray}
              orderByThisColumn={orderByThisColumn}
              setorderByThisColumn={setorderByThisColumn}
            />

            <div className="propertiesOflowContainer scrollbarstyles">
              {propertyAccAPIData?.map((data) => (
                <PropertiesRow
                  key={data.property_id}
                  data={data}
                  selectedCurrency={selectedCurrency}
                  refreshPropertiesValues={refreshPropertiesValues}
                  settriggerRecalculations={settriggerRecalculations}
                  triggerRecalculations={triggerRecalculations}
                />
              ))}
            </div>
          </Fragment>
        )}

      {showAddNewForm === true && (
        <div className="newAdditionModal" onClick={(e) => closeModal(e)}>
          <div className="newAdditionModalInner">
            <PropertiesNewProp
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
