import React from "react";

export default function LoaderButton({
  isLoading,
  type = "button",
  className = "btn-primary",
  disabled = false,
  ...props
}) {
  return (
    <button type={type}
      className={`btn ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span>}
      {props.children}
    </button>
  );
}