import { FieldProps } from 'formik';
import { FileUpload } from 'primereact/fileupload';
import React, { useEffect, useRef, useState } from 'react';

import './FileUploadField.scss';

interface Props extends FieldProps {
  uploadConfig: any;
  className?: any;
  ref?: any;
  chooseLabel?: string;
  onValueChange?: (t: number) => void;
}

export default function FileUploadField({
  field,
  form: { touched, errors, setFieldValue },
  onValueChange,
  ...props
}: Props) {
  const [selectedValue, setSelectedValue] = useState<any>(field.value || '');

  const inputRef = useRef<any>(null);

  const handleOnChange = (e: any) => {
    let file = e.files[0];
    setFieldValue(field.name, file);
  };

  const handleRemove = () => {
    setFieldValue(field.name, '');
  };

  const handleClear = () => {};
  useEffect(() => {
    if (onValueChange) {
      onValueChange(selectedValue);
    }
  }, [selectedValue]);
  useEffect(() => {
    setSelectedValue(field.value);
  }, [field.value]);

  return (
    <div className={`fileupload-field ${props.className || ''}`}>
      <FileUpload
        {...props.uploadConfig}
        ref={inputRef}
        chooseLabel={props.chooseLabel}
        multiple={false}
        onBeforeUpload={handleClear}
        onSelect={handleOnChange}
        onRemove={handleRemove}
      />
      {touched[field.name] && errors[field.name] && <div className="input-feedback">{errors[field.name]}</div>}
    </div>
  );
}
