import React from "react";
import SelectBox from "@/Components/FormComponents/SelectBox";

const Row = ({rowBuilder, rowData, selectedAdd, selectedDel, editState, handleChange, joinedTable, dataObj}) =>{
  return joinedTable?
    rowBuilder(rowData, selectedAdd, selectedDel, editState, handleChange, dataObj):
    rowBuilder(rowData, selectedDel, editState, handleChange, dataObj)
}

const Rows = ({data, selectedAdd, selectedDel, rowBuilder, handleChange, editState, dataObj, joinedTable}) => {
  return (
    <>
      {Object.keys(data).map((key, index)=>( <Row rowBuilder={rowBuilder} rowData={data[key]} selectedDel={selectedDel} selectedAdd={selectedAdd} editState={editState}  handleChange={handleChange} dataObj={dataObj} joinedTable={joinedTable} key={index}/> ))}
    </>
  )
};


const DisplayTable = ({thead=null, data, context, rowBuilder, tfoot=null, selectedDel, selectedAdd, joinedTable, handleChange, dataManager=null, editState}) => {
  const contextUpper = context[0].toUpperCase()+context.slice(1);

  return (
    <>
      <table id={"edit"+contextUpper+"Table"} className="table table-bordered table-hover table-striped form-table dtr-inline" style={{marginTop:"5px"}}>
        {thead!==null &&
          <thead>
            <tr>
              {thead.map((el, index)=>typeof el === "string"?<th key={index}>{el}</th>:el)}
              {joinedTable&&<th>ADD <SelectBox name='add' value={0} checked={selectedAdd['0']} handleChange={handleChange}/></th>}
              <th hidden={!editState}> {joinedTable&&'DELETE'} <SelectBox value={0} checked={selectedDel['0']} handleChange={handleChange}/></th>
            </tr>
          </thead>
        }
        {<tbody>
          <Rows data={data} selectedAdd={selectedAdd} selectedDel={selectedDel} rowBuilder={rowBuilder} handleChange={handleChange} editState={editState} dataObj={dataManager} joinedTable={joinedTable}/>
        </tbody>
        }

        {tfoot!==null &&
          <tfoot>
          <tr>
            {(typeof tfoot !== 'function')?tfoot.map((el, index)=>typeof el === "string"?<th key={index}>{el}</th>:el):tfoot(data)}
            {joinedTable&&<th>ADD</th>}
            <th hidden={!editState}>{joinedTable&&'DELETE'}</th>
          </tr>
          </tfoot>
        }
      </table>
    </>
  );
};

export default DisplayTable;
