import * as Yup from 'yup';

export const emptyInvestment: any = {
  invest_id: '', //투자 아이디
  title: '', // 투자 제목
  invest_time: '', // 투자개월
  recruitment_amount: '', // 총 모집 금액
  profit: 0, // 투자 이율
  won_per_account: 0, // 1개 구좌당 금액
  max_invest: 0, // 총 구좌수
  thumbnail1: null, // 썸네일 이미지1
  thumbnail2: null, // 썸네일 이미지2
  thumbnail3: null, // 썸네일 이미지3
  panel_image: null, // 상단 패널(배경) 이미지
  product_appeal1: '', // 상품 어필1
  product_appeal2: '', // 상품 어필2
  product_appeal3: '', // 상품 어필3
  expected_schedule_image: null, // 예산일정 이미지
  detailInfo0: '',
  detailInfo1: '',
  detailInfo2: '',
  detailInfo3: '',
  detailInfo4: '',
  detailInfo5: '',
  detailInfo6: '',
  detailInfo7: '',
  detailInfo8: '',
  detailInfo9: '',
  detailInfo10: '', //  주요사항 Json
  latitude: 0, // 위도
  longitude: 0, // 경도
  detailSummary0: '',
  detailSummary1: '',
  detailSummary2: '',
  detailSummary3: '',
  detailSummary4: '',
  detailSummary5: '',
  detailSummary6: '', // 사업개요 Json
  detailSales0: '',
  detailSales1: '',
  detailSales2: '',
  detailSales3: '',
  detailSales4: '',
  detailSales5: '', // 예상수지분석 Json 지출금약
  detailSpending0: '',
  detailSpending1: '',
  detailSpending2: '',
  detailSpending3: '',
  detailSpending4: '',
  detailSpending5: '',
  detailSpending6: '',
  detailSpending7: '',
  detailSpending8: '',
  detailSpending9: '',
  detailSpending10: '',
  detailSpending11: '',
  detailSpending12: '', // 예상수지분석 Json 매출액 / 지출금액
  floor_plan_image: null, // 평면도 이미지
  perspective_drawing_image1: null, // 투시도 / 사진 이미지1
  perspective_drawing_image2: null, // 투시도 / 사진 이미지2
  perspective_drawing_image3: null, // 투시도 / 사진 이미지3
  related_trust_company: '', // 신탁사
  related_appraisal: '', // 감정평가
  related_accounting: '', // 회계법인
  related_legal_affairs: '', // 법무법인
  document1: null, // 프로젝트 서류1
  document2: null, // 프로젝트 서류2
  document3: null, // 프로젝트 서류3
  document4: null, // 프로젝트 서류4
  document5: null, // 프로젝트 서류5
  start_date: new Date(), // 시작일
  end_date: new Date(), // 종료일
  status: '결성', // 모집상태
  business_type: 'LH', // 사업타입
  account_holder: '', //예금주
  bank_name: '', //은행명
  bank_account: '', //은행계좌
};

