import RecordsForm from "@/Layouts/RecordsForm";
import Main from "@/Layouts/Main";
import {InsertSection, InsertTable, DisplaySection, DisplayTable} from '@/Components/TableComponents';
import {DelBtn, SelectBox, Input, CheckBox} from "@/Components/FormComponents";
import DataManager from "@/Helpers/DataManager";

const TransactionTypes = () => {
  const url = '/transaction-type'
  const context = 'TransactionType'
  const headings = ['NAME','DESCRIPTION','ACTIVE']
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

  const branchDisplayRows = (rowData, selectedDel, editState, handleChange) => {
    const sharedProps = {handleChange, dataId:rowData['id']}

    return <tr>
      <td>{rowData['name']}</td>
      <td>{rowData['description']}</td>
      <td>{!editState?rowData['active']:<CheckBox name='active' defaultChecked={rowData['active']==='Yes'} {...sharedProps}/>}</td>
      <td hidden={!editState}><SelectBox value={rowData['id']} checked={selectedDel[rowData['id']]} handleChange={handleChange}/></td>
    </tr>
  }

  const branchDisplayTable = (props)=>{
    return <DisplayTable
      thead={headings}
      tfoot={headings}
      rowBuilder={branchDisplayRows}
      dataManager={dataObj}
      {...props}
    />
  }

  return (
    <>
      <InsertSection context={context} table={insertTable} />
      <DisplaySection context={context} table={displayTable} url={url} documentColumns={[0,1,2]} documentTitle={'Transaction Types'}/>
      <DisplaySection context='BranchTransactionType' btnText='View Or Edit Branch Transaction Types' table={branchDisplayTable} url={'/branch-transaction-type/'} documentColumns={[0,1,2]} documentTitle={'Branch Transaction Types'} supportAdd/>
    </>
  );
};

const heading = "TRANSACTION TYPES";
TransactionTypes.layout = page => (
  <Main title={heading}>
    <RecordsForm heading={heading} children={page} />
  </Main>
)

export default TransactionTypes;

//todo send update obj along with id to insert new branch data.
// make sure default data in the table matches the db table default data
// add criteria to determine added and non added rows
