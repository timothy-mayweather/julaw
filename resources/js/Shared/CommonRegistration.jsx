import {InsertSection, InsertTable, DisplaySection, DisplayTable} from '@/Components/TableComponents';
import {DelBtn, SelectBox, Input, CheckBox} from "@/Components/FormComponents";
import DataManager from "@/Helpers/DataManager";

const CommonRegistration = ({url, bUrl, context, bContext, btnText, documentTitle}) => {
  const headings = ['NAME','DESCRIPTION','ACTIVE?']
  const dataObj = new DataManager('transactionTypes', {name:'', description:'', active:'Yes'}, url);

  const insertRows = (rowData, pos, handleDelete, handleChange) => {
    const sharedProps = {row:pos, handleChange}

    return <tr>
      <td><Input type="lower" name="name" value={rowData['name']} {...sharedProps} /></td>
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
      <td>{!editState?rowData['description']:<Input name='description' type='lower' defaultValue={rowData['name']} {...sharedProps}/>}</td>
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

  const bHeadings = ['NAME','ACTIVE?']

  const branchDisplayRows = (rowData, selectedAdd, selectedDel, editState, handleChange) => {
    const sharedProps = {handleChange, dataId:rowData['id']}

    return <tr>
      <td>{rowData['name']}</td>
      <td>{<CheckBox name='active' defaultChecked={rowData['active']==='Yes'} {...sharedProps}/>}</td>
      <td>{selectedAdd.hasOwnProperty(rowData['id'])?<SelectBox name='add' value={rowData['id']} checked={selectedAdd[rowData['id']]} handleChange={handleChange}/>:<span></span>}</td>
      <td>{selectedDel.hasOwnProperty(rowData['id'])?<SelectBox value={rowData['id']} checked={selectedDel[rowData['id']]} handleChange={handleChange}/>:<span></span>}</td>
    </tr>
  }

  const branchDisplayTable = (props)=>{
    return <DisplayTable
      thead={bHeadings}
      tfoot={bHeadings}
      rowBuilder={branchDisplayRows}
      {...props}
    />
  }

  return (
    <>
      <InsertSection context={context} table={insertTable} />
      <DisplaySection context={context} table={displayTable} url={url} documentColumns={[0,1,2]} documentTitle={documentTitle}/>
      <DisplaySection context={bContext} btnText={btnText} table={branchDisplayTable} url={bUrl} joinedTable/>
    </>
  );
};

export default CommonRegistration;
