import DataManager from "@/Helpers/DataManager";
import {InsertTable, DisplayTable, InsertSection, DisplaySection} from "@/Components/TableComponents";
import {Select,Input, CheckBox, DelBtn, SelectBox} from "@/Components/FormComponents";

const Nozzle = () => {
  const url = '/nozzle'
  const context = 'Nozzle'
  const headings = ['TANK', 'PUMP', 'NAME', 'ACTIVE']
  const dataObj = new DataManager('nozzles',  {tank:'', pump:'', name:'', active:'Yes'}, url);

  const insertRows = (rowData, pos, handleDelete, handleChange, dataObj) => {
    let tanks = dataObj.providedData.hasOwnProperty('tanks')?dataObj.providedData['tanks']:[];
    let pumps = dataObj.providedData.hasOwnProperty('pumps')?dataObj.providedData['pumps']:[];
    const sharedProps = {row:pos, handleChange}

    return <tr>
      <td>
        <Select name='tank' handleMouseDown={dataObj.handleProvide} dataResource='tanks' dataUrl='/tank' value={rowData['tank']} {...sharedProps}>
          <option key={'opt0'} hidden={true}></option>
          {tanks.map((row)=><option value={row['id']} key={row['id']}>{row['name']}</option>)}
        </Select>
      </td>
      <td>
        <Select name='pump' handleMouseDown={dataObj.handleProvide} dataResource='pumps' dataUrl='/pump' value={rowData['pump']} {...sharedProps}>
          <option key={'opt0'} hidden={true}></option>
          {pumps.map((row)=><option value={row['id']} key={row['id']}>{row['name']}</option>)}
        </Select>
      </td>
      <td><Input type="lower" name="name" value={rowData['name']} {...sharedProps}/></td>
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

  const displayRows = (rowData, deleteObj, editState, handleChange, dataObj) => {
    const sharedProps = {handleChange, dataId:rowData['id']}
    let tanks = dataObj.providedData.hasOwnProperty('tanks')?dataObj.providedData['tanks'].filter((el)=>el['id']!==rowData['tank_id']):[];
    let pumps = dataObj.providedData.hasOwnProperty('pumps')?dataObj.providedData['pumps'].filter((el)=>el['id']!==rowData['pump_id']):[];

    return <tr>
      <td>{!editState?rowData['tank']:
        <Select name='tank' valueName='tank_id' handleMouseDown={dataObj.handleProvide} value={rowData['tank_id']} dataResource='tanks' dataUrl='/tank' {...sharedProps}>
          <option value={rowData['tank_id']} key={rowData['tank_id']} >{rowData['tank']}</option>
          {tanks.map((row)=><option value={row['id']} key={row['id']}>{row['name']}</option>)}
        </Select>}
      </td>

      <td>{!editState?rowData['pump']:
        <Select name='pump' valueName='pump_id' handleMouseDown={dataObj.handleProvide} value={rowData['pump_id']} dataResource='pumps' dataUrl='/pump' {...sharedProps}>
          <option value={rowData['pump_id']} key={rowData['pump_id']} >{rowData['pump']}</option>
          {pumps.map((row)=><option value={row['id']} key={row['id']}>{row['name']}</option>)}
        </Select>}
      </td>

      <td>{!editState?rowData['name']:<Input name='name' type='lower' defaultValue={rowData['name']} {...sharedProps}/>}</td>
      <td>{!editState?rowData['active']:<CheckBox name='active' checked={rowData['active']==='Yes'} {...sharedProps}/>}</td>
      <td hidden={!editState}><SelectBox value={rowData['id']} checked={deleteObj[rowData['id']]} handleChange={handleChange}/></td>
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
      <DisplaySection context={context} table={displayTable} url={url+'/show'} documentColumns={[0,1,2,3]} documentTitle={'Nozzles'}/>
    </>
  );
};

export default Nozzle;
