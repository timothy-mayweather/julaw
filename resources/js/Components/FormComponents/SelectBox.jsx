import React from 'react';

const SelectBox = ({name, value, handleChange, checked}) => {
  return (<input
      type="checkbox"
      name={name??"select"}
      value={value}
      onChange={(e) => handleChange(e)}
      checked={checked}
    />
  );
};

export default SelectBox;
