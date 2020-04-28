import React from "react";
import PropTypes from "prop-types";

import "./Button.scss";

import cx from "classnames";

function Button({ label, onClick, type, className, inline }) {
  const computedClassName = cx("button", className, {
    primary: type === "primary",
    secondary: type === "secondary",
    disabled: type === "disabled",
    inline,
  });
  const buttonProps = {
    className: computedClassName,
  };

  if (onClick && type !== "disabled") {
    buttonProps.onClick = onClick;
  }

  return <button {...buttonProps}>{label}</button>;
}

Button.defaultProps = {
  type: "disabled",
  label: "CHANGE ME",
  inline: false,
};

Button.propTypes = {
  label: PropTypes.string,
  type: PropTypes.oneOf(["primary", "secondary", "disabled"]),
  onClick: PropTypes.func,
  className: PropTypes.string,
  inline: PropTypes.bool,
};

export default Button;
