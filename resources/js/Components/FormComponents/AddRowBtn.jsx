import React from 'react';

const AddRowBtn = ({handleAddRow}) => {

  return (<button type="button" title="Add Row" className="btn btn-outline-primary footbtn" onClick={handleAddRow}><i
    className="fas fa-plus"></i></button>);
};

export default AddRowBtn;
