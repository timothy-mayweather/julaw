/** Helper functions*/

/**
 * Getting elements from document
 * start with '.' => for className, '#' => for id '<' => for tagName, '$' => for query
 */

function __(el){
  let start = el[0];
  let stm = el.slice(1);
  if(start==='.'){
    return document.getElementsByClassName(stm);
  }else if(start==='#'){
    return document.getElementById(stm);
  }else if(start==='<'){
    return document.getElementsByTagName(stm);
  }else if (start==='$'){
    return document.querySelectorAll(stm);
  }else if(start==='|'){
    return document.querySelector(stm);
  }
}

function _cr(el){
  let start = el[0];
  let stm = el.slice(1);
  if(start==='+'){
    return document.appendChild(stm);
  }else if(start==='-'){
    return document.removeChild(stm);
  }else if(start==='*'){
    return document.write(stm);
  }
  return document.createElement(el);
}

function showEl(elementsArray){
  for(let i = 0; i < elementsArray.length; i++)
    elementsArray[i].hidden = false;
}

function changeDate(dateString){
  if(dateString.includes('/')) {
    const arr = dateString.split('/');
    dateString = arr[2]+'-'+arr[1]+'-'+arr[0];
  } else if(dateString.includes('-')){
    const arr = dateString.split('-');
    dateString = arr[2]+'/'+arr[1]+'/'+arr[0];
  }
  return dateString;
}

function download(el,link){
  const a = _cr('a');
  a.href = link;
  a.download = el.innerHTML;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * @returns function()
 * */
function getFnFromString(string,scope=window) {
  let scopeSplit = string.split('.');
  for (let i = 0; i < scopeSplit.length - 1; i++) {
    scope = scope[scopeSplit[i]];
  }

  return scope[scopeSplit[scopeSplit.length - 1]];
}

function getToday(){
  const date = new Date();
  const day = date.getDate().toString()
  const month = (date.getMonth()+1).toString();
  // return (day.length===1?"0"+day:day)+"/"+(month.length===1?"0"+month:month)+"/"+date.getFullYear();
  return "03/12/2022";
}

const omitProperties = (obj, keys) => Object.fromEntries(Object.entries(obj).filter(([key]) => !keys.includes(key)));
