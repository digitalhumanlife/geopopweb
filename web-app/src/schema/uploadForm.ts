import * as Yup from 'yup';

export const UploadFormSchema = Yup.object().shape({
  address: Yup.string().required('Address is required'),
  name: Yup.string().required('Name is required'),
  amount: Yup.number().required('Amount is required').min(0),
  doc1: Yup.mixed().required('Doc 1 is required'),
  doc2: Yup.mixed().required('Doc 2 is required'),
  doc3: Yup.mixed().required('Doc 3 is required'),
  doc4: Yup.mixed().required('Doc 4 is required'),
});
