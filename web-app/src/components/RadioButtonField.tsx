import { FieldProps } from 'formik';
import { RadioButton } from 'primereact/radiobutton';
import React, { useEffect, useState } from 'react';
import { get } from 'lodash';

import './RadioButtonField.scss';

interface Props extends FieldProps {
  className: string;
  options: any[];
  onValueChange?: (t: number) => void;
}

export default function RadioButtonField({
  field,
  form: { touched, errors, setFieldValue },
  onValueChange,
  ...props
}: Props) {
  const [selectedValue, setSelectedValue] = useState<any>(field.value || '');

  const handleOnChange = (e: any) => {
    setFieldValue(field.name, e.value);
  };

  const isInvalid = () => {
    if (!field.name.includes('.')) {
      return touched[field.name] && errors[field.name];
    } else {
      return get(errors, field.name);
    }
  };

  useEffect(() => {
    if (onValueChange) {
      onValueChange(selectedValue);
    }
  }, [selectedValue]);

  useEffect(() => {
    setSelectedValue(field.value);
  }, [field.value]);

  return (
    <div className={`radio-button-field ${props.className || ''}`}>
      {props.options.map((item: any, index: number) => {
        return (
          <div className="d-inline-flex" key={index}>
            <RadioButton
              {...props}
              inputId={`id-${item.value}`}
              value={item.value}
              checked={selectedValue === item.value}
              onChange={handleOnChange}
            />
            <label className="d-inline" htmlFor={`id-${item.value}`}>
              <p>{item.label}</p>
            </label>
          </div>
        );
      })}
      {isInvalid() && <div className="input-feedback">{get(errors, field.name)}</div>}
    </div>
  );
}
