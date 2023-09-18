import { FieldProps } from 'formik';
import { Dropdown } from 'primereact/dropdown';
import React, { useEffect, useState } from 'react';
import { get } from 'lodash';

import './DropdownField.scss';

interface Props extends FieldProps {
  className: string;
  style: any;
  options?: any[];
  placeholder?: string;
  optionLabel?: string;
  onValueChange?: (t: number) => void;
}

export default function DropdownField({
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
    <div className={`form-control dropdown-field ${props.className || ''}`}>
      <Dropdown
        {...props}
        value={selectedValue}
        options={props.options}
        optionLabel={props.optionLabel}
        onChange={handleOnChange}
        style={props.style}
      />
      {isInvalid() && <div className="input-feedback">{get(errors, field.name)}</div>}
    </div>
  );
}
