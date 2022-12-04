import React from 'react';

const CheckBox = (
  {
    name,
    className="",
    checked=true,
    handleChange,
    row,
    dataId
  }) => {

  return (
    <span  className={"form-switch"} style={{display: "table", width: "100%"}}>
      <input
        type="checkbox"
        name={name}
        className={"form-check-input "+className}
        defaultChecked={checked}
        onChange={handleChange}
        data-row={row}
        data-id={dataId}
        data-old-value={checked?'Yes':'No'}
      />
    </span>
  );
};

export default CheckBox;
