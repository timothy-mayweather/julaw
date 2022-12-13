import DataManager from "@/Helpers/DataManager";
import {CheckBox, DelBtn, Input, SelectBox} from "@/Components/FormComponents";
import {DisplaySection, DisplayTable, InsertSection, InsertTable} from "@/Components/TableComponents";

const Supplier = () => {
  const url = '/supplier'
  const context = 'Supplier'
  const headings = ['NAME','EMAIL','PHONE','LOCATION','DESCRIPTION','ACTIVE?']
  const dataObj = new DataManager('suppliers', {name:'',email:'',phone:'',location:'',description:'',active:'Yes',}, url);

  const insertRows = (rowData, pos, handleDelete, handleChange) => {
    const sharedProps = {row:pos, handleChange}

    return <tr>
      <td><Input type="lower" name="name" value={rowData['name']} {...sharedProps} /></td>
      <td><Input type="lower" name="email" value={rowData['email']} {...sharedProps} /></td>
      <td><Input type="lower" name="phone" value={rowData['phone']} {...sharedProps} /></td>
      <td><Input type="lower" name="location" value={rowData['location']} {...sharedProps} /></td>
      <td><Input type="lower" name="description" value={rowData['description']} {...sharedProps} /></td>
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

    return <tr>
      <td>{!editState?rowData['name']:<Input name='name' type='lower' defaultValue={rowData['name']} {...sharedProps}/>}</td>
      <td>{!editState?rowData['email']:<Input type="lower" name="email" defaultValue={rowData['email']} {...sharedProps} />}</td>
      <td>{!editState?rowData['phone']:<Input type="lower" name="phone" defaultValue={rowData['phone']} {...sharedProps} />}</td>
      <td>{!editState?rowData['location']:<Input type="lower" name="location" defaultValue={rowData['location']} {...sharedProps} />}</td>
      <td>{!editState?rowData['description']:<Input type="lower" name="description" defaultValue={rowData['description']} {...sharedProps} />}</td>
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
      <DisplaySection context={context} table={displayTable} url={url} documentColumns={[0,1,2,3,4,5]} documentTitle={'Suppliers'}/>
    </>
  );
};

export default Supplier;
