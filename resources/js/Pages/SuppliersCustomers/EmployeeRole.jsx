import DataManager from "@/Helpers/DataManager";
import {DelBtn, Input, SelectBox} from "@/Components/FormComponents";
import {DisplaySection, DisplayTable, InsertSection, InsertTable} from "@/Components/TableComponents";

const EmployeeRole = () => {
  const url = '/employee-role'
  const context = 'EmployeeRole'
  const headings = ['ROLE']
  const dataObj = new DataManager('employeeRoles', {role:''}, url);

  const insertRows = (rowData, pos, handleDelete, handleChange) => {
    const sharedProps = {row:pos, handleChange}
    return <tr>
      <td><Input type="lower" name="role" value={rowData['role']} {...sharedProps} /></td>
      <td><DelBtn row={pos} handleDelete={handleDelete}/></td>
    </tr>
  }

  const insertTable = (show)=>{
    return <InsertTable
      thead={headings}
      tfoot={headings}
      showTable={show}
      rowBuilder={insertRows}
      dataManager={dataObj}
    />
  }

  const displayRows = (rowData, selectedDel, editState, handleChange) => {
    const sharedProps = {handleChange, dataId:rowData['id']}

    return <tr>
      <td>{!editState?rowData['role']:<Input name='role' type='lower' defaultValue={rowData['role']} {...sharedProps}/>}</td>
      <td hidden={!editState}><SelectBox value={rowData['id']} checked={selectedDel[rowData['id']]} handleChange={handleChange}/></td>
    </tr>
  }

  const displayTable = (props)=>{
    return <DisplayTable
      thead={headings}
      tfoot={headings}
      rowBuilder={displayRows}
      dataManager={dataObj}
      {...props}
    />
  }


  return (
    <>
      <InsertSection context={context} table={insertTable} />
      <DisplaySection context={context} table={displayTable} url={url} documentColumns={[0]} documentTitle={'Employee Roles'}/>
    </>
  );
};

export default EmployeeRole;
