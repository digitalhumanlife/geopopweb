import * as Yup from 'yup';

export const LoginSchema = Yup.object().shape({
  email: Yup.string().required('아이디를 입력해주세요'),
  password: Yup.string().required('비밀번호를 입력해주세요'),
});
