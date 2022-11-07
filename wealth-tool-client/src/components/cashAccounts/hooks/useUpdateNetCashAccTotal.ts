import React, { useCallback, useEffect, useState } from "react";
import { cashAccountAPIData } from "../../../../../types/typeInterfaces";
import { getNetCashAccountTotal } from "../../../modules/serverRequests";

interface useUpdateNetCashAccTotalProps {
  previousOrderBy: string;
  thisItemIdBeingEdited: number;
  selectedCurrencyCode: string;
  orderByThisColumn: string;
  entryIDWasDeleted?: number;
  itemIDWasAdded?: number;
  cashAccAPIData: cashAccountAPIData[] | undefined;
}

const useUpdateNetCashAccTotal = (props: useUpdateNetCashAccTotalProps) => {
  const [cashAccountNetTotal, setcashAccountNetTotal] = useState<
    number | undefined
  >(0);

  const updateNetCashAccountTotal = useCallback(async () => {
    if (props.thisItemIdBeingEdited === 0) {
      setcashAccountNetTotal(undefined);
      const total = await getNetCashAccountTotal(props.selectedCurrencyCode);
      setcashAccountNetTotal(total);
    }
  }, [props.selectedCurrencyCode, props.thisItemIdBeingEdited]);

  useEffect(() => {
    updateNetCashAccountTotal();
  }, [
    updateNetCashAccountTotal,
    props.entryIDWasDeleted,
    props.itemIDWasAdded,
  ]);

  return cashAccountNetTotal;
};

export default useUpdateNetCashAccTotal;
