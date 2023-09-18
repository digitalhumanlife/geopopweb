import * as Yup from 'yup';

export const NewVoteSchema = Yup.object().shape({
  title: Yup.string().required('제목을 입력해주세요.'),
  content: Yup.string().required('내용을 입력해주세요.'),
  file: Yup.mixed(),
});
