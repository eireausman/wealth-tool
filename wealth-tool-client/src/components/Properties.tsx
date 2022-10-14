import React, { useState, useEffect, Fragment } from "react";
import { PropertiesProps } from "../../../types/typeInterfaces";
import CardSpinner from "./CardSpinner";
import "./Properties.css";
import PropertiesNewProp from "./PropertiesNewProp";
import { propertiesAPIData } from "../../../types/typeInterfaces";
import {
  getPropertiesData,
  getNetPropertyTotal,
  getSinglePropertyData,
} from "../modules/serverRequests";
import { AxiosResponse } from "axios";
import NoAssets from "./NoAssetsMessage";
import ButtonAddAsset from "./ButtonAddAsset";
import { BsHouseDoor } from "react-icons/bs";

import ViewCardHeaderRow from "./ViewCardHeaderRow";
import PropertiesRow from "./PropertiesRow";
import PropertiesRowUpdatingVals from "./PropertiesRowUpdatingVals";

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

  const [showNoAccountsMessage, setshowNoAccountsMessage] = useState(false);
  const [showAddNewForm, setshowAddNewForm] = useState(false);
  const [propertyAccAPIData, setpropertyAccAPIData] =
    useState<Array<propertiesAPIData>>();
  const [netTotalPropValue, setnetTotalPropValue] = useState<
    number | undefined
  >(0);
  const [orderByThisColumn, setorderByThisColumn] =
    useState<string>("property_nickname");

  const refreshPropertiesValues = async (propertyID?: number) => {
    setnetTotalPropValue(undefined);
    setshowNoAccountsMessage(false);

    if (propertyID !== undefined && propertyAccAPIData !== undefined) {
      // we are only updating a single record:
      const propertyAccAPIDataCopy = [...propertyAccAPIData];
      for (let item in propertyAccAPIDataCopy) {
        if (propertyAccAPIData[item].property_id === propertyID) {
          propertyAccAPIData[item].reloading = "valReloading";

          setpropertyAccAPIData(propertyAccAPIDataCopy);

          const newPriceData = await getSinglePropertyData(
            selectedCurrency.currency_code,
            propertyID
          );

          if (newPriceData) {
            if (newPriceData.data[0].property_id === propertyID) {
              propertyAccAPIDataCopy[item] = newPriceData.data[0];
            }
            setpropertyAccAPIData(propertyAccAPIDataCopy);
          }

          break;
        }
      }
    } else {
      if (propertyAccAPIData !== undefined) {
        const propertyAccAPIDataCopy = [...propertyAccAPIData];
        propertyAccAPIDataCopy.forEach((item) => {
          item.reloading = "valReloading";
        });
        setpropertyAccAPIData(propertyAccAPIDataCopy);
      }
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

        setshowNoAccountsMessage(false);
      } else if (propData !== undefined && propData.status === 204) {
        setshowNoAccountsMessage(true);
      }
    }

    const total = await getNetPropertyTotal(selectedCurrency.currency_code);
    setnetTotalPropValue(total);
  };

  //reload API data if currency changes:
  useEffect(() => {
    refreshPropertiesValues();
  }, [selectedCurrency.currency_code, orderByThisColumn]);

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
      {propertyAccAPIData === undefined && showNoAccountsMessage === false && (
        <CardSpinner cardTitle="Properties" />
      )}
      {showNoAccountsMessage === true && (
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
      {propertyAccAPIData !== undefined && showNoAccountsMessage === false && (
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
              <Fragment key={data.property_id}>
                {data.reloading === "valReloading" ? (
                  <PropertiesRowUpdatingVals
                    key={data.property_id}
                    data={data}
                    selectedCurrency={selectedCurrency}
                    refreshPropertiesValues={refreshPropertiesValues}
                    settriggerRecalculations={settriggerRecalculations}
                    triggerRecalculations={triggerRecalculations}
                  />
                ) : (
                  <PropertiesRow
                    key={data.property_id}
                    data={data}
                    selectedCurrency={selectedCurrency}
                    refreshPropertiesValues={refreshPropertiesValues}
                    settriggerRecalculations={settriggerRecalculations}
                    triggerRecalculations={triggerRecalculations}
                  />
                )}
              </Fragment>
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
