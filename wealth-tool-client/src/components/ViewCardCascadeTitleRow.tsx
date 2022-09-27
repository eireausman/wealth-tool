import React from "react";
import "./ViewCardCascadeTitleRow.css";

interface ViewCardCascadeTitleRowProps {
  sectionTitle: string;
}

const ViewCardCascadeTitleRow: React.FC<ViewCardCascadeTitleRowProps> = ({
  sectionTitle,
}) => {
  return <h2 className="ViewCardCascadeTitle">{sectionTitle}</h2>;
};

export default ViewCardCascadeTitleRow;
