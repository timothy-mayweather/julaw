import DataManager from "@/Helpers/DataManager";
import {CheckBox, DelBtn, Input, Select, SelectBox} from "@/Components/FormComponents";
import {DisplaySection, DisplayTable, InsertSection, InsertTable} from "@/Components/TableComponents";

const Employee = () => {
  const url = '/employee'
  const context = 'Employee'
  const headings = ['NAME','PHONE','EMAIL','ROLE','ACTIVE?']
  const dataObj = new DataManager('employees', {name:'',email:'',phone:'',active:'No', role:''}, url);

  const insertRows = (rowData, pos, handleDelete, handleChange) => {
    let roles = dataObj.providedData.hasOwnProperty('roles')?dataObj.providedData['roles']:[];
    const sharedProps = {row:pos, handleChange}

    return <tr>
      <td><Input type="lower" name="name" value={rowData['name']} {...sharedProps}/></td>
      <td><Input type="lower" name="phone" value={rowData['phone']} {...sharedProps}/></td>
      <td><Input type="lower" name="email" value={rowData['email']} {...sharedProps}/></td>

      <td>
        <Select name='role' handleMouseDown={dataObj.handleProvide} dataResource='roles' dataUrl='/employee-role' value={rowData['role']} {...sharedProps}>
          <option key={'opt0'} hidden={true}></option>
          {roles.map((row)=><option value={row['id']} key={row['id']}>{row['role']}</option>)}
        </Select>
      </td>

      <td><CheckBox name="active" checked={rowData['active']==='Yes'} {...sharedProps}/></td>
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
    let roles = dataObj.providedData.hasOwnProperty('roles')?dataObj.providedData['roles'].filter((el)=>el['id']!==rowData['role']):[];

    return <tr>
      <td>{!editState?rowData['name']:<Input name='name' type='lower' defaultValue={rowData['name']} {...sharedProps}/>}</td>
      <td>{!editState?rowData['phone']:<Input type="lower" name="phone" defaultValue={rowData['phone']} {...sharedProps} />}</td>
      <td>{!editState?rowData['email']:<Input type="lower" name="email" defaultValue={rowData['email']} {...sharedProps} />}</td>

      <td>{!editState?rowData['role_name']:
        <Select name='role' valueName='role' handleMouseDown={dataObj.handleProvide} value={rowData['role']} dataResource='roles' dataUrl='/employee-role' {...sharedProps}>
          <option value={rowData['role']} key={rowData['role']} >{rowData['role_name']}</option>
          {roles.map((row)=><option value={row['id']} key={row['id']}>{row['role']}</option>)}
        </Select>}
      </td>

      <td>{!editState?rowData['active']:<CheckBox name='active' defaultChecked={rowData['active']==='Yes'} {...sharedProps}/>}</td>
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
      <DisplaySection context={context} table={displayTable} url={url} documentColumns={[0,1,2,3,4]} documentTitle={'Employees'}/>
    </>
  );
};

export default Employee;
