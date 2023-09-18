export const isChecked = (name: string) => {
  return document.querySelector(`input[name=${name}]:checked`)?.attributes.getNamedItem('value')?.value === 'yes';
};
