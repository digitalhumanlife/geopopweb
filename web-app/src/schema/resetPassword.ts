import * as Yup from 'yup';

export const ResetPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .max(50, 'Email Address must not exceed 50 characters')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must have from 6 to 50 characters')
    .max(50, 'Password must have from 6 to 50 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), ''], 'Passwords must match')
    .required('Password confirm is required'),
});
