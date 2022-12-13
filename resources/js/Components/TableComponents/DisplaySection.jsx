import React, {useEffect, useState} from 'react';
import DisplayTableSection from "@/Components/TableComponents/DisplayTableSection";

const DisplaySection = ({context, btnText=null, table, url, documentColumns, documentTitle, supportAdd=false}) => {
  const [showTableSection, setShowTableSection] = useState(false);
  const [data, setData] = useState([]);
  const [selectedDel, setSelectedDel] = useState({'0':false});
  const [selectedAdd, setSelectedAdd] = useState({'0':false});
  const [updateObj, setUpdateObj] = useState({});
  const show = () =>setShowTableSection(!showTableSection);
  const [spinner, setSpinner] = useState(true);
  const [reqSpinner, setReqSpinner] = useState(true);
  const tableId = "#edit"+context[0].toUpperCase()+context.slice(1)+"Table";
  const [editState, setEditState] = useState(false);
  const dataTable = $(tableId);
  let fetchUrl = url;
  url = url.includes('/show')?url.slice(0,url.indexOf('/show')):url

  const fetchData = () =>{
    setSpinner(false);
    axios.get(fetchUrl+"?data_date="+axios.defaults.data['data_date']+"",).then(function (response) {
      if(Array.isArray(response.data)){
        if (response.data.length === 0){
          setSpinner(true);
          $.notify('No data')
          return
        }
      }

      console.log(response.data)
      // setSelectedDel(((obj={...selectedDel, ['0']:false})=>{response.data.map((rowData)=>[rowData['id']]).forEach((id)=>{obj[id] = false}); return obj})())
      // setData(((obj={})=>{response.data.forEach((rowData)=>{obj[rowData['id']]=rowData}); return obj})())
      // setUpdateObj({})
      // show();
      // setSpinner(true);
    })
  }

  useEffect(() => {
    if(showTableSection&&!editState){

      const buttons = ["copy", "csv", "print"];

      dataTable.DataTable({
        "retrieve": true,
        "responsive": true, "lengthChange": false, "autoWidth": false, "scrollx": 100,
        "buttons": ((a=[])=>{buttons.forEach((i)=>a.push({extend:i,exportOptions:{columns:documentColumns},title: documentTitle})); a.push('colvis'); return a})(),
      }).buttons().container().appendTo(tableId+'_wrapper .col-md-6:eq(0)');
      let table_wrapper = $(tableId+'_wrapper');
      table_wrapper.find('.buttons-colvis span').html('<i class="fas fa-eye"></i>');
      for (let i of buttons) {
        switch (i){
          case 'print': case 'copy':
            table_wrapper.find('.buttons-'+i+' span').html('<i class="fas fa-'+i+'"></i>').attr('title', i);
            break;
          default:
            table_wrapper.find('.buttons-'+i+' span').html('<i class="fas fa-file-'+i+'"></i>').attr('title', i);
        }
      }
    }else if(showTableSection&&editState){
      if(dataTable.attr('data-editing')!=='1') {
        dataTable.DataTable().destroy()
        dataTable.attr('data-editing', '1')
      }
    }
  });

  const handleChange = (e) =>{
    if(e.currentTarget.name==="select"){
      const value = e.currentTarget.value;
      const obj = (value==='0')?
        ((obj={})=>{Object.keys(selectedDel).forEach((key)=>{obj[key]=!(selectedDel[value])}); return obj})()
        :{...selectedDel, [value]:!(selectedDel[value])}
      setSelectedDel(obj);
    }
    else {
      const id = e.currentTarget.getAttribute('data-id')

      const obj = {...updateObj, [id]:{...updateObj[id], [e.currentTarget.name]:e.currentTarget.type==='checkbox'?(e.currentTarget.checked?'Yes':'No'):e.currentTarget.value}}
      if(e.currentTarget.type==='select-one'){
        obj[id][e.currentTarget.name] = e.currentTarget.options[e.currentTarget.selectedIndex].innerHTML;
        obj[id][e.currentTarget.getAttribute('data-value-name')] = e.currentTarget.value;
      }

      if (obj[id][e.currentTarget.name]===e.currentTarget.getAttribute('data-old-value')){
        delete obj[id][e.currentTarget.name]
        if(Object.keys(obj[id]).length===0){
          delete obj[id]
        }
      }
      setUpdateObj(obj)
    }
  }

  const deleteData = () =>{
    if(reqSpinner)
      setReqSpinner(false)
    else
      return

    axios.post(url+'/destroy', {
      ids: Object.keys(selectedDel).slice(1).filter((key)=>selectedDel[key])
    }).then((response)=>{
      const deletedIds = response.data.filter((el)=>el['resp']===true).map((el)=>el['id']);
      const unDeletedIds = response.data.filter((el)=>el['resp']===false).map((el)=>el['id']);
      if(deletedIds.length>0)
        $.notify(deletedIds.length+' records deleted successfully!',{className: 'success', autoHideDelay: 1000})
      if(unDeletedIds.length>0)
        $.notify('Failed to delete '+unDeletedIds.length+' records!',{autoHideDelay: 1000})

      const obj = omitProperties(data, deletedIds);
      setData(obj);
      setSelectedDel(omitProperties(selectedDel, deletedIds))
      setReqSpinner(true)
      if(Object.keys(obj).length===0){
        show()
      }
    })

  }

  const updateData = () =>{
    if(reqSpinner)
      setReqSpinner(false)
    else
      return

    axios.post(url+'/update', {
      records: updateObj
    }).then((response)=>{
      let updatedIds = [];

      Object.keys(response.data).forEach((id)=>{
        if(response.data[id]['saved']){
          updatedIds.push(id);
        }
        else {
          const reasons = response.data[id]['reasons']
          for (let key in reasons){
            $.notify(reasons[key].join().replaceAll(':value', updateObj[id][key]), {autoHideDelay: 3000})
          }
        }
      })

      if(updatedIds.length>0){
        $.notify(updatedIds.length+' records updated successfully!',{className: 'success', autoHideDelay: 1000})
        let obj = {...data}
        for(let id of updatedIds){
          obj = {...obj, [id]:{...obj[id], ...updateObj[id]}}
        }
        setData(obj)
      }
      setUpdateObj({})
      setReqSpinner(true)
    })
  }

  const addData = () => {
    console.log('add')
  }

  const handleBtnClicks = (action)=>{({'delete':deleteData, 'update':updateData, 'add':addData})[action]()}

  return (
    <div style={{marginBottom: "5px"}}>
      {showTableSection ? <DisplayTableSection context={context} table={table} show={show} data={data} editState={editState} setEditState={setEditState} selectedDel={selectedDel} updateObj={updateObj} handleChange={handleChange} handleBtnClicks={handleBtnClicks} requestSpinner={reqSpinner} supportAdd={supportAdd}/>:<><button type="button" className={"btn btn-outline-primary"} onClick={fetchData}>{btnText === null? ('View Or Edit '+context+'s'): btnText}</button>
        <span className="spinner-border text-primary spinner-border-sm ml-2" hidden={spinner}></span></>}
    </div>
  );
};

export default DisplaySection;
