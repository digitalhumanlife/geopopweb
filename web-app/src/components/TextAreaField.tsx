import { FieldProps } from 'formik';
import React, { createRef } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';

interface Props extends FieldProps {
  type: string;
  unit?: string;
  label?: string;
  containerClass?: string;
  setInputValue?: (t: number) => void;
  tooltip?: string;
  icon?: any;
  onChange?: (e: any) => void;
  onClick?: (e: any) => void;
}

export default function TextAreaField({
  field,
  form: { touched, errors, setFieldValue },
  containerClass,
  label,
  type,
  icon,
  tooltip,
  setInputValue,
  ...props
}: Props) {
  const inputRef: any = createRef();

  const handleInput = (e: any) => {
    setFieldValue(field.name, e.target.value);
    if (props.onChange) {
      props.onChange(e);
    }
  };

  const handleClickInput = (e: any) => {
    if (props.onClick) {
      props.onClick(e);
    }
  };

  return (
    <div className={containerClass || ''}>
      <div className="form-control">
        <div className="p-inputgroup">
          <InputTextarea {...field} {...props} onClick={handleClickInput} onChange={handleInput} ref={inputRef} />
        </div>
      </div>
      {touched[field.name] && errors[field.name] && <div className="input-feedback">{errors[field.name]}</div>}
    </div>
  );
}
