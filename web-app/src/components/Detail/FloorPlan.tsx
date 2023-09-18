import React from 'react';

interface FloorPlanPropsType {
  floorPlanUrl: string;
}

const FloorPlan = ({ floorPlanUrl }: FloorPlanPropsType) => {
  return (
    <div className="product-content">
      <h2 className="product-content__title">평면도</h2>
      <img src={`${process.env.REACT_APP_DOCUMENT_API_URL}/content?filename=${floorPlanUrl}`} alt="평면도" />
    </div>
  );
};

export default FloorPlan;
