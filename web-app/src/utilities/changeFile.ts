export const toFile = async (filename: string) => {
  if (filename === null || filename === 'null') {
    return null;
  }
  const API_URL = process.env.REACT_APP_DOCUMENT_API_URL;
  const FULL_URL = `${API_URL}/content?filename=${filename}`;
  const res = await fetch(FULL_URL);
  const blob = await res.blob();

  return new File([blob], filename, { type: blob.type });
};
