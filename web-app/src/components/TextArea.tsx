import { FieldProps } from 'formik';
import React, { createRef, useEffect, useState } from 'react';

import Eye from '../statics/images/gc/eye.svg';
import InfoCircle from '../statics/images/gc/info-circle.svg';

interface Props extends FieldProps {
  type: string;
  unit?: string;
  label?: string;
  containerClass?: string;
  setInputValue?: (t: number) => void;
}

const EyeIcon = ({ onClick }: { onClick: () => void }) => {
  return <img className="icon eye-icon" src={Eye} onClick={onClick} alt="" />;
};

export const InfoCircleIcon = () => {
  return <img className="icon" src={InfoCircle} alt="" />;
};

function TextInput({
  field,
  form: { touched, errors, setFieldValue },
  type,
  unit,
  label,
  containerClass,
  setInputValue,
  ...props
}: Props) {
  let inputHtmlType = type;
  if (type === 'percent') {
    inputHtmlType = 'text';
  }
  const [inputType, setInputType] = useState(inputHtmlType);
  const inputRef: any = createRef();

  const eyeClickHandler = () => {
    if (inputType === 'password') {
      setInputType('text');
    } else {
      setInputType('password');
    }
  };

  const renderEyeIcon = () => {
    return type === 'password' ? <EyeIcon onClick={eyeClickHandler} /> : null;
  };

  const handleInput = (e: any) => {
    setFieldValue(field.name, e.target.value);
    if (setInputValue) {
      setInputValue(e.target.value);
    }
  };

  useEffect(() => {
    if (inputType === 'TwoFACode' && inputRef && inputRef.current) {
      inputRef.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={containerClass || ''}>
      <div className="p-inputgroup">
        {label && <span className="input-label">{label}</span>}
        <textarea {...field} {...props} onChange={handleInput} />
        {touched[field.name] && errors[field.name] ? <InfoCircleIcon /> : renderEyeIcon()}
        {type === 'percent' && <span className="percentage">%</span>}
        {unit && <span className="input-unit">{unit}</span>}
      </div>
      {touched[field.name] && errors[field.name] && <div className="input-feedback">{errors[field.name]}</div>}
    </div>
  );
}

export default TextInput;
