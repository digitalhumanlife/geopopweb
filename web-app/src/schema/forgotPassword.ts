import * as Yup from 'yup';

export const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .max(50, 'Email Address must not exceed 50 characters')
    .required('Email is required'),
});
