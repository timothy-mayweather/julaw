import DataManager from "@/Helpers/DataManager";
import {InsertTable, DisplayTable, InsertSection, DisplaySection} from "@/Components/TableComponents";
import {Select,Input, CheckBox, DelBtn, SelectBox} from "@/Components/FormComponents";

const Tank = () => {
  const url = '/tank'
  const context = 'Tank'
  const headings = ['FUEL', 'NAME', 'CAPACITY', 'RESERVE', 'WORKING CAP.', 'DESCRIPTION', 'ACTIVE?']
  const dataObj = new DataManager('tanks',  {fuel:'', name:'', capacity:'', reserve:'', description:'', active:'Yes'}, url);

  const insertRows = (rowData, pos, handleDelete, handleChange, dataObj) => {
    let workingCapacity = rowData['capacity']-rowData['reserve']
    let bfp = dataObj.providedData.hasOwnProperty('branch-fuel-product')?dataObj.providedData['branch-fuel-product']:[];
    const sharedProps = {row:pos, handleChange}

    return <tr>
      <td>
        <Select name='fuel' handleMouseDown={dataObj.handleProvide} dataResource='branch-fuel-product' dataUrl='/branch-fuel-product/_' {...sharedProps} value={rowData['fuel']}>
          <option key={'opt0'} hidden={true}></option>
          {bfp.map((row)=><option value={row['id']} key={row['id']}>{row['short_name']}</option>)}
        </Select>
      </td>
      <td><Input type="lower" name="name" value={rowData['name']} {...sharedProps}/></td>
      <td><Input type="float" name="capacity" value={rowData['capacity']} {...sharedProps}/></td>
      <td><Input type="float" name="reserve" value={rowData['reserve']} {...sharedProps}/></td>
      <td>{isNaN(workingCapacity)?null:workingCapacity}</td>
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

  const displayRows = (rowData, selectedDel, editState, handleChange, dataObj) => {
    const sharedProps = {handleChange, dataId:rowData['id']}
    let bfp = dataObj.providedData.hasOwnProperty('branch-fuel-product')?dataObj.providedData['branch-fuel-product'].filter((el)=>el['id']!==rowData['fuel_id']):[];

    return <tr>
      <td>{!editState?rowData['fuel']:
        <Select name='fuel' valueName='fuel_id' handleMouseDown={dataObj.handleProvide} value={rowData['fuel_id']} dataResource='branch-fuel-product' dataUrl='/branch-fuel-product' {...sharedProps}>
          <option value={rowData['fuel_id']} key={rowData['fuel_id']} >{rowData['fuel']}</option>
          {bfp.map((row)=><option value={row['id']} key={row['id']}>{row['short_name']}</option>)}
        </Select>}
      </td>

      <td>{!editState?rowData['name']:<Input name='name' type='lower' defaultValue={rowData['name']} {...sharedProps}/>}</td>
      <td>{!editState?rowData['capacity']:<Input name='capacity' type='float' defaultValue={rowData['capacity']} {...sharedProps}/>}</td>
      <td>{!editState?rowData['reserve']:<Input name='reserve' type='float' defaultValue={rowData['reserve']} {...sharedProps}/>}</td>
      <td>{(rowData['capacity']-rowData['reserve'])}</td>
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
      <DisplaySection context={context} table={displayTable} url={url+'/show'} documentColumns={[0,1,2,3,4,5,6]} documentTitle={'Tanks'}/>
    </>
  );
};

export default Tank;
