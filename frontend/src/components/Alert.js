import { React, useState } from 'react';
import PropTypes from 'prop-types';
import { ReactComponent as ErrorIcon } from '../icons/error-icon.svg';
import './Alert.css';

/**
 * A toast to display error messages
 * @param {*} message the error message to display
 * @param {*} setShowAlert a mutator function of lifted state 'showAlert'. After
 * the alert is closed, the state is set to false.
 * @returns the alert component
 */
function Alert({ message, setShowAlert }) {
  const [show, setShow] = useState(true);

  return (
    <div className="toast-container position-fixed bottom-0 end-0 p-3">
      <div className={`toast fade ${show ? 'show' : 'hide'}`} role="alert" aria-live="assertive" aria-atomic="true">
        <div className="toast-header">
          <ErrorIcon className="rounded me-2 alert-error-icon" />
          <strong className="me-auto">PennXchange</strong>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="toast"
            aria-label="Close"
            data-testid="close-alert"
            onClick={() => { setShow(false); setShowAlert(false); }}
          />
        </div>
        <div className="toast-body alert-toast-message">{message}</div>
      </div>
    </div>
  );
}

Alert.propTypes = {
  message: PropTypes.string.isRequired,
  setShowAlert: PropTypes.func.isRequired,
};

export default Alert;
