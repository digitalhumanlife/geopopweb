export const getProductAppeal = (values: any) => {
  const { appealContent1, appealContent2, appealContent3 } = values;

  return { first: appealContent1, second: appealContent2, third: appealContent3 };
};

export const getBusinessInformation = (values: any) => {
  const {
    detailInfo0,
    detailInfo1,
    detailInfo2,
    detailInfo3,
    detailInfo4,
    detailInfo5,
    detailInfo6,
    detailInfo7,
    detailInfo8,
    detailInfo9,
    detailInfo10,
  } = values;
  return {
    code: detailInfo0,
    fund: detailInfo1,
    period: detailInfo2,
    accounts: detailInfo3,
    endPoint: detailInfo4,
    purpose: detailInfo5,
    appraisal: detailInfo6,
    startParticipate: detailInfo7,
    expenditure: detailInfo8,
    endParticipate: detailInfo9,
    salesPurpose: detailInfo10,
  };
};

export const getBusinessOverview = (values: any) => {
  const {
    detailSummary0,
    detailSummary1,
    detailSummary2,
    detailSummary3,
    detailSummary4,
    detailSummary5,
    detailSummary6,
  } = values;
  return {
    location: detailSummary0,
    area: detailSummary1,
    areaRatio: detailSummary2,
    usage: detailSummary3,
    scale: detailSummary4,
    parkingLot: detailSummary5,
    note: detailSummary6,
  };
};

export const getBusinessAnalysis = (values: any, type: string, salesRow: number) => {
  const { detailSales0, detailSales1, detailSales2, detailSales3, detailSales4, detailSales5, detailSales6 } = values;
  const {
    detailSpending0,
    detailSpending1,
    detailSpending2,
    detailSpending3,
    detailSpending4,
    detailSpending5,
    detailSpending6,
    detailSpending7,
    detailSpending8,
    detailSpending9,
    detailSpending10,
    detailSpending11,
  } = values;
  const salesAnalysis: any = [
    {
      type,
      division: detailSales0,
      sales: detailSales1,
      area: detailSales2,
      pyeongPrice: detailSales3,
      generationPrice: detailSales4,
      generations: detailSales5,
      note: detailSales6,
    },
  ];

  if (!!salesRow) {
    Array(salesRow)
      .fill('')
      .map((_, idx) =>
        salesAnalysis.push({
          division: values[`detailSales0${idx}`],
          sales: values[`detailSales1${idx}`],
          area: values[`detailSales2${idx}`],
          pyeongPrice: values[`detailSales3${idx}`],
          generationPrice: values[`detailSales4${idx}`],
          generations: values[`detailSales5${idx}`],
        }),
      );
  }

  const expenditureAnalysis = {
    landCost: detailSpending0,
    land: detailSpending1,
    constructionCost: detailSpending2,
    construction: detailSpending3,
    designCost: detailSpending4,
    design: detailSpending5,
    taxCost: detailSpending6,
    tax: detailSpending7,
    propelCost: detailSpending8,
    propel: detailSpending9,
    financeCost: detailSpending10,
    finance: detailSpending11,
    totalCost:
      +detailSpending0 + +detailSpending2 + +detailSpending4 + +detailSpending6 + +detailSpending8 + +detailSpending10,
  };

  return { expenditureAnalysis, salesAnalysis };
};
