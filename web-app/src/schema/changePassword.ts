import * as Yup from 'yup';

export const ChangePasswordSchema = Yup.object().shape({
  password: Yup.string().matches(
    /^((?=.*[a-zA-Z])(?=.*[!@#$%^&*()\-_=+{};:,<.>])(?=.*[0-9]))[a-zA-Z0-9!@#$%^&*()\-_=+{};:,<.>]{8,}$/,
    '영문, 숫자, 특수기호 포함 8자리 이상이어야 합니다.',
  ),
  newPassword: Yup.string().matches(
    /^((?=.*[a-zA-Z])(?=.*[!@#$%^&*()\-_=+{};:,<.>])(?=.*[0-9]))[a-zA-Z0-9!@#$%^&*()\-_=+{};:,<.>]{8,}$/,
    '영문, 숫자, 특수기호 포함 8자리 이상이어야 합니다.',
  ),
  confirmPassword: Yup.string().oneOf([Yup.ref('newPassword'), ''], '비밀번호가 일치하지 않습니다.'),
});
