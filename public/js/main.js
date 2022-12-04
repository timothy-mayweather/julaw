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

/**Uses __() so ids have #*/
function showE(elementsIdArray){
  for(let i = 0; i < elementsIdArray.length; i++)
    __(elementsIdArray[i]).hidden = false;
}

function showEl(elementsArray){
  for(let i = 0; i < elementsArray.length; i++)
    elementsArray[i].hidden = false;
}

/**Uses __() so ids have #*/
function hideE(elementsIdArray){
  for(let i = 0; i < elementsIdArray.length; i++)
    __(elementsIdArray[i]).hidden = true;
}

function hideEl(elementsArray){
  for(let i = 0; i < elementsArray.length; i++)
    elementsArray[i].hidden = true;
}

function camelCase(string){
  let index = string.indexOf('_');
  while (index!==-1&&index+1<string.length){
    string = string.replace('_'+string[index+1],string[index+1].toUpperCase());
    index = string.indexOf('_');
  }
  return string;
}

function inputValidate(node){
  if (node.className.includes('input-int')) {
    let str="";
    for (let i of node.value) if (i.valueOf() >= 0) str += i;
    node.value = str;
  }
  else if (node.className.includes('input-float')) {
    let str="", dot=false;
    for (let i of node.value){
      if (i.valueOf()>=0) {
        str+=i;
      }
      else if(i==='.'&&!dot){
        str+=i;
        dot=true;
      }
    }
    node.value = str;
  }
  else if (node.className.includes('input-lower')) {
    node.value = (node.value).toLowerCase();
  }
  else if(node.className.includes('input-upper')){
    node.value = (node.value).toUpperCase();
  }
}

function dateInp(id){
  MCDatepicker.create({
    el: '#'+id,
    dateFormat: 'DD/MM/YYYY',
    selectedDate: new Date(),
    autoClose: false,
    closeOnBlur: false,
  });
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

const sideMainLinks = __('.side-main-link');
const sideLinks = __('.side-link');
let urlString = window.location.href;
const hashIndex = urlString.indexOf('#');
let done = false;
const userForm = __('#user_form');
const registryForm = __('#registry');
const shiftFields = __('.shift-field');
const datePicker = __('#datepicker');
const dt = new Date();
if(datePicker.value.trim().length<2) {
  datePicker.value = ((n) => n.length < 10 ? '0' + n : n)(dt.getDate()) + "/" + ((n) => n < 10 ? '0' + n : n)(dt.getMonth() + 1) + "/" + dt.getFullYear()
}
urlString = (hashIndex>-1)? urlString.slice(hashIndex) : "#dashboard";
__(urlString).hidden = false;

if(user_role==="manager"){
  let shiftField = __('#shift');
  shiftField.value = "0";
  shiftField.disabled = true;
}

function sideMainLinkClick(element){
  //deactivating the active links
  const activeMainLinks = __('.nav-link side-main-link active');
  const activeLinks = __('.nav-link side-link active');
  if (activeMainLinks.length>0) {
    const str = activeMainLinks[0].className;
    activeMainLinks[0].className = str.replace('active','');
  }
  if (activeLinks.length>0) {
    const str = activeLinks[0].className;
    activeLinks[0].className = str.replace('active','');
  }
  //hiding all elements that are linked.
  for (let index=0; index<sideMainLinks.length; index++){
    hideE([sideMainLinks[index].getAttribute('href')]);
  }
  for (let index=0; index<sideLinks.length; index++){
    hideE([sideLinks[index].getAttribute('href')]);
  }
  //activating clicked link
  let str1 = element.className;
  element.className = str1+' active';
  __(element.getAttribute('href')).hidden = false;
  document.title = element.getAttribute('href').substring(1);
  let dClass = datePicker.className;
  if(!userForm.hidden){
    showEl([shiftFields[0],shiftFields[1]]);
    datePicker.className = dClass.replace('col-md-5','col-md-2');
  }
  else{
    hideEl([shiftFields[0],shiftFields[1]]);
    datePicker.className = dClass.replace('col-md-2','col-md-5');
  }
}

function sideLinkClick(element){
  //deactivating the active links
  const activeMainLinks = __('.nav-link side-main-link active');
  const activeLinks = __('.nav-link side-link active');
  if (activeMainLinks.length>0) {
    const str = activeMainLinks[0].className;
    activeMainLinks[0].className = str.replace('active','');
  }
  if (activeLinks.length>0) {
    const str = activeLinks[0].className;
    activeLinks[0].className = str.replace('active','');
  }

  //activating clicked link and its parentNode link
  const str1 = element.className;
  element.className = str1+' active';

  const sideMainLink = element.closest('.has-treeview').querySelector(".side-main-link");

  let str2 = sideMainLink.className;
  sideMainLink.className = str2+' active';
  //hiding all elements that are linked
  for (let index=0; index<sideMainLinks.length; index++){
    hideE([sideMainLinks[index].getAttribute('href')]);
  }
  for (let index=0; index<sideLinks.length; index++){
    hideE([sideLinks[index].getAttribute('href')]);
  }
  //showing the elements that are linked by active links
  showE([sideMainLink.getAttribute('href'),element.getAttribute('href')]);
  document.title = element.getAttribute('href').substring(1);
  let dClass = datePicker.className;
  if(!userForm.hidden){
    showEl([shiftFields[0],shiftFields[1]]);
    datePicker.className = dClass.replace('col-md-5','col-md-2');
  }
  else{
    hideEl([shiftFields[0],shiftFields[1]]);
    datePicker.className = dClass.replace('col-md-2','col-md-5');
  }
}

for(let i=0;i<sideMainLinks.length&&done===false; i++){
  if(sideMainLinks[i].getAttribute('href')===urlString) {
    sideMainLinkClick(sideMainLinks[i]);
    done = true;
  }
}

for(let i=0;i<sideLinks.length&&done===false; i++){
  if(sideLinks[i].getAttribute('href')===urlString) {
    sideLinkClick(sideLinks[i]);
    break;
  }
}

for(let i=0; i<sideMainLinks.length; i++) {
  if(sideMainLinks[i].closest('.nav-item').querySelectorAll('.side-link').length===0) {
    sideMainLinks[i].addEventListener('click', () =>sideMainLinkClick(sideMainLinks[i]));
  }
}

for(let i=0; i<sideLinks.length; i++) {
  sideLinks[i].addEventListener('click',()=>sideLinkClick(sideLinks[i]));
}

dateInp('#datepicker');
