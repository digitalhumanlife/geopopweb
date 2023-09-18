import * as Yup from 'yup';

export const RegisterCorporateSchema = Yup.object().shape({
  user_id: Yup.string().matches(
    /^((?=.*[a-zA-Z])(?=.*[0-9]))[a-zA-Z0-9]{6,}$/,
    '영문 대, 소문자, 숫자 조합 6자리 이상 입력해주세요',
  ),
  password: Yup.string().matches(
    /^((?=.*[a-zA-Z])(?=.*[!@#$%^&*()\-_=+{};:,<.>])(?=.*[0-9]))[a-zA-Z0-9!@#$%^&*()\-_=+{};:,<.>]{8,}$/,
    '영문, 숫자, 특수기호 포함 8자리 이상이어야 합니다.',
  ),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), ''], '비밀번호가 일치하지 않습니다.'),
  name: Yup.string(),
  phone1: Yup.string(),
  phone2: Yup.string(),
  phone3: Yup.string(),
  email: Yup.string().matches(/^[a-zA-Z0-9+\-_\.]+$/, '이메일 형식이 올바르지 않습니다.'),
  domain: Yup.string().matches(/[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, '이메일 형식이 올바르지 않습니다.'),
  company_name: Yup.string(),
  address_detail: Yup.string(),
  business_number: Yup.string(),
  file: Yup.string(),
});

export const RegisterIndividualSchema = Yup.object().shape({
  user_id: Yup.string().matches(
    /^((?=.*[a-zA-Z])(?=.*[0-9]))[a-zA-Z0-9]{6,}$/,
    '영문 대, 소문자, 숫자 조합 6자리 이상 입력해주세요',
  ),
  password: Yup.string().matches(
    /^((?=.*[a-zA-Z])(?=.*[!@#$%^&*()\-_=+{};:,<.>])(?=.*[0-9]))[a-zA-Z0-9!@#$%^&*()\-_=+{};:,<.>]{8,}$/,
    '영문, 숫자, 특수기호 포함 8자리 이상이어야 합니다.',
  ),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), ''], '비밀번호가 일치하지 않습니다.'),
  name: Yup.string(),
  phone1: Yup.string(),
  phone2: Yup.string(),
  phone3: Yup.string(),
  email: Yup.string().matches(/^[a-zA-Z0-9+\-_\.]+$/, '이메일 형식이 올바르지 않습니다.'),
  domain: Yup.string().matches(/[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, '이메일 형식이 올바르지 않습니다.'),
  address_detail: Yup.string(),
  birth: Yup.date().required('생년월일을 입력해주세요.'),
  gender: Yup.string().required('성별을 선택해주세요.'),
});
