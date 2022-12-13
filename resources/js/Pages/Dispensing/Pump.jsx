import DataManager from "@/Helpers/DataManager";
import {InsertTable, DisplayTable, InsertSection, DisplaySection} from "@/Components/TableComponents";
import {Input, CheckBox, DelBtn, SelectBox} from "@/Components/FormComponents";

const Pump = () => {
  const url = '/pump'
  const context = 'Pump'
  const headings = ['NAME', 'DESCRIPTION', 'ACTIVE?']
  const dataObj = new DataManager('pumps',  {name:'', description:'', active:'Yes'}, url);

  const insertRows = (rowData, pos, handleDelete, handleChange) => {
    const sharedProps = {row:pos, handleChange}

    return <tr>
      <td><Input type="lower" name="name" value={rowData['name']} {...sharedProps}/></td>
      <td><Input type="lower" name="description" value={rowData['description']} {...sharedProps}/></td>
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
      <td>{!editState?rowData['description']:<Input name='description' type='lower' defaultValue={rowData['description']} {...sharedProps}/>}</td>
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
      <DisplaySection context={context} table={displayTable} url={url} documentColumns={[0,1,2]} documentTitle={'Pumps'}/>
    </>
  );
};

export default Pump;