export const NewInvestmentSchema = Yup.object().shape({
  invest_id: Yup.string().required('투자 아이디를 입력해주세요'),
  title: Yup.string().required('제목을 입력해주세요'),
  // invest_time: Yup.string().required('프로젝트 기간을 입력해주세요'),
  // recruitment_amount: Yup.string().required('모집금액을 입력해주세요'),
  // profit: Yup.number().min(0, '이익률은 최소 0 이상을 입력해주세요.').required('이익율을 입력해주세요'),
  won_per_account: Yup.number()
    .min(1, '구좌당 금액은 최소 1 이상을 입력해주세요')
    .required('구좌당 금액을 입력해주세요'),
  max_invest: Yup.number()
    .min(0, '최대 프로젝트 수량은 최소 0 이상을 입력해주세요.')
    .required('최대 프로젝트 수량을 입력해주세요'),
  thumbnail1: Yup.mixed(),
  thumbnail2: Yup.mixed(),
  thumbnail3: Yup.mixed(),
  panel_image: Yup.mixed(),
  product_appeal1: Yup.mixed(),
  product_appeal2: Yup.mixed(),
  product_appeal3: Yup.mixed(),
  detailInfo0: Yup.mixed(),
  detailInfo1: Yup.mixed(),
  detailInfo2: Yup.mixed(),
  detailInfo3: Yup.mixed(),
  detailInfo4: Yup.mixed(),
  detailInfo5: Yup.mixed(),
  detailInfo6: Yup.mixed(),
  detailInfo7: Yup.mixed(),
  detailInfo8: Yup.mixed(),
  detailInfo9: Yup.mixed(),
  detailInfo10: Yup.mixed(),
  latitude: Yup.number(),
  longitude: Yup.number(),
  detailSummary0: Yup.mixed(),
  detailSummary1: Yup.mixed(),
  detailSummary2: Yup.mixed(),
  detailSummary3: Yup.mixed(),
  detailSummary4: Yup.mixed(),
  detailSummary5: Yup.mixed(),
  detailSummary6: Yup.mixed(),
  detailSummary7: Yup.mixed(),
  detailSummary8: Yup.mixed(),
  detailSales0: Yup.mixed(),
  detailSales1: Yup.mixed(),
  detailSales2: Yup.mixed(),
  detailSales3: Yup.mixed(),
  detailSales4: Yup.mixed(),
  detailSales5: Yup.mixed(),
  detailSpending0: Yup.mixed(),
  detailSpending1: Yup.mixed(),
  detailSpending2: Yup.mixed(),
  detailSpending3: Yup.mixed(),
  detailSpending4: Yup.mixed(),
  detailSpending5: Yup.mixed(),
  detailSpending6: Yup.mixed(),
  detailSpending7: Yup.mixed(),
  detailSpending8: Yup.mixed(),
  detailSpending9: Yup.mixed(),
  detailSpending10: Yup.mixed(),
  detailSpending11: Yup.mixed(),
  detailSpending12: Yup.mixed(),
  floor_plan_image: Yup.mixed(),
  perspective_drawing_image1: Yup.mixed(),
  perspective_drawing_image2: Yup.mixed(),
  perspective_drawing_image3: Yup.mixed(),
  related_trust_company: Yup.mixed(),
  related_appraisal: Yup.mixed(),
  related_accounting: Yup.mixed(),
  related_legal_affairs: Yup.mixed(),
  document1: Yup.mixed(),
  document2: Yup.mixed(),
  document3: Yup.mixed(),
  document4: Yup.mixed(),
  document5: Yup.mixed(),
  start_date: Yup.date().required('시작일을 입력해주세요'),
  end_date: Yup.date()
    .required('종료일을 입력해주세요')
    .min(Yup.ref('start_date'), '종료일은 시작일보다 빠를 수 없습니다.'),
  status: Yup.mixed().required('프로젝트 상태를 입력해주세요.'),
  address: Yup.mixed(),
  business_type: Yup.mixed().required('투자 타입을 선택해주세요'),
  account_holder: Yup.mixed().required('예금주를 입력해주세여'),
  bank_name: Yup.mixed().required('은행명을 입력해주세여'),
  bank_account: Yup.mixed().required('계좌번호를 입력해주세요'),
});

export const initFile = {
  thumbnail1: null, // 썸네일 이미지1
  thumbnail2: null, // 썸네일 이미지2
  thumbnail3: null, // 썸네일 이미지3
  panel_image: null, // 상단 패널(배경) 이미지
  expected_schedule_image: null, // 예산일정 이미지
  floor_plan_image: null, // 평면도 이미지
  perspective_drawing_image1: null, // 투시도 이미지1
  perspective_drawing_image2: null, // 투시도 이미지2
  perspective_drawing_image3: null, // 투시도 이미지3
  document1: null, // 프로젝트 서류1
  document2: null, // 프로젝트 서류2
  document3: null, // 프로젝트 서류3
  document4: null, // 프로젝트 서류4
  document5: null, // 프로젝트 서류5
};
