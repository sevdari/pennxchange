import React from 'react';
import PropTypes from 'prop-types';
import './CredentialWarningComponent.css';
import { ReactComponent as Close } from '../icons/Close.svg';

function CredentialWarningComponent({
  credential,
  setCredential,
  text,
}) {
  return (
    <div className="alert" data-testid="credential-div">
      <p className="creds" id="credential-id" data-testid="credential-p">{text}</p>
      <Close className="icon" onClick={() => { setCredential(!credential); }} />
    </div>
  );
}

export default CredentialWarningComponent;

CredentialWarningComponent.propTypes = {
  credential: PropTypes.bool.isRequired,
  setCredential: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};
