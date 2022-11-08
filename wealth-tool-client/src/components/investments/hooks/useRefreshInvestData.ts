import { AxiosResponse } from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { investmentsAPIData } from "../../../../../types/typeInterfaces";
import { getInvestmentData } from "../../../modules/serverRequests";

interface useRefreshInvestDataProps {
  thisItemIdBeingEdited: number;
  selectedCurrencyCode: string;
  orderByThisColumn: string;
  entryIDWasDeleted?: number;
  itemIDWasAdded?: number;
}

const useRefreshInvestData = (props: useRefreshInvestDataProps) => {
  const [investmentAPIData, setinvestmentAPIData] =
    useState<Array<investmentsAPIData>>();

  const refreshInvestmentsDataFromDB = useCallback(async () => {
    const investData: AxiosResponse<any, any> | undefined =
      await getInvestmentData(
        props.selectedCurrencyCode,
        props.orderByThisColumn
      );

    if (
      investData !== undefined &&
      investData.status === 200 &&
      investData.data !== undefined
    ) {
      setinvestmentAPIData(investData.data);
    }
  }, [props.selectedCurrencyCode, props.orderByThisColumn]);

  useEffect(() => {
    refreshInvestmentsDataFromDB();
  }, [
    refreshInvestmentsDataFromDB,
    props.thisItemIdBeingEdited,
    props.selectedCurrencyCode,
    props.orderByThisColumn,
    props.entryIDWasDeleted,
    props.itemIDWasAdded,
  ]);
  return investmentAPIData;
};

export default useRefreshInvestData;
