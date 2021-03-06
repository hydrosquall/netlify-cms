import React, { PropTypes } from 'react';
import classnames from 'classnames';
import { Icon } from '../../../../UI';
import styles from './ToolbarButton.css';

const ToolbarButton = ({ label, icon, action, active, disabled }) => (
  <button
    className={classnames(styles.button, { [styles.active]: active })}
    onClick={action}
    title={label}
    disabled={disabled}
  >
    { icon ? <Icon type={icon} /> : label }
  </button>
);

ToolbarButton.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.string,
  action: PropTypes.func.isRequired,
  active: PropTypes.bool,
};

export default ToolbarButton;
