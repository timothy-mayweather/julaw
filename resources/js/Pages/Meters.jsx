import RecordsForm from "@/Layouts/RecordsForm";
import Main from "@/Layouts/Main";
import {InsertSection, InsertTable, DisplaySection, DisplayTable} from '@/Components/TableComponents';
import {DelBtn, Select, SelectBox, Input} from "@/Components/FormComponents";
import DataManager from "@/Helpers/DataManager";

const Meters = () => {
  const url = '/meter'
  const context = 'Meter'
  const headings = ['NOZZLE','OPENING','CLOSING','RTT','LITRES','PRICE','AMOUNT']
  const dataObj = new DataManager('meters', {nozzle:'', opening:'', closing:'', rtt:'0.00', price:'', oldPrice:'0'}, url);

  const insertRows = (rowData, pos, handleDelete, handleChange, dataObj) => {
    const nozzles = dataObj.providedData.hasOwnProperty('nozzles')?dataObj.providedData['nozzles']:[];
    const sharedProps = {row:pos, handleChange}

    let litres = (rowData['closing']-rowData['opening']-rowData['rtt']).toFixed(2).toString()

    return <tr>
      <td>
        <Select name='nozzle' handleMouseDown={dataObj.handleProvide} dataResource='nozzles' dataUrl='/nozzle/_' dataChange='opening price oldPrice:price' value={rowData['nozzle']} {...sharedProps}>
          <option key={'opt0'} hidden={true}></option>
          {nozzles.map((row)=><option value={row['id']} key={row['id']}>{row['name']}</option>)}
        </Select>
      </td>
      <td><Input type="float" name="opening" value={rowData['opening']} {...sharedProps} /></td>
      <td><Input type="float" name="closing" value={rowData['closing']} {...sharedProps}/></td>
      <td><Input type="float" name="rtt" value={rowData['rtt']} {...sharedProps}/></td>
      <td>{litres}</td>
      <td>
        <Input type="float" name="oldPrice" value={rowData['oldPrice']}  {...sharedProps} hidden={true}/>
        <Input type="float" name="price" value={rowData['price']} {...sharedProps}/>
      </td>
      <td>{Number(litres)*Number(rowData['price'])}</td>
      <td><DelBtn row={pos} handleDelete={handleDelete}/></td>
    </tr>
  }

  const tfoot = (data) => {
    const keys = Object.keys(data)
    let amount = 0, litres = 0;
    keys.forEach((pos)=>{
      let litre = (Number(data[pos]['closing'])-Number(data[pos]['opening'])-Number(data[pos]['rtt'])).toFixed(2);
      let am = litre*Number(data[pos]['price'])
      litres+=Number(litre)
      amount+=am
    })

    return <>
      <th colSpan='4' style={{textAlign:"left"}}>TOTAL</th>
      <th>{litres}</th>
      <th></th>
      <th>{amount}</th>
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

  const displayRows = (rowData, deleteObj, editState, handleChange, dataObj) => {
    const sharedProps = {handleChange, dataId:rowData['id']}
    let nozzles = dataObj.providedData.hasOwnProperty('nozzles')?dataObj.providedData['nozzles'].filter((el)=>el['id']!==rowData['nozzle_id']):[];
    let litres = rowData['closing']-rowData['opening']-rowData['rtt'];

    return <tr>
      <td>{!editState?rowData['nozzle']:
        <Select name='nozzle' valueName='nozzle_id' handleMouseDown={dataObj.handleProvide} value={rowData['nozzle_id']} dataResource='nozzles' dataUrl='/nozzle' {...sharedProps}>
          <option value={rowData['nozzle_id']} key={rowData['nozzle_id']} >{rowData['nozzle']}</option>
          {nozzles.map((row)=><option value={row['id']} key={row['id']}>{row['name']}</option>)}
        </Select>}
      </td>

      <td>{!editState?rowData['opening']:<Input name='opening' type='float' defaultValue={rowData['opening']} {...sharedProps}/>}</td>
      <td>{!editState?rowData['closing']:<Input name='closing' type='float' defaultValue={rowData['closing']} {...sharedProps}/>}</td>
      <td>{!editState?rowData['rtt']:<Input name='rtt' type='float' defaultValue={rowData['rtt']} {...sharedProps}/>}</td>
      <td>{litres}</td>
      <td>{!editState?rowData['price']:<Input name='price' type='float' defaultValue={rowData['price']} {...sharedProps}/>}</td>
      <td>{litres*rowData['price']}</td>
      <td hidden={!editState}><SelectBox value={rowData['id']} checked={deleteObj[rowData['id']]} handleChange={handleChange}/></td>
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
      <DisplaySection context={context} table={displayTable} url={url+'/show'} documentColumns={[0,1,2,3,4,5,6]} documentTitle={'Meters'}/>
    </>
  );
};

const heading = "METERS";
Meters.layout = page => (
  <Main title={heading}>
    <RecordsForm heading={heading} children={page} />
  </Main>
)

export default Meters;
