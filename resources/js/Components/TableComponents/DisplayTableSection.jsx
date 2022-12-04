import React from 'react';

const DisplayTableSection = (
  {context,
    table,
    show,
    data,
    editState,
    setEditState,
    deleteObj,
    updateObj,
    handleChange,
    handleBtnClicks,
    requestSpinner}
  )=>{
  const tableProps = {context, data, deleteObj, show, editState, handleChange}

  return (
    <>
      <button type="button" className="btn btn-outline-success" style={{marginRight:"5px"}} onClick={show}>hide table</button>
      <button type="button" className="btn btn-outline-success" style={{marginRight:"5px"}} onClick={()=>{setEditState(!editState)}}>
        {!editState?<><i className="fas fa-pen"></i> Edit</>: <><i className="fas fa-stop"></i> Stop editing</>}
      </button>

      {Object.values(deleteObj).slice(1).includes(true)?<button type="button" className="btn btn-outline-danger" style={{marginRight:"5px"}} onClick={()=>{handleBtnClicks('delete')}}>
        <i className="fas fa-trash"></i> Delete
      </button>:null}

      {Object.values(updateObj).length>0?<button type="button" className="btn btn-outline-primary" style={{marginRight:"5px"}} onClick={()=>{handleBtnClicks('update')}}>
        <i className="fas fa-check"></i> Save Updates
      </button>:null}

      <span className="spinner-border text-primary spinner-border-sm ml-2" hidden={requestSpinner}></span>

      <button type="button" className="btn btn-outline-success" style={{marginRight:"5px"}} hidden={true}><span
        className="spinner-grow spinner-grow-sm"></span> Reload
      </button>

      <div style={{marginTop:"5px"}}>
        {table(tableProps)}
      </div>
    </>
  );
}

export default DisplayTableSection;