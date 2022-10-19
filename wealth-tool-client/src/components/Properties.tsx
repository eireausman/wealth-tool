import React, {
  useState,
  useEffect,
  Fragment,
  useRef,
  useCallback,
} from "react";
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
import PropertiesRowUpdatingVals from "./PropertiesRowUpdatingVals";
import ViewCardHeaderRowSorting from "./ViewCardHeaderRowSorting";

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
  const previousOrderBy = useRef(orderByThisColumn);
  const [entryIDWasDeleted, setentryIDWasDeleted] = useState<
    number | undefined
  >(undefined);
  const [itemIDWasAdded, setitemIDWasAdded] = useState<number | undefined>(
    undefined
  );
  const [thisItemIdBeingEdited, setthisItemIdBeingEdited] =
    useState<number>(-1);

  const refreshPropertiesVals = useCallback(async () => {
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
    }
    previousOrderBy.current = orderByThisColumn;
    setthisItemIdBeingEdited(-1);
  }, [selectedCurrency.currency_code, orderByThisColumn]);

  const refreshNetTotal = useCallback(async () => {
    const total = await getNetPropertyTotal(selectedCurrency.currency_code);
    setnetTotalPropValue(total);
  }, [selectedCurrency.currency_code]);

  useEffect(() => {
    refreshPropertiesVals();
    refreshNetTotal();
  }, [
    refreshPropertiesVals,
    refreshNetTotal,
    entryIDWasDeleted,
    itemIDWasAdded,
    thisItemIdBeingEdited,
  ]);

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
          {previousOrderBy.current === orderByThisColumn ? (
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
          ) : (
            <ViewCardHeaderRowSorting
              rowIcon={<BsHouseDoor size={25} color={"white"} />}
              rowTitle="PROPERTY"
            />
          )}

          <div className="propertiesOflowContainer scrollbarstyles">
            {propertyAccAPIData?.map((data) => (
              <Fragment key={data.property_id}>
                {data.property_id === thisItemIdBeingEdited &&
                previousOrderBy.current === orderByThisColumn ? (
                  <PropertiesRowUpdatingVals
                    key={data.property_id}
                    data={data}
                    selectedCurrency={selectedCurrency}
                  />
                ) : (
                  <PropertiesRow
                    key={data.property_id}
                    data={data}
                    selectedCurrency={selectedCurrency}
                    settriggerRecalculations={settriggerRecalculations}
                    triggerRecalculations={triggerRecalculations}
                    setentryIDWasDeleted={setentryIDWasDeleted}
                    setthisItemIdBeingEdited={setthisItemIdBeingEdited}
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
              settriggerRecalculations={settriggerRecalculations}
              triggerRecalculations={triggerRecalculations}
              setitemIDWasAdded={setitemIDWasAdded}
            />
          </div>
        </div>
      )}
    </section>
  );
};
export default Properties;
