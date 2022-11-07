import React, { useCallback, useEffect, useState } from "react";
import { propertiesAPIData } from "../../../../../types/typeInterfaces";
import { getNetPropertyTotal } from "../../../modules/serverRequests";

interface useUpdateNetPropTotalProps {
  previousOrderBy: string;
  thisItemIdBeingEdited: number;
  selectedCurrencyCode: string;
  orderByThisColumn: string;
  entryIDWasDeleted?: number;
  itemIDWasAdded?: number;
  propertyAccAPIData: propertiesAPIData[] | undefined;
}

const useUpdateNetPropTotal = (props: useUpdateNetPropTotalProps) => {
  const [netTotalPropValue, setnetTotalPropValue] = useState<
    number | undefined
  >(0);

  const refreshNetTotal = useCallback(async () => {
    setnetTotalPropValue(undefined);
    const total = await getNetPropertyTotal(props.selectedCurrencyCode);
    setnetTotalPropValue(total);
  }, [props.selectedCurrencyCode]);

  useEffect(() => {
    refreshNetTotal();
  }, [refreshNetTotal, props.entryIDWasDeleted, props.itemIDWasAdded]);

  return netTotalPropValue;
};

export default useUpdateNetPropTotal;
