import React, { useEffect, useRef } from 'react';

export default function TextInput(
  {
    type = 'text',
    name,
    value,
    className = "",
    autoComplete,
    required,
    isFocused,
    handleChange,
  }) {

  const input = useRef();

  useEffect(() => {
    if (isFocused) {
      input.current.focus();
    }
  }, []);

  return (
      <input
        type={type}
        name={name}
        value={value}
        className={
          `form-control ` +
          className
        }
        ref={input}
        autoComplete={autoComplete}
        required={required}
        onChange={(e) => handleChange(e)}
      />
  );
}
