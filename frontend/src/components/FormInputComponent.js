import React from 'react';
import PropTypes from 'prop-types';
import './FormInputComponent.css';

function FormInputComponent({
  name, type, placeholder, onChange,
}) {
  return (
    <div className="formComponent">
      <h1 className="header">{name}</h1>
      <input className="input" data-testid="form-input-pennID" id={name} name={name} type={type} placeholder={placeholder} onChange={onChange} />
    </div>
  );
}

export default FormInputComponent;

FormInputComponent.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
