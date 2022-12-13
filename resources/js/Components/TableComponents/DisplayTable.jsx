import React from "react";
import SelectBox from "@/Components/FormComponents/SelectBox";

const Row = ({rowBuilder, rowData, selectedDel, editState, handleChange, dataObj}) =>{
  return rowBuilder(rowData, selectedDel, editState, handleChange, dataObj)
}

const Rows = ({data, selectedDel, rowBuilder, handleChange, editState, dataObj}) => {
  return (
    <>
      {Object.keys(data).map((key, index)=>( <Row rowBuilder={rowBuilder} rowData={data[key]} selectedDel={selectedDel} editState={editState}  handleChange={handleChange} dataObj={dataObj} key={index}/> ))}
    </>
  )
};


const DisplayTable = ({thead=null, data, context, rowBuilder, tfoot=null, selectedDel, handleChange, dataManager=null, editState}) => {
  const contextUpper = context[0].toUpperCase()+context.slice(1);
  return (
    <>
      <table id={"edit"+contextUpper+"Table"} className="table table-bordered table-hover table-striped form-table dtr-inline" style={{marginTop:"5px"}}>
        {thead!==null &&
          <thead>
            <tr>
              {thead.map((el, index)=>typeof el === "string"?<th key={index}>{el}</th>:el)}

              <th hidden={!editState}><SelectBox value={0} checked={selectedDel['0']} handleChange={handleChange}/></th>
              {/*<th hidden={!editState}><SelectBox value={0} checked={selectedDel['0']} handleChange={handleChange}/></th>*/}
            </tr>
          </thead>
        }
        {<tbody>
          <Rows data={data} selectedDel={selectedDel} rowBuilder={rowBuilder} handleChange={handleChange} editState={editState} dataObj={dataManager}/>
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
