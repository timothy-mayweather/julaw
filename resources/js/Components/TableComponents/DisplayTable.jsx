import React from "react";
import SelectBox from "@/Components/FormComponents/SelectBox";

const Row = ({rowBuilder, rowData, deleteObj, editState, handleChange, dataObj}) =>{
  return rowBuilder(rowData, deleteObj, editState, handleChange, dataObj)
}

const Rows = ({data, deleteObj, rowBuilder, handleChange, editState, dataObj}) => {
  return (
    <>
      {Object.keys(data).map((key, index)=>( <Row rowBuilder={rowBuilder} rowData={data[key]} deleteObj={deleteObj} editState={editState}  handleChange={handleChange} dataObj={dataObj} key={index}/> ))}
    </>
  )
};


const DisplayTable = ({thead=null, data, context, rowBuilder, tfoot=null, deleteObj, handleChange, dataManager=null, editState}) => {
  const contextUpper = context[0].toUpperCase()+context.slice(1);
  return (
    <>
      <span hidden={!editState}><SelectBox value={0} checked={deleteObj['0']} handleChange={handleChange}/> Select all</span>
      <table id={"edit"+contextUpper+"Table"} className="table table-bordered table-hover table-striped form-table dtr-inline" style={{marginTop:"5px"}}>
        {thead!==null &&
          <thead>
            <tr>
              {thead.map((el, index)=>typeof el === "string"?<th key={index}>{el}</th>:el)}<th hidden={!editState}>-</th>
            </tr>
          </thead>
        }
        {<tbody>
          <Rows data={data} deleteObj={deleteObj} rowBuilder={rowBuilder} handleChange={handleChange} editState={editState} dataObj={dataManager}/>
        </tbody>
        }

        {tfoot!==null &&
          <tfoot>
          <tr>
            {(typeof tfoot !== 'function')?tfoot.map((el, index)=>typeof el === "string"?<th key={index}>{el}</th>:el):tfoot(data)}
            <th hidden={!editState}>-</th>
          </tr>
          </tfoot>
        }
      </table>
    </>
  );
};

export default DisplayTable;
