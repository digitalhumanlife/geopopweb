import * as Yup from 'yup';

export const BusinessUserInfoSchema = Yup.object().shape({
  user_id: Yup.string().required('Required'),
  name: Yup.string().required('이름을 입력해주세요'),
  birth: Yup.date().required('생년월일을 입력해주세요'),
  gender: Yup.string().required('성별을 선택해주세요'),
  email: Yup.string().matches(/^[a-zA-Z0-9+-_.]+$/, '이메일 형식이 올바르지 않습니다.'),
  domain: Yup.string().matches(/[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, '이메일 형식이 올바르지 않습니다.'),
  phone: Yup.string().required('휴대폰 번호를 입력해주세요'),
  company_name: Yup.string(),
  address_detail: Yup.string(),
  business_number: Yup.string(),
  file: Yup.string(),
});

export const IndividualUserInfoSchema = Yup.object().shape({
  user_id: Yup.string().required('Required'),
  name: Yup.string().required('이름을 입력해주세요'),
  birth: Yup.date().required('생년월일을 입력해주세요'),
  gender: Yup.string().required('성별을 선택해주세요'),
  email: Yup.string().matches(/^[a-zA-Z0-9+-_.]+$/, '이메일 형식이 올바르지 않습니다.'),
  domain: Yup.string().matches(/[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, '이메일 형식이 올바르지 않습니다.'),
  phone: Yup.string().required('휴대폰 번호를 입력해주세요'),
});
