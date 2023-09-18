import { FieldProps } from 'formik';
import React, { createRef } from 'react';
import { InputText } from 'primereact/inputtext';

import './InputTextField.scss';

interface Props extends FieldProps {
  type: string;
  unit?: string;
  label?: string;
  setInputValue?: (t: number) => void;
  tooltip?: string;
  icon?: any;
  onChange?: (e: any) => void;
  onClick?: (e: any) => void;
}

export default function InputTextField({
  field,
  form: { touched, errors, setFieldValue },
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
    <div className="form-control inputtext-field">
      <div className="p-inputgroup">
        {label && <span className="input-label">{label}</span>}
        {icon && <img className="start-icon" src={icon} alt="" />}
        <InputText
          {...field}
          {...props}
          type={type || 'text'}
          onClick={handleClickInput}
          onChange={handleInput}
          ref={inputRef}
        />
      </div>
      {touched[field.name] && errors[field.name] && <div className="input-feedback">{errors[field.name]}</div>}
    </div>
  );
}
