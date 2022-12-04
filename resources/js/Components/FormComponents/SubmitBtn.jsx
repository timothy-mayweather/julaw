import React from 'react';

const SubmitBtn = ({handleSubmit}) => {
  return <button type="button" className="btn btn-outline-success footbtn" onClick={handleSubmit}><i
    className="fas fa-check" title="Submit"></i></button>
}

export default SubmitBtn;
