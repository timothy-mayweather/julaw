import React from "react";

const Select = (
  {
    className="",
    required=true,
    value,
    name,
    valueName,
    handleMouseDown,
    handleChange,
    row,
    dataId,
    dataResource,
    dataUrl,
    dataChange,
    children
  }) => {

  return (
    <select
      className={"form-control form-select custom-select "+className}
      name={name}
      onMouseDown={handleMouseDown}
      onChange={handleChange}
      defaultValue={value}
      data-id={dataId}
      data-row={row}
      data-old-value={value}
      data-value-name={valueName}
      data-resource={dataResource}
      data-url={dataUrl}
      data-change={dataChange}
      required={required}
      >
      {children}
    </select>
  );
}

export default Select;
