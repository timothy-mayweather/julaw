import DataManager from "@/Helpers/DataManager";
import {CheckBox, DelBtn, Input, Select, SelectBox} from "@/Components/FormComponents";
import {DisplaySection, DisplayTable, InsertSection, InsertTable} from "@/Components/TableComponents";

const Product = () => {
  const url = '/product'
  const context = 'Product'
  const headings = ['NAME','SHORT_NAME','DESCRIPTION','TYPE','ACTIVE?']
  const dataObj = new DataManager('products', {name:'', short_name:'', description:'',type:'',active:'Yes'}, url);

  const insertRows = (rowData, pos, handleDelete, handleChange, dataObj) => {
    let types = dataObj.providedData.hasOwnProperty('types')?dataObj.providedData['types']:[];
    const sharedProps = {row:pos, handleChange}

    return <tr>
      <td><Input type="lower" name="name" value={rowData['name']} {...sharedProps} /></td>
      <td><Input type="lower" name="short_name" value={rowData['short_name']} {...sharedProps} /></td>
      <td><Input type="lower" name="description" value={rowData['description']} {...sharedProps} /></td>

      <td>
        <Select name='type' handleMouseDown={dataObj.handleProvide} dataResource='types' dataUrl='/product-type' value={rowData['type']} {...sharedProps}>
          <option key={'opt0'} hidden={true}></option>
          {types.map((row)=><option value={row['id']} key={row['id']}>{row['type']}</option>)}
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

  const displayRows = (rowData, selectedDel, editState, handleChange, dataObj) => {
    const sharedProps = {handleChange, dataId:rowData['id']}
    let types = dataObj.providedData.hasOwnProperty('types')?dataObj.providedData['types'].filter((el)=>el['id']!==rowData['type']):[];

    return <tr>
      <td>{!editState?rowData['name']:<Input name='name' type='lower' defaultValue={rowData['name']} {...sharedProps}/>}</td>
      <td>{!editState?rowData['short_name']:<Input type="lower" name="short_name" defaultValue={rowData['short_name']} {...sharedProps} />}</td>
      <td>{!editState?rowData['description']:<Input type="lower" name="description" defaultValue={rowData['description']} {...sharedProps} />}</td>

      <td>{!editState?rowData['type_name']:
        <Select name='type' valueName='type' handleMouseDown={dataObj.handleProvide} value={rowData['type']} dataResource='types' dataUrl='/product-type' {...sharedProps}>
          <option value={rowData['type']} key={rowData['type']} >{rowData['type_name']}</option>
          {types.map((row)=><option value={row['id']} key={row['id']}>{row['type']}</option>)}
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
      <InsertSection context={context} table={insertTable} />
      <DisplaySection context={context} table={displayTable} url={url} documentColumns={[0,1,2,3,4]} documentTitle={'Products'}/>
      <DisplaySection context='BranchProduct' btnText='View Or Edit Branch Products' table={branchDisplayTable} url='/branch-product' joinedTable/>
    </>
  );
};

export default Product;
