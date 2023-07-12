import RecordsForm from "@/Layouts/RecordsForm";
import Main from "@/Layouts/Main";
import {InsertSection, InsertTable, DisplaySection, DisplayTable} from '@/Components/TableComponents';
import {DelBtn, Select, SelectBox, Input} from "@/Components/FormComponents";
import DataManager from "@/Helpers/DataManager";

const Dips = () => {
  const url = '/dip'
  const context = 'Dip'
  const headings = ['TANK','OPENING','NEW','CLOSING','SALES (DIPS)','SALES (METERS)','DIFF']
  const dataObj = new DataManager('dips', {tank:'', opening:'', stock:'', meters:'', closing:''}, url);

  const insertRows = (rowData, pos, handleDelete, handleChange, dataObj) => {
    const tanks = dataObj.providedData.hasOwnProperty('tanks')?dataObj.providedData['tanks']:[];
    const sharedProps = {row:pos, handleChange}

    let dips = ((Number(rowData['opening'])+Number(rowData['stock']))-rowData['closing']).toFixed(2).toString()
    let diff = dips-rowData['meters'];

    return <tr>
      <td>
        <Select name='tank' handleMouseDown={dataObj.handleProvide} dataResource='tanks' dataChange='opening stock meters' dataUrl='/tank-stock/_' value={rowData['tank']} {...sharedProps}>
          <option key={'opt0'} hidden={true}></option>
          {tanks.map((row)=><option value={row['id']} key={row['id']}>{row['name']}</option>)}
        </Select>
      </td>
      <td><Input type="float" name="opening" value={rowData['opening']} {...sharedProps} /></td>
      <td>{rowData['stock']}</td>
      <td><Input type="float" name="closing" value={rowData['closing']} {...sharedProps}/></td>
      <td>{dips}</td>
      <td>{rowData['meters']}</td>
      <td>{diff}</td>
      <td><DelBtn row={pos} handleDelete={handleDelete}/></td>
    </tr>
  }

  const tfoot = (data) => {
    const keys = Object.keys(data)
    let dips = 0, meters = 0;
    keys.forEach((pos)=>{
      const rowData = data[pos]
      meters += Number(rowData.hasOwnProperty('meters')?rowData['meters']:rowData['byMeters'])
      dips += (Number(rowData['opening'])+Number(rowData['stock']))-rowData['closing']
    })

    return <>
      <th colSpan='4' style={{textAlign:"left"}}>TOTAL</th>
      <th>{(dips).toFixed(2).toString()}</th>
      <th>{meters}</th>
      <th></th>
    </>
  }

  const insertTable = (show)=>{
    return <InsertTable
      thead={headings}
      tfoot={tfoot}
      showTable={show}
      rowBuilder={insertRows}
      dataManager={dataObj}
    />
  }

  const displayRows = (rowData, selectedDel, editState, handleChange, dataObj) => {
    const sharedProps = {handleChange, dataId:rowData['id']}
    let tanks = dataObj.providedData.hasOwnProperty('tanks')?dataObj.providedData['tanks'].filter((el)=>el['id']!==rowData['tank_id']):[];

    let dips = ((Number(rowData['opening'])+Number(rowData['stock']))-rowData['closing']).toFixed(2).toString()
    let diff = dips-rowData['byMeters'];

    return <tr>
      <td>{!editState?rowData['tank']:
        <Select name='tank' valueName='tank_id' handleMouseDown={dataObj.handleProvide} value={rowData['tank_id']} dataResource='tanks' dataUrl='/tank' {...sharedProps}>
          <option value={rowData['tank_id']} key={rowData['tank_id']} >{rowData['tank']}</option>
          {tanks.map((row)=><option value={row['id']} key={row['id']}>{row['name']}</option>)}
        </Select>}
      </td>

      <td>{!editState?rowData['opening']:<Input name='opening' type='float' defaultValue={rowData['opening']} {...sharedProps}/>}</td>
      <td>{rowData['stock']}</td>
      <td>{!editState?rowData['closing']:<Input name='closing' type='float' defaultValue={rowData['closing']} {...sharedProps}/>}</td>
      <td>{dips}</td>
      <td>{rowData['byMeters']}</td>
      <td>{diff}</td>
      <td hidden={!editState}><SelectBox value={rowData['id']} checked={selectedDel[rowData['id']]} handleChange={handleChange}/></td>
    </tr>
  }

  const displayTable = (props)=>{
    return <DisplayTable
      thead={headings}
      tfoot={tfoot}
      rowBuilder={displayRows}
      dataManager={dataObj}
      {...props}
    />
  }

  return (
    <>
      <InsertSection context={context} table={insertTable} />
      <DisplaySection context={context} table={displayTable} url={url+'/show'} documentColumns={[0,1,2,3,4,5,6]} documentTitle={'Dips'}/>
    </>
  );
};

const heading = "DIPS";
Dips.layout = page => (
  <Main title={heading}>
    <RecordsForm heading={heading} children={page} />
  </Main>
)

export default Dips;
