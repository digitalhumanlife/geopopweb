import * as Yup from 'yup';

export const QnASchema = Yup.object().shape({
  name: Yup.string().required('이름을 입력해주세요.'),
  email: Yup.string().matches(/^[a-zA-Z0-9+-_.]+$/, '이메일 형식이 올바르지 않습니다.'),
  domain: Yup.string().matches(/[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, '이메일 형식이 올바르지 않습니다.'),
  phone: Yup.string()
    .required('전화번호를 입력해주세요.')
    .matches(/^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/, '휴대폰 번호 형식이 올바르지 않습니다.'),
  title: Yup.string().required('제목을 입력해주세요.'),
  content: Yup.string().required('내용을 입력해주세요.'),
});
