import React, { useState, useEffect } from "react";

interface useSetShimmerProps {
  thisItemIdBeingEdited: number;
  previousCurrency: string;
  selectedCurrency: string;
  previousOrderBy: string;
  orderByThisColumn: string;
}

const shimmerSetFunction = (props: useSetShimmerProps) => {
  if (props.thisItemIdBeingEdited !== 0) {
    return props.thisItemIdBeingEdited;
  } else if (
    props.previousCurrency !== props.selectedCurrency &&
    props.previousOrderBy === props.orderByThisColumn
  ) {
    return "all";
  } else {
    return "";
  }
};

export default function useSetShimmer(props: useSetShimmerProps) {
  const [shimmerState, setshimmerState] = useState<string | number>("");

  useEffect(() => {
    setshimmerState(() => shimmerSetFunction(props));
  }, [props]);

  return [shimmerState, setshimmerState];
}
