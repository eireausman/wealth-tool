import { AxiosResponse } from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { propertiesAPIData } from "../../../../../types/typeInterfaces";
import { getPropertiesData } from "../../../modules/serverRequests";

interface useRefreshPropertiesValsProps {
  thisItemIdBeingEdited: number;
  selectedCurrencyCode: string;
  orderByThisColumn: string;
  entryIDWasDeleted?: number;
  itemIDWasAdded?: number;
}

const useRefreshPropertiesVals = (props: useRefreshPropertiesValsProps) => {
  const [propertyAccAPIData, setpropertyAccAPIData] =
    useState<Array<propertiesAPIData>>();

  const refreshPropertiesVals = useCallback(async () => {
    const propData: AxiosResponse<any, any> | undefined =
      await getPropertiesData(
        props.selectedCurrencyCode,
        props.orderByThisColumn
      );
    if (
      propData !== undefined &&
      propData.status === 200 &&
      propData.data !== undefined
    ) {
      setpropertyAccAPIData(propData.data);
    }
  }, [props.selectedCurrencyCode, props.orderByThisColumn]);

  useEffect(() => {
    refreshPropertiesVals();
  }, [
    refreshPropertiesVals,
    props.thisItemIdBeingEdited,
    props.selectedCurrencyCode,
    props.orderByThisColumn,
    props.entryIDWasDeleted,
    props.itemIDWasAdded,
  ]);

  return propertyAccAPIData;
};

export default useRefreshPropertiesVals;
