import React from 'react';
import { FieldProps } from 'formik';
import { get } from 'lodash';
import { Checkbox } from 'primereact/checkbox';

interface Props extends FieldProps {
  label?: string;
  inputId?: string;
  onChange?: (e: any) => void;
}

export default function CheckboxField({ field, form: { touched, errors, setFieldValue }, ...props }: Props) {
  const handleChange = (e: any) => {
    setFieldValue(field.name, e.checked);
    if (props.onChange) {
      props.onChange(e);
    }
  };

  const isInvalid = () => {
    if (!field.name.includes('.')) {
      return touched[field.name] && errors[field.name];
    } else {
      return get(errors, field.name);
    }
  };

  return (
    <div className="checkbox-field">
      <div>
        <Checkbox inputId={props.inputId || ''} name={field.name} onChange={handleChange} checked={field.value} />
        {props.label && (
          <label className="ml-10 d-inline" htmlFor={props.inputId || ''}>
            {props.label}
          </label>
        )}
      </div>
      {isInvalid() && <div className="input-feedback text-left">{get(errors, field.name)}</div>}
    </div>
  );
}
