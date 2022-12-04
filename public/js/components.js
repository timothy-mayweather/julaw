/**InsertTable most used elements*/

/** table add row*/
function rowBtn(table,attr=""){
  return "<button type='button' title='Add Row' class='btn btn-outline-primary footbtn' onclick='"+table+".appendRow()' "+attr+"><i class='fas fa-plus'></i></button>";
}

function myCheckBox(className,checked="",attr=""){
  return "<input type='checkbox' class='form-check-input "+className+"' "+checked+" "+attr+">";
}

/** className, table*/
function mySel(className,table,attr=""){
  return "<select class='"+className+" form-control form-select custom-select' onmousedown='"+table+".provide(this)' required "+attr+"></select>";
}

/** produces delete icon*/
function deleteIcon(attr=""){
  return "<button type='button' class='btn btn-outline-danger footbtn'><i class='fas fa-trash-alt' title='Delete Row' "+attr+"></i></button>";
}

/** produces submit button*/
function submitBtn(table,attr=""){
  return "<button type='button' class='btn btn-outline-success footbtn' onclick='"+table+".submit()' "+attr+"><i class='fas fa-check' title='Submit'></i></button>";
}

/** type, className, table*/
function myInp(type,className,table=null,value=null,isNode=true,attr=""){
  type = (type===1) ? "text" : (type===2) ? "number" : (type===3) ? "email": "date";
  value = (value===null) ? "" : "value='"+value+"'";
  let node = (isNode)?"this":"";
  table = (table!==null)?"oninput='"+table+".process("+node+")'":"";
  return "<input type='"+type+"' "+value+" class='"+className+" form-control' "+table+" required "+attr+">";
}

/** table del row */
function myDelAttr(table,className=""){
  return {"class":"del "+className,"onclick":table+".deleteRow(this)","style":"vertical-align:middle; text-align: center;"};
}
