import { FieldProps } from 'formik';
// import { Calendar } from 'primereact/calendar';
import DatePicker from 'react-date-picker';
import React, { useEffect, useState } from 'react';
import { get } from 'lodash';

import './CalendarField.scss';

interface Props extends FieldProps {
  className: string;
  style: any;
  options?: any[];
  placeholder?: string;
  optionLabel?: string;
  onValueChange?: (t: number) => void;
}

export default function CalendarField({
  field,
  form: { touched, errors, setFieldValue },
  onValueChange,
  ...props
}: Props) {
  const [selectedValue, setSelectedValue] = useState<any>(field.value || '');

  const handleOnChange = (date: any) => {
    setFieldValue(field.name, date);
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
      <DatePicker
        {...props}
        className="w-full"
        //  inputClassName="w-full"
        value={selectedValue}
        onChange={handleOnChange}
      />
      {isInvalid() && <div className="input-feedback">{get(errors, field.name)}</div>}
    </div>
  );
}
