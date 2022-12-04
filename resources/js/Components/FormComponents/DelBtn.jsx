import React from 'react';

const DelBtn = ({row, handleDelete}) => {
  return (
    <button
      type="button"
      className="btn btn-outline-danger footbtn"
      onClick={handleDelete}
      data-row={row}>
      <i className="fas fa-trash-alt" title="Delete Row"></i>
    </button>
  );
};

export default DelBtn;
