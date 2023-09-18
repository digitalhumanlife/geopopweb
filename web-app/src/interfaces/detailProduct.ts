export interface ExpenditureAnalysisType {
  construction: string;
  constructionCost: string;
  design: string;
  designCost: string;
  finance: string;
  financeCost: string;
  land: string;
  landCost: string;
  propel: string;
  propelCost: string;
  tax: string;
  taxCost: string;
  totalCost: string;
}

export interface SalesAnalysisType {
  area: string;
  division: string;
  generationPrice: string;
  generations: string;
  pyeongPrice: string;
  sales: string;
  type: string;
  note?: string;
}

export interface SalesAmountDataType {
  expenditureAnalysis: ExpenditureAnalysisType;
  salesAnalysis: SalesAnalysisType[];
}
