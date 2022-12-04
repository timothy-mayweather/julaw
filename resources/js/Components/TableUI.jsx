import React from 'react';

const TableUI = () => {
  return (
    <div>

    </div>
  );
};

export default TableUI;


/** table user interface section */
class TableUISection{
  outlineBtn = ' <button type="button" class="btn btn-outline-';
  constructor(id,heading,context='',childOrder=[],tableClass='registry-table') {
    this.tabClass = tableClass;
    this.id = id;
    this.context = context; //capital
    this.childOrder = childOrder;
    this.heading = heading;
    if(childOrder.length>0)
      this.make();
  }

  parentSection(heading=this.heading){
    return '<div class="card card-primary card-outline"><div class="card-header">'+
      '<h3 class="card-title">'+heading+'</h3></div><div class="card-body">';
  }
  addBtn(txt=null,context=this.context){
    return this.outlineBtn+'primary" id="add'+context+'Btn">'+(txt!==null?txt:(this.tabClass==='registry-table'?'Add '+context:'Enter '+context+'s'))+'</button>';
  }
  editBtn(txt=null,context=this.context){
    return this.outlineBtn+'primary" id="edit'+context+'Btn" clicked="0">'+(txt!==null?txt:'View Or Edit '+context+'s')+'</button>';
  }
  editStateBtn(context=this.context){
    return this.outlineBtn+'success" id="'+context.toLowerCase()+'EditState" editing="0" hidden><i class="fas fa-pen"></i> Edit</button>';
  }
  reloadBtn(context=this.context){
    return this.outlineBtn+'success" id="edit'+context+'ReloadBtn" hidden><span class="spinner-grow spinner-grow-sm"></span> Reload</button>';
  }
  addTabDiv(txt=null,context=this.context){
    return '<div style="margin-bottom:5px">'+ this.addBtn(txt,context)+
      '<table id="add'+context+'InsertTable" class="table table-bordered table-hover table-responsive form-table '+this.tabClass+'" hidden></table></div>';
  }
  editTabDiv(txt=null,context=this.context){
    return '<div style="margin-bottom:5px">'+this.editBtn(txt,context)+this.editStateBtn(context)+this.reloadBtn(context)+'<div style="margin-top:5px">'+
      '<table id="edit'+context+'InsertTable" class="table table-bordered table-hover table-striped form-table '+this.tabClass+'" style="margin-top:5px" hidden></table></div></div>';
  }
  accTabDiv(tabId,txt){
    tabId = tabId[0].toUpperCase()+tabId.slice(1);
    return  '<div style="margin-bottom:5px">'+this.outlineBtn+'primary" id="edit'+tabId+'Btn" clicked="0">View Or Edit '+txt+'</button>'+this.outlineBtn+
      'success" id="edit'+tabId+'ReloadBtn" hidden><span class="spinner-grow spinner-grow-sm"></span> Reload</button><div style="margin-top:5px">'+
      '<table id="'+tabId[0].toLowerCase()+tabId.slice(1)+'InsertTable" class="table table-bordered table-hover table-striped form-table '+this.tabClass+'" style="margin-top:5px" hidden></table></div></div>';
  }
  make(id=this.id,heading= this.heading,context=this.context,childOrder=this.childOrder){
    const el = __(id);
    let html = this.parentSection(heading)+el.innerHTML;
    for (let x of childOrder){
      if(x[0]===0){ html+='<div style="margin-bottom:5px">'+x[1]+'</div>';}
      else if(x[0]===1){
        if(1 in x && 2 in x) { html += this.addTabDiv(x[2], x[1]); }
        else if(1 in x){ html += this.addTabDiv(null, x[1]); }
        else {html += this.addTabDiv();}
      }
      else if(x[0]===2){
        if(1 in x && 2 in x) { html += this.editTabDiv(x[2], x[1]); }
        else if(1 in x){ html += this.editTabDiv(null, x[1]); }
        else {html += this.editTabDiv();}
      }
      else {html+=this.accTabDiv(x[1],x[2]); }
    }
    html+='</div></div>';
    el.innerHTML=html;
  }
}
