import React, { useContext } from "react";
import "./ViewCardCascadeTitleRow.css";
import { useAssetCountContext } from "../../modules/Contexts";

interface ViewCardCascadeTitleRowProps {
  sectionTitle: string;
  showIfNoAssets: boolean;
}

const ViewCardCascadeTitleRow: React.FC<ViewCardCascadeTitleRowProps> = ({
  sectionTitle,
  showIfNoAssets,
}) => {
  const assetCount = useContext(useAssetCountContext);

  if (assetCount.totalAssetCount === 0 && showIfNoAssets === false) return null;

  return <h2 className="ViewCardCascadeTitle">{sectionTitle}</h2>;
};

export default ViewCardCascadeTitleRow;
