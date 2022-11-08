import React, { useCallback, useEffect, useState } from "react";
import { investmentsAPIData } from "../../../../../types/typeInterfaces";
import { getNetInvestmentTotal } from "../../../modules/serverRequests";

interface useUpdateNetInvestTotalProps {
  previousOrderBy: string;
  thisItemIdBeingEdited: number;
  selectedCurrencyCode: string;
  orderByThisColumn: string;
  entryIDWasDeleted?: number;
  itemIDWasAdded?: number;
  investmentAPIData: investmentsAPIData[] | undefined;
}

const useUpdateNetInvestTotal = (props: useUpdateNetInvestTotalProps) => {
  const [investmentsTotalValue, setInvestmentsTotalValue] = useState<
    number | undefined
  >(0);

  const updateNetInvestmentsTotal = useCallback(async () => {
    if (props.thisItemIdBeingEdited === 0) {
      setInvestmentsTotalValue(undefined);
      const total = await getNetInvestmentTotal(props.selectedCurrencyCode);
      setInvestmentsTotalValue(total);
    }
  }, [props.selectedCurrencyCode, props.thisItemIdBeingEdited]);

  useEffect(() => {
    updateNetInvestmentsTotal();
  }, [
    updateNetInvestmentsTotal,
    props.entryIDWasDeleted,
    props.itemIDWasAdded,
  ]);

  return investmentsTotalValue;
};

export default useUpdateNetInvestTotal;
