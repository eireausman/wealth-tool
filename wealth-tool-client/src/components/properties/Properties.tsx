import React, {
  useState,
  useEffect,
  Fragment,
  useRef,
  useContext,
} from "react";
import { PropertiesProps } from "../../../../types/typeInterfaces";
import CardSpinner from "../loaders/CardSpinner";
import styles from "./Properties.module.css";
import PropertiesNewProp from "./PropertiesNewProp";
import NoAssets from "../viewCard/NoAssetsMessage";
import ButtonAddAsset from "../buttons/ButtonAddAsset";
import { BsHouseDoor } from "react-icons/bs";
import ViewCardHeaderRow from "../viewCard/ViewCardHeaderRow";
import PropertiesRow from "./PropertiesRow";
import PropertiesRowUpdatingVals from "./PropertiesRowUpdatingVals";
import ViewCardHeaderRowSorting from "../viewCard/ViewCardHeaderRowSorting";
import { useAssetCountContext } from "../../modules/Contexts";
import useRefreshPropertiesVals from "./hooks/useRefreshPropertiesVals";
import useUpdateNetPropTotal from "./hooks/useUpdateNetPropTotal";

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
  // useState
  const [showAddNewForm, setshowAddNewForm] = useState(false);
  const [orderByThisColumn, setorderByThisColumn] =
    useState<string>("property_nickname");
  const [entryIDWasDeleted, setentryIDWasDeleted] = useState<
    number | undefined
  >(undefined);
  const [itemIDWasAdded, setitemIDWasAdded] = useState<number | undefined>(
    undefined
  );
  const [thisItemIdBeingEdited, setthisItemIdBeingEdited] = useState<number>(0);
  const [shimmerAllRows, setshimmerAllRows] = useState(false);

  // useRef
  const previousOrderBy = useRef(orderByThisColumn);
  const previousCurrency = useRef(selectedCurrency.currency_code);

  //useContext
  const assetCount = useContext(useAssetCountContext);

  // Hooks
  const propertyAccAPIData = useRefreshPropertiesVals({
    thisItemIdBeingEdited,
    selectedCurrencyCode: selectedCurrency.currency_code,
    orderByThisColumn,
    entryIDWasDeleted,
    itemIDWasAdded,
  });

  const netTotalPropValue = useUpdateNetPropTotal({
    selectedCurrencyCode: selectedCurrency.currency_code,
    previousOrderBy: previousOrderBy.current,
    orderByThisColumn,
    entryIDWasDeleted,
    itemIDWasAdded,
    thisItemIdBeingEdited,
    propertyAccAPIData,
  });

  // useEffect
  useEffect(() => {
    if (
      previousCurrency.current !== selectedCurrency.currency_code &&
      previousOrderBy.current === orderByThisColumn
    ) {
      setshimmerAllRows(true);
    }
    previousCurrency.current = selectedCurrency.currency_code;
    previousOrderBy.current = orderByThisColumn;
  }, [orderByThisColumn, selectedCurrency.currency_code]);

  useEffect(() => {
    // set edit account to 0 to avoid shimmer being left 'on' for single record.
    setthisItemIdBeingEdited(0);
    setshimmerAllRows(false);
  }, [propertyAccAPIData]);

  // functions
  const closeModal = (e: React.FormEvent<EventTarget>) => {
    const target = e.target as HTMLElement;
    if (target.className === "newAdditionModal") {
      setshowAddNewForm(false);
    }
  };

  return (
    <section className="viewCard">
      {assetCount.properties === undefined && (
        <CardSpinner cardTitle="Properties" />
      )}
      {assetCount.properties <= 0 && (
        <Fragment>
          <NoAssets
            cardTitle="Property"
            cardText="No properties being tracked"
            assetType="property"
          />
          <ButtonAddAsset
            clickFunction={() => setshowAddNewForm(true)}
            buttonTextContent="Add Property"
          />
        </Fragment>
      )}
      {propertyAccAPIData !== undefined && assetCount.properties > 0 && (
        <Fragment>
          {previousOrderBy.current === orderByThisColumn ? (
            <ViewCardHeaderRow
              rowIcon={<BsHouseDoor size={25} color={"white"} />}
              rowTitle="PROPERTY"
              selectedCurrency={selectedCurrency}
              netTotal={netTotalPropValue}
              addNewFunction={setshowAddNewForm}
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

          <div className={`${styles.propertiesOflowContainer} scrollbarstyles`}>
            {propertyAccAPIData?.map((data) => (
              <Fragment key={data.property_id}>
                {thisItemIdBeingEdited === data.property_id ||
                shimmerAllRows === true ? (
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
