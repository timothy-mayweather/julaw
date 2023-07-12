import SubmitBtn from "@/Components/FormComponents/SubmitBtn";
import React, {useEffect, useState} from "react";
import AddRowBtn from "@/Components/FormComponents/AddRowBtn";


const Row = ({rowBuilder, pos, handleDelete, dataObj}) =>{
  const [rowData, setRowData] = useState({...dataObj.data[pos]});

  useEffect(() => {
    if(dataObj.data[pos])
      setRowData({...dataObj.data[pos]})
  }, [dataObj.data[pos]]);

  return rowBuilder(rowData, pos, handleDelete, dataObj.handleChange, dataObj)
}

const Rows = ({rowPositions, handleDelete, rowBuilder, dataObj}) => {
  return (
    <>
      {rowPositions.map((pos) => (
        <Row rowBuilder={rowBuilder} pos={pos} handleDelete={handleDelete} dataObj={dataObj} key={pos}/>
      ))}
    </>
  )
}


const InsertTable = ({thead=null, rowBuilder, tfoot=null, showTable, dataManager}) => {

  const [rowPositions, setRowPositions] = useState(((keys)=>keys.length>0?keys.map((key)=>Number(key)):[0])(Object.keys(dataManager.data)));

  useEffect(() => {
    const keys = Object.keys(dataManager.data).map((el) => Number(el)).sort();
    if(keys.length===0){
      dataManager.addData();
      showTable();
    }else{
      setRowPositions(keys);
    }
  }, [dataManager.data]);

  const addRow = () =>dataManager.addData();
  const deleteRow = (position) =>dataManager.removeData(position);

  return (
    <table className="table table-bordered table-hover table-responsive form-table registry-table">
      {thead!==null &&
        <thead>
          <tr>
            {thead.map((el, index)=>typeof el === "string"?<th key={index}>{el}</th>:el)}<th><AddRowBtn handleAddRow={addRow}/></th>
          </tr>
        </thead>
      }
      {<tbody>
        <Rows rowPositions={rowPositions} handleDelete={(e)=>{dataManager.handleDelete(deleteRow, e.currentTarget.getAttribute('data-row'))}} rowBuilder={rowBuilder} dataObj={dataManager}/>
      </tbody>
      }
      {tfoot!==null &&
        <tfoot>
          <tr>
            {(typeof tfoot !== 'function')?tfoot.map((el, index)=>typeof el === "string"?<th key={index}>{el}</th>:el):tfoot(dataManager.data)}
            <th><SubmitBtn handleSubmit={()=>{dataManager.handleSubmit(showTable, deleteRow)}} /></th>
          </tr>
        </tfoot>
      }
    </table>
  );
};

export default InsertTable;
