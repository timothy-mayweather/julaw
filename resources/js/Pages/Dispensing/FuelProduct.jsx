import DataManager from "@/Helpers/DataManager";
import {InsertTable, DisplayTable, InsertSection, DisplaySection} from "@/Components/TableComponents";
import {Input, CheckBox, DelBtn, SelectBox} from "@/Components/FormComponents";

const FuelProduct = () => {
  const url = '/fuel-product'
  const context = "Fuel_product"
  const headings = ['NAME','SHORT_NAME','DESCRIPTION','ACTIVE?']
  const dataObj = new DataManager('fuelProducts',  {name:'', short_name:'', description:'', active:'Yes'}, url);

  const insertRows = (rowData, pos, handleDelete, handleChange) => {
    const sharedProps = {row:pos, handleChange}
    return <tr>
      <td><Input type="lower" name="name" value={rowData['name']} {...sharedProps}/></td>
      <td><Input type="lower" name="short_name" value={rowData['short_name']} {...sharedProps}/></td>
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
      <td>{!editState?rowData['short_name']:<Input name='short_name' type='lower' defaultValue={rowData['short_name']} {...sharedProps}/>}</td>
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
      {...props}
    />
  }

  const bHeadings = ['SHORT_NAME','PRICE','ACTIVE?']

  const branchDisplayRows = (rowData, selectedAdd, selectedDel, editState, handleChange) => {
    const sharedProps = {handleChange, dataId:rowData['id']}

    return <tr>
      <td>{rowData['short_name']}</td>
      <td><Input name='price' type='float' defaultValue={rowData['price']} {...sharedProps}/></td>
      <td><CheckBox name='active' defaultChecked={rowData['active']==='Yes'} {...sharedProps}/></td>
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
      <InsertSection context={context} table={insertTable}/>
      <DisplaySection context={context} table={displayTable} url={url} documentColumns={[0,1,2,3]} documentTitle={'Fuel Products'}/>
      <DisplaySection context='BranchFuelProduct' btnText='View Or Edit Branch Fuel Products' table={branchDisplayTable} url='/branch-fuel-product' joinedTable/>
    </>
  );
};

export default FuelProduct;
