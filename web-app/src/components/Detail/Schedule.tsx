import React from 'react';

interface SchedulePropsType {
  url: any;
}

const Schedule = ({ url }: SchedulePropsType) => {
  return (
    <div className="product-content">
      <h2 className="product-content__title">예상일정</h2>
      <div className="product-content__schedule">
        <img src={`${process.env.REACT_APP_DOCUMENT_API_URL}/content?filename=${url}`} alt="예상일정" />
      </div>
    </div>
  );
};

export default Schedule;
