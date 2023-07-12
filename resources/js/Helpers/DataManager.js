import React, {useState, useEffect} from 'react';

export default function DataManager (dataName, defaultValues, url, nonRequiredFields=[]){
  const [data, setData] = useState(remember.hasOwnProperty(dataName)?JSON.parse(remember.getItem(dataName)):{'0':defaultValues});

  useEffect(() => {
    remember.setItem(dataName, JSON.stringify(data))
  }, [data]);


  this.data = data
  this.setData = setData

  this.addData = ()=>{
    let pos = Object.keys(data).map((el) => Number(el)).sort()
    if(pos.length===0)
      pos = [0]
    setData({...data, [(pos[pos.length-1]+1).toString()]:{...defaultValues}})
  }

  this.removeData = (key)=>{
    setData((Object.keys(data).length===0)? {'0':defaultValues}:omitProperties({...data}, key.toString()))
  }

  const [providedData, setProvidedData] = useState(remember.hasOwnProperty('provided-'+dataName)?JSON.parse(remember.getItem('provided-'+dataName)):{});

  useEffect(() => {
    remember.setItem('provided-'+dataName, JSON.stringify(providedData))
  }, [providedData]);

  this.providedData = providedData

  this.requiredFields = Object.keys(defaultValues).filter((field)=>!nonRequiredFields.includes(field))

  this.handleProvide = (e)=>{
    const resource = e.currentTarget.getAttribute('data-resource')
    if(providedData.hasOwnProperty(resource)) return;
    const url = e.currentTarget.getAttribute('data-url')

    axios.get(url+"?data_date="+axios.defaults.data['data_date']+"").then((response)=>{
      setProvidedData({...providedData, [resource]:response.data})
    })
  }

  this.handleChange = (e)=>{
    const key = e.target.getAttribute('data-row');
    let obj = {...data[key], [e.target.name]:((e.target.type === "checkbox") ? (e.target.checked?'Yes':'No') : e.target.value)};

    const dataChangeAttr =  e.target.getAttribute('data-change')

    if(dataChangeAttr){
      const providedDetails = providedData[e.target.getAttribute('data-resource')].filter((row)=>row['id'].toString()===e.target.value)[0];
      const attrs = dataChangeAttr.split(' ')

      attrs.forEach((attr)=>{
        if(providedDetails) {
          if (attr.includes(':')) {
            const keyValue = attr.split(':');
            obj[keyValue[0]] = providedDetails[keyValue[1]].toString()
          } else {
            obj[attr] = providedDetails[attr].toString()
          }
        }
        else{
          obj[attr] = defaultValues[attr]
        }
      })
    }
    setData({...data, [key]:obj});
  }

  this.handleDelete = (deleteRow, position) => {
    deleteRow(position);
    setData({...(delete data[position] && data)})
  }

  this.handleSubmit = (showTable, deleteRow)=>{
    const handleDelete = this.handleDelete

    for(let key in data) {
      for (let field of this.requiredFields) {
        if (data[key][field].toString().trim().length === 0) {
          $.notify('Fill in all the required fields', {position: "top right", autoHideDelay: 5000});
          return
        }
      }
    }

    const recordKeys = Object.keys(data);

    axios.post(url+"?data_date="+axios.defaults.data['data_date']+"", {
      records: recordKeys.map((key)=>data[key])
    })
      .then(function (response) {
        let message = "";
        if(typeof response.data === 'object'){
          let row = response.data['row'][0];
          message += (row===0)? 'No data was saved. ' : (row)+" rows saved. ";

          if(row>0){
            for (let i = 0; i <row; i++) {
              handleDelete(deleteRow, recordKeys[i])
            }
          }
          for(let key in response.data){
            if(response.data.hasOwnProperty(key)) {
              message += (key==='row')? ' At row '+1 : " "+response.data[key][0];
            }
          }
          $.notify(message, {position: "top right", autoHideDelay: 5000});
        }
        else if (response.data.toString()==='0'){
          $.notify("All data was successfully saved.", {className:"success",position: "top right", autoHideDelay: 3500});
          setTimeout(()=> {showTable()},4000);
        }
      })
      .catch(function () {
        $.notify("An error occurred", {position: "top right", autoHideDelay: 5000})
      });
  }
}
