import * as Yup from 'yup';

export const SecessionSchema = Yup.object().shape({
  password: Yup.string().required('비밀번호를 입력해주세요'),
});
