import DataManager from "@/Helpers/DataManager";
import {DelBtn, Input, SelectBox} from "@/Components/FormComponents";
import {DisplaySection, DisplayTable, InsertSection, InsertTable} from "@/Components/TableComponents";

const ProductType = () => {
  const url = '/product-type'
  const context = 'ProductType'
  const headings = ['TYPE']
  const dataObj = new DataManager('productTypes', {type:''}, url);

  const insertRows = (rowData, pos, handleDelete, handleChange) => {
    const sharedProps = {row:pos, handleChange}
    return <tr>
      <td><Input type="lower" name="type" value={rowData['type']} {...sharedProps} /></td>
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
      <td>{!editState?rowData['type']:<Input name='type' type='lower' defaultValue={rowData['type']} {...sharedProps}/>}</td>
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
      <DisplaySection context={context} table={displayTable} url={url} documentColumns={[0]} documentTitle={'Product Types'}/>
    </>
  );
};

export default ProductType;
