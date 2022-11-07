import React, { useCallback, useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { cashAccountAPIData } from "../../../../types/typeInterfaces";
import { getCashAccountData } from "../../modules/serverRequests";

interface useGetCashAccountBalancesProps {
  thisItemIdBeingEdited: number;
  selectedCurrencyCode: string;
  orderByThisColumn: string;
  entryIDWasDeleted?: number;
  itemIDWasAdded?: number;
}

const useGetCashAccountBalances = (props: useGetCashAccountBalancesProps) => {
  const [cashAccAPIData, setcashAccAPIData] =
    useState<Array<cashAccountAPIData>>();

  const getAllAccountBalances = useCallback(async () => {
    const cashAccServerDataRequest: AxiosResponse<any, any> | undefined =
      await getCashAccountData(
        props.selectedCurrencyCode,
        props.orderByThisColumn
      );
    if (
      cashAccServerDataRequest !== undefined &&
      cashAccServerDataRequest.status === 200 &&
      cashAccServerDataRequest.data !== undefined
    ) {
      setcashAccAPIData(cashAccServerDataRequest.data);
    }
  }, [props.selectedCurrencyCode, props.orderByThisColumn]);

  useEffect(() => {
    getAllAccountBalances();
  }, [
    getAllAccountBalances,
    props.thisItemIdBeingEdited,
    props.selectedCurrencyCode,
    props.orderByThisColumn,
    props.entryIDWasDeleted,
    props.itemIDWasAdded,
  ]);

  return cashAccAPIData;
};

export default useGetCashAccountBalances;
