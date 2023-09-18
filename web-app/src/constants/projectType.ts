export interface TypeOptionsType {
  label: string;
  value: string;
}

export const typeOptions: TypeOptionsType[] = [
  { label: 'LH 민간주택 매입약정사업', value: 'LH' },
  { label: '일반사업(분양형)', value: '분양' },
  { label: '일반사업(임대형)', value: '임대' },
  { label: '부동산매입사업', value: '부동산' },
];

export const statusOptions: TypeOptionsType[] = [
  { label: '결성중', value: '결성' },
  { label: '토지매매계약', value: '토지매매계약' },
  { label: '세부계획결정', value: '세부계획결정' },
  { label: '착공', value: '착공' },
  { label: '준공', value: '준공' },
  { label: '매매 / 해산', value: '매매 / 해산' },
];

export const statusLandOptions: TypeOptionsType[] = [
  { label: '결성중', value: '결성' },
  { label: '매매계약', value: '토지매매계약' },
  { label: '임대', value: '임대' },
  { label: '매매 / 해산', value: '매매 / 해산' },
];

export const statusRentalOptions: TypeOptionsType[] = [
  { label: '결성중', value: '결성' },
  { label: '토지매매계약', value: '토지매매계약' },
  { label: '세부계획결정', value: '세부계획결정' },
  { label: '착공', value: '착공' },
  { label: '준공', value: '준공' },
  { label: '임대', value: '임대' },
  { label: '매매 / 해산', value: '매매 / 해산' },
];
