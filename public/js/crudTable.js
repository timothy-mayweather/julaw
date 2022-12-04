/**The creation, read, update and delete functions of a crud table/form */
class CRUD{
  token = $('meta[name="csrf-token"]').attr('content');
  uri = "";
  ajaxObjAppend = {};
  response_id = null; // for limiting data transfer for the kind of data that we already have
  dataDateRequired = false;
  shift = false;

  dateObj(str=''){
    str=str.trim();
    if(str.length>0) {
      let arr = str.split('/');
      return {'day':arr[0],'month':arr[1],'year':arr[2]};
    }
    return {'day':'','month':'','year':''};
  }

  get getShift() {return __('#shift').value;}

  get dataDate() {return __('#datepicker').value;}

  /**DB Ajax calls*/
  ajax(url,method,callback,data=null){
    let token = this.token;
    let requestHeaders =  { 'X-CSRF-TOKEN': token };

    if(sessionStorage.getItem('address')!==null){
      url=address+url;
      requestHeaders = headers;
    }
    $.ajaxSetup({
      headers: requestHeaders
    });
    const obj = {
      url: url,
      method: method,
      success:function (response){ /*console.log(response);*/ callback(response); }
    };
    for(let key in this.ajaxObjAppend) obj[key] = this.ajaxObjAppend[key];
    if (data===null){data={}}
    data._token = token;
    data.response_id = this.response_id;
    data.b = b$_;
    data.data_date = changeDate(this.dataDate);
    data.shift = this.getShift;
    if(this.dataDateRequired&&data.data_date.trim()===''){
      $.notify("Please provide date!");
      return;
    }
    if (this.shift&&data.shift.trim()===''){
      $.notify("Please provide shift!");
      return;
    }
    obj.data = data;
    $.ajax(obj);
  }

  /** after fetching data from database */
  afterFetch(response) {/*may be overridden*/}

  /**DB Display data from the database*/
  fetch(url=this.uri,callback=this.afterFetch){
    this.refetchUrl = url;
    this.refetchCallback = callback;
    this.ajax(url,"GET",callback);
  }

  /**Display data from the database after five seconds*/
  refetch(){this.fetchTime = setInterval(()=>this.fetch(this.refetchUrl,this.refetchCallback),100000);}

  /** stop the continuous fetching*/
  stopFetch = ()=>clearInterval(this.fetchTime);

  /** after storing data into database */
  afterStore(response){/*may be overridden*/}

  /**DB Store a newly created resource in storage.*/
  store = (data,url=this.uri,callback=this.afterStore)=>this.ajax(url,"POST",callback,data);

  /** after getting requested resource */
  afterShow(response){/*may be overridden*/}

  /**DB Display the specified resource.*/
  show(model,url=this.uri,callback=this.afterShow){
    this.reShowModel = model;
    this.reShowUrl = url;
    this.reShowCallback = callback;
    this.ajax(url+'/'+model,'GET',callback);
  }

  /**Display data from the database after five seconds*/
  reShow(){this.showTime = setInterval(()=>this.show(this.reShowModel,this.reShowUrl,this.reShowCallback),100000);}

  /** stop the continuous fetching of reshow method*/
  stopShow = ()=>clearInterval(this.showTime);

  /** after updating records in the database*/
  afterUpdate(response){/*may be overridden*/}

  /**DB Update the specified resource in storage.*/
  update = (url,data,callback=this.afterUpdate)=>this.ajax(url+'/update',"POST",callback,data);

  /** before updating records*/
  beforeUpdate(node){
    this.updateNode = node;
    let uri = this.uri+"/"+node.getAttribute('data-id');
    let val = node.getAttribute('type')==='checkbox'?node.checked?'Yes':'No':node.className.includes('date-input')?changeDate(node.value):node.value;
    if(typeof val === 'string') val = val.trim();
    let data = {};
    data[node.getAttribute('data-name')]=val;
    (node.hasAttribute('required')&&val==="")?this.afterUpdate(-1):this.update(uri,data);
  }

  /** after deleting from the database*/
  afterDestroy(response){/*may be overridden*/}

  /**DB Remove the specified resource from storage.*/
  destroy = (url,callback=this.afterDestroy,data={})=>this.ajax(url+'/destroy',"POST",callback,data);

  /** before deleting from the database*/
  beforeDestroy(node){
    this.destroyNode = node;
    let uri = this.uri+"/"+node.getAttribute('data-id');
    this.destroy(uri);
  }
}

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
  make(id=this.id,heading=this.heading,context=this.context,childOrder=this.childOrder){
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

/**
 * TableTemplate constructor takes in an object
 * Only property 'el' is required
 */
class TableTemplate{
  obj = {
    trigger: "",
    el: "",
    thead: {
      cells: {
        type: 'th',
        text: [],
        attr: [],
      },
    },
    tbody: {
      attr: {},
      rows: {
        number: 1,
        attr:{},
        cells: {
          type: 'td',
          text: [],
          attr: [],
          textData:[],
          textKeys:[],
          attrs:[],
        }
      },
    },
    tfoot: {
      cells: {
        type: 'th',
        text: [],
        attr: [],
      },
    },
  };

  constructor(obj=undefined) {
    if (obj === undefined) return;
    this.obj = obj;
    this.create();
  }

  __ = (el)=>__(el);

  _cr = (el)=>{return document.createElement(el);}

  create(){
    this.el = this.obj.el;
    this.table = this.__(this.el);
    this.table.hidden = false;
    if (this.obj.hasOwnProperty('trigger')) {
      if(this.obj.trigger!=="") {
        this.trigger = this.__(this.obj.trigger)
        this.trigger.hidden = true;
      }
    }
    if (this.obj.hasOwnProperty('thead')) {
      this.thead = this.createHead(this.obj.thead);
      this.table.appendChild(this.thead);
    }
    if (this.obj.hasOwnProperty('tbody')) {
      this.tbody = this.createBody(this.obj.tbody);
      this.table.appendChild(this.tbody);
    }
    if (this.obj.hasOwnProperty('tfoot')) {
      this.tfoot = this.createFoot(this.obj.tfoot);
      this.table.appendChild(this.tfoot);
    }
  }

  createHead(headAttributes) {
    let thead = this._cr('thead');
    let row = this._cr('tr');
    if (headAttributes.hasOwnProperty('attr')) {
      for (let i in headAttributes.attr) {
        if (headAttributes.attr.hasOwnProperty(i))
          thead.setAttribute(i, headAttributes.attr[i]);
      }
    }

    if (headAttributes.hasOwnProperty("cells")) {
      if (!headAttributes.cells.hasOwnProperty("type")) {
        headAttributes.cells.type = 'th';
      }
      if (headAttributes.cells.hasOwnProperty("text")) {
        for (let i = 0; i < headAttributes.cells["text"].length; i++) {
          let cell = this._cr(headAttributes.cells.type);
          if (headAttributes.cells.hasOwnProperty("attr")) {
            for (let x in headAttributes.cells.attr[i]) {
              if (headAttributes.cells.attr[i].hasOwnProperty(x))
                cell.setAttribute(x, headAttributes.cells.attr[i][x]);
            }
          }
          cell.innerHTML = headAttributes.cells["text"][i];
          row.appendChild(cell);
        }
      }
    }

    thead.appendChild(row);
    return thead;
  }

  createBodyRow(rowAttributes) {
    let row = this._cr('tr');
    if (rowAttributes.hasOwnProperty("attr")) {
      for (let i in rowAttributes.attr) {
        if (rowAttributes.attr.hasOwnProperty(i))
          row.setAttribute(i, rowAttributes.attr[i]);
      }
    }

    if (rowAttributes.hasOwnProperty("cells")) {
      if (!rowAttributes.cells.hasOwnProperty("type")) {
        rowAttributes.cells.type = "td";
      }
      if (rowAttributes.cells.hasOwnProperty("text")) {
        for (let i = 0; i < rowAttributes.cells["text"].length; i++) {
          let cell = this._cr(rowAttributes.cells.type);
          if (rowAttributes.cells.hasOwnProperty("attr")) {
            for (let x in rowAttributes.cells.attr[i]) {
              if (rowAttributes.cells.attr[i].hasOwnProperty(x))
                cell.setAttribute(x, rowAttributes.cells.attr[i][x]);
            }
          }
          cell.innerHTML = rowAttributes.cells["text"][i];
          row.appendChild(cell);
        }
      }
    }
    return row;
  }

  appendRow(rowAttributes = this.obj.tbody.rows, parentNode= this.tbody) {
    if (!rowAttributes.hasOwnProperty("number"))
      rowAttributes.number = 1;
    if(rowAttributes.cells.textData.length===0) {
      for (let i = 1; i <= rowAttributes.number; i++)
        parentNode.appendChild(this.createBodyRow(rowAttributes));
    } else {
      for (let i=0;i<rowAttributes.cells.textData.length;i++) {
        rowAttributes.cells.text = [];
        rowAttributes.cells.attr = [];
        for(let j of rowAttributes.cells.textKeys) {
          rowAttributes.cells.text.push(rowAttributes.cells.textData[i][j]);
          rowAttributes.cells.attr.push(rowAttributes.cells.attrs[i][j]);
        }
        parentNode.appendChild(this.createBodyRow(rowAttributes));
      }
    }

  }

  createBody(bodyAttributes) {
    let tbody = this._cr('tbody');
    if (bodyAttributes.hasOwnProperty("attr")) {
      for (let i in bodyAttributes.attr) {
        if (bodyAttributes.attr.hasOwnProperty(i))
          tbody.setAttribute(i, bodyAttributes.attr[i]);
      }
    }
    if (bodyAttributes.hasOwnProperty("rows"))
      this.appendRow(bodyAttributes.rows, tbody);
    return tbody;
  }

  createFoot(footAttributes) {
    let tfoot = this._cr('tfoot');
    let row = this._cr('tr');
    if (footAttributes.hasOwnProperty('attr')) {
      for (let i in footAttributes.attr) {
        if (footAttributes.attr.hasOwnProperty(i))
          tfoot.setAttribute(i, footAttributes.attr[i]);
      }
    }

    if (footAttributes.hasOwnProperty("cells")) {
      if (!footAttributes.cells.hasOwnProperty("type")) {
        footAttributes.cells.type = 'th';
      }
      if (footAttributes.cells.hasOwnProperty("text")) {
        for (let i = 0; i < footAttributes.cells["text"].length; i++) {
          let cell = this._cr(footAttributes.cells.type);
          if (footAttributes.cells.hasOwnProperty("attr")) {
            for (let x in footAttributes.cells.attr[i]) {
              if (footAttributes.cells.attr[i].hasOwnProperty(x))
                cell.setAttribute(x, footAttributes.cells.attr[i][x]);
            }
          }
          cell.innerHTML = footAttributes.cells["text"][i];
          row.appendChild(cell);
        }
      }
    }

    tfoot.appendChild(row);
    return tfoot;
  }

  deleteRow(node=null,beforeDelete=this.beforeDelete,afterDelete=this.afterDelete){
    if(node!==null&&confirm("Delete this row?")) {
      let row = node.closest("tr");
      row.setAttribute("id", "deleted");
      beforeDelete(row);
      row.remove();
      afterDelete(this.table)
    }

    let count = this.__("$"+this.el+" tbody tr").length;
    if (count === 0) {
      this.table.innerHTML = "";
      this.table.hidden = true;
      if(this.trigger!==undefined)
        this.trigger.hidden = false;
    }
  }

  //executed after determining the row to delete
  beforeDelete(row) {/*may be overridden*/}

  //executed after deleting the row
  afterDelete(table) {/*may be overridden*/}
}

class CrudTable extends CRUD{
  editFields = {};
  commonFields = {active:true,del:true}
  tableType = 1;

  constructor(inst) {
    super();
    this.inst = inst;
  }

  setVars(context,uri,getType=0,showModel=b$_){
    if(getType===0){
      this.getInfo = ()=>{ this.show(showModel); this.reShow();} /*may be overridden*/
      this.stopGetInfo = ()=>this.stopShow(); /*may be overridden*/
    } else {
      this.getInfo = ()=>{ this.fetch(); this.refetch();} /*may be overridden*/
      this.stopGetInfo = ()=>this.stopFetch(); /*may be overridden*/
    }
    this.t1 = new TableTemplate();
    this.t2 = new TableTemplate();
    this.meta = [{inst:'t1',type:'Create'},{inst:'t2',type:'Edit'}];
    this.context = context;
    this.idFix = context[0].toUpperCase()+context.slice(1);
    this.uri = uri;
    this.editBtn = $('#edit'+this.idFix+'Btn');
    this.editBtnText = this.editBtn.html();
    this.editTable = $('#edit'+this.idFix+'Table');
    this.addTable = $('#add'+this.idFix+'Table');
    this.currentEdit = $('#'+context+'EditState');
    this.reloadBtn = $('#edit'+this.idFix+'ReloadBtn');
    this.tableDef = [{'tr':'#add'+this.idFix+'Btn','el':'#add'+this.idFix+'Table'},{'tr':'#edit'+this.idFix+'Btn','el':'#edit'+this.idFix+'Table'}];
    this.addBtnId = '#add'+this.idFix+'Btn';
    this.editTableId = '#edit'+this.idFix+'Table';
    this.delBtnClass = '.'+context+'DelTdEdit';
  }

  setEditTabVars(selFields=[],editTableCols=[],delModName=this.idFix,colvis=true,editTableBtns=["copy", "excel", "csv", "pdf", "print"]){
    this.editTableBtns = editTableBtns;
    this.editTableCols = editTableCols;
    this.colvis = colvis;
    this.selFields = selFields; //special fields (select fields) to check before or after update, arrays of 0=(attr data-name), 1=attr
    this.delModName = delModName; // start with capital
    if(this.commonFields.active) this.editFields['active'] = ['checkbox'];
    if(this.commonFields.del) this.editFields['del'] = ['del'];
  }

  defineCells(cells, table, type){
    //to be overridden
  }

  define(headings,footText=null,footAttr=null){
    let count=0;
    footText = footText!==null?footText:headings;
    footAttr = footAttr!==null?footAttr:[];
    for(let i of [this.t1,this.t2]){
      let table = this.inst+'.'+this.meta[count]["inst"];
      let type = this.meta[count]["type"];
      function cr(data){return (type==='Create')?data:"-"}
      i.obj.trigger = this.tableDef[count]['tr'];
      i.obj.el = this.tableDef[count]['el'];
      i.obj.thead.cells.text = headings.slice();
      i.obj.thead.cells.text.push(cr(rowBtn(table)));
      i.obj.tbody.rows.attr = {"class": this.context+"TableRows"+type};
      this.defineCells(i.obj.tbody.rows.cells,table,type);
      i.obj.tfoot.cells.text = footText.slice();
      i.obj.tfoot.cells.text.push(cr(submitBtn(table)));
      i.obj.tfoot.cells.attr = footAttr;
      i.provide = (node)=>this.provide(node);
      count++;
    }
  }

  addFns(recFields,reqFields) {
    let t1 = this.t1;
    t1.verify = () => {
      t1.record = [];
      t1.error = false;
      let rows = t1.tbody.querySelectorAll('tr');
      for (let row of rows) {
        let details = {};
        for (let field of recFields) {
          let cell = row.querySelector('td '+field[1]);
          details[field[0]] = cell.getAttribute('type')==='checkbox'?cell.checked?'Yes':'No':(field[1].includes('Date'))?changeDate(cell.value):(typeof field[2] !== 'undefined')?cell.getAttribute(field[2]):cell.value;
        }
        t1.record.push(details);
        for (let field of reqFields) {
          if ((details[field].trim()).length === 0) {
            t1.error = true;
            break;
          }
        }
      }
    }
    t1.submit = () => {
      t1.verify();
      if (t1.error) {
        $.notify('Fill in all the required fields', {position: "top right", autoHideDelay: 5000});
      }
      else {
        this.store({records: t1.record, b: b$_});
      }
    }
  }

  events(){
    $(this.addBtnId).on("click",()=>this.t1.create());
    this.reloadBtn.on("click",()=>this.represent());
    this.editBtn.on("click", ()=>{
      if(this.editBtn.attr('clicked')==='0'){
        this.getInfo();
      }
      else {
        this.edit(1);
        this.currentEdit.attr({'editing':'0',}).html('<i class="fas fa-pen"></i> Edit');
        this.create_destroy(0);
        hideEl([this.editTable[0],this.currentEdit[0]]);
        this.editBtn.attr({'clicked':'0','class':'btn btn-outline-primary'}).text(this.editBtnText);
        this.stopGetInfo();
      }
    });
    this.currentEdit.on("click",()=>this.edit(Number(this.currentEdit.attr('editing'))));
  }

  in_provide(uri,rowData,optionNode,selectNode){/*to be overridden*/}

  provide(node,uri,stored,fieldName,showModel=null,selectively=false){
    if(this.dataDateRequired&&this.dataDate.trim()===""){
      $.notify("Please provide a date!");
      return;
    }
    const currentClass = this;
    let provideModel = new CRUD();
    provideModel.uri = uri;

    function provide(response){
      let choices, currentOption = node.value;
      if(selectively){
        let nodeClassElements = __("."+node.className);
        let ids = [];
        choices = Array.from(response);
        choices.forEach((el)=>{ids.push(el['id'])});
        //removing already selected options
        [...nodeClassElements].forEach((el)=>{
          let position=ids.indexOf(el.value);
          if ((position>=0)&&(currentOption!==el.value)){
            choices.splice(position, 1);
            ids.splice(position,1);
          }
        });
      }
      else{
        choices  = response;
      }
      let count = choices.length;
      node.innerHTML = "";
      for (let i = 0; i < count; i++){
        if(choices[i].hasOwnProperty('active')){
          if(choices[i]['active']==='No') continue;
        }
        let selectOption = document.createElement("option");
        selectOption.setAttribute("value", choices[i]['id']);
        selectOption.innerText = choices[i][fieldName];
        if(currentOption.toString()===(choices[i]['id']).toString())
          selectOption.setAttribute("selected", "selected");
        node.appendChild(selectOption);
        currentClass.in_provide(uri,choices[i],selectOption,node);
      }
    }

    if(stored.length>0){
      provide(stored);
    }

    if(showModel===null) {
      provideModel.afterFetch = (response) => {
        if (JSON.stringify(response) !== JSON.stringify(stored)) {
          stored = Array.from(response);
          provide(response);
        }
      }
      provideModel.fetch();
    }
    else {
      provideModel.afterShow = (response) => {
        if (JSON.stringify(response) !== JSON.stringify(stored)) {
          stored = Array.from(response);
          provide(response);
        }
      }
      provideModel.show(showModel);
    }
  }

  afterStore = (response)=>{
    let message = "";
    if(typeof response === 'object'){
      let row = response['row'][0];
      message += (row===0)? 'No data was saved. ' : (row)+" rows saved. ";
      if(row>0){
        let bodyRows = $(this.t1.el + " tbody tr");
        for (let i = 0; i <row; i++) {
          bodyRows[i].remove();
        }
      }
      for(let key in response){
        if(response.hasOwnProperty(key)) {
          message += (key==='row')? ' At row '+1 : " "+response[key][0];
        }
      }
      $.notify(message, {position: "top right", autoHideDelay: 5000});
    }
    else if (response==='0'){
      $.notify("All data was successfully saved.", {className:"success",position: "top right", autoHideDelay: 3500});
      setTimeout(()=> {
        $(this.t1.el + " tbody").html('');
        this.t1.deleteRow();
      },4000);
    }
  }

  edit(num){
    let delBtns = $(this.delBtnClass);
    if (num===0){
      delBtns.show();
      showEl([this.editTable[0].querySelector('thead tr').lastElementChild,this.editTable[0].querySelector('tfoot tr').lastElementChild]);
      this.currentEdit.attr({'editing':'1'}).html('<i class="fas fa-stop"></i> Stop editing');
    }
    else{
      this.afterUpdate(-2);
      delBtns.hide();
      hideEl([this.editTable[0].querySelector('thead tr').lastElementChild,this.editTable[0].querySelector('tfoot tr').lastElementChild]);
      this.currentEdit.attr({'editing':'0'}).html('<i class="fas fa-pen"></i> Edit');
    }
  }

  makeDocTitle() {
    //can be overridden
    return 'Julawbook-21.07';
  }

  create_destroy(choice){
    if(choice===0) {
      this.editTable.DataTable().destroy();
      this.editTable.empty();
    }
    else {
      const cl = this;
      this.editTable.DataTable({
        "responsive": true, "lengthChange": false, "autoWidth": false, "scrollx": 100,
        "buttons": ((a=[])=>{cl.editTableBtns.forEach((i)=>a.push({extend:i,exportOptions:{columns:cl.editTableCols},title: ()=>cl.makeDocTitle()})); if(cl.colvis)a.push('colvis'); return a})(),
      }).buttons().container().appendTo(this.editTableId+'_wrapper .col-md-6:eq(0)');
      let table_wrapper = $(this.editTableId+'_wrapper');
      if(cl.colvis) table_wrapper.find('.buttons-colvis span').html('<i class="fas fa-eye"></i>');
      for (let i of cl.editTableBtns) {
        switch (i){
          case 'print': case 'copy':
            table_wrapper.find('.buttons-'+i+' span').html('<i class="fas fa-'+i+'"></i>').attr('title', i);
            break;
          default:
            table_wrapper.find('.buttons-'+i+' span').html('<i class="fas fa-file-'+i+'"></i>').attr('title', i);
        }
      }
    }
  }

  present(){
    this.t2.create();
    this.edit(Number(this.currentEdit.attr('editing'))-1);
    this.create_destroy(1);
    showEl([this.editBtn[0],this.currentEdit[0]]);
    this.editBtn.attr({'clicked': '1', 'class': 'btn btn-outline-success'}).text('hide table');
  }

  represent(){
    hideEl([this.reloadBtn[0]]);
    this.create_destroy(0);
    this.present();
    let delBtns = $(this.delBtnClass);
    this.currentEdit.attr('editing')==='0'?delBtns.hide():delBtns.show();
  }

  editor(node){
    if(this.currentEdit.attr('editing')==='0' || __('#'+this.context+'EditField')) return;
    const key = node.getAttribute('data-name');
    if (!this.editFields.hasOwnProperty(key)) return;
    let arr = this.editFields[key];
    switch (arr[0]){
      case 'select':
        if (node.firstElementChild) return;
        node.innerHTML = "<select class='form-select custom-select' onmousedown='"+this.inst+".provide(this)' onfocusout='"+this.inst+".beforeUpdate(this)' data-id='"+node.getAttribute('data-id')+"' data-name='"+(arr[2]!==null?arr[2]:node.getAttribute('data-name'))+"' id='"+this.context+"EditField' data-prev='"+node.innerHTML+"' required>" +
          "<option value='"+node.getAttribute(arr[1])+"' selected>"+node.innerHTML+"</option></select>";
        break;
      case 'text':
        if (node.firstElementChild) return;
        node.innerHTML = "<input type='text' value='"+node.innerHTML+"' class='form-control "+arr[1]+"' onfocusout='"+this.inst+".beforeUpdate(this)' data-id='"+node.getAttribute('data-id')+"' data-name='"+node.getAttribute('data-name')+"' "+(arr.length>3?"oninput='"+arr[3]+".process(this)'":"")+" id='"+this.context+"EditField' data-prev='"+node.innerHTML+"' "+(arr[2]?'required':'')+">";
        break;
      case 'checkbox':
        if (node.firstElementChild) return;
        node.className += " form-switch";
        node.innerHTML = "<input type='checkbox' class='form-check-input' "+((node.innerHTML==='Yes')?'checked':'')+" onfocusout='"+this.inst+".beforeUpdate(this)' data-id='"+node.getAttribute('data-id')+"' data-name='"+node.getAttribute('data-name')+"' id='"+this.context+"EditField' data-prev='"+node.innerHTML+"'>";
        break;
      case 'del':
        if (confirm('Delete this row!')) {
          node.id = this.context + 'DelField';
          this.beforeDestroy(node);
          return;
        }
        break;
      case 'date':
        if (node.firstElementChild) return;
        const value = node.innerHTML, id ="#"+this.context+"EditField";
        node.innerHTML = "<input type='text' value='"+node.innerHTML+"' class='form-control "+arr[1]+"' data-id='"+node.getAttribute('data-id')+"' data-name='"+node.getAttribute('data-name')+"' "+(arr.length>3?"oninput='"+arr[3]+".process(this)'":"")+" id='"+this.context+"EditField' data-prev='"+node.innerHTML+"' "+(arr[2]?'required':'')+">";
        const picker = MCDatepicker.create({
          el: id,
          dateFormat: 'DD/MM/YYYY',
          selectedDate: new Date(changeDate(value)),
          autoClose: false,
          closeOnBlur: false,
        });
        picker.onClose(()=>this.beforeUpdate(__(id)));
        break;
      case 'fileName':
        if (node.firstElementChild) return;
        const str = node.innerHTML+"$$", ar = node.innerHTML.split('.');
        const fileExt = (ar.length===1)?'':'.'+ar[ar.length-1],fileName = (ar.length===1)?node.innerHTML:str.replace('.'+ar[ar.length-1]+'$$','');
        node.innerHTML = "<input type='text' value='"+fileName+"' data-file-ext='"+fileExt+"' class='form-control "+arr[1]+"' onfocusout='this.value=this.value+this.getAttribute(\"data-file-ext\"); "+this.inst+".beforeUpdate(this)' data-id='"+node.getAttribute('data-id')+"' data-name='"+node.getAttribute('data-name')+"' "+(arr.length>3?"oninput='"+arr[3]+".process(this)'":"")+" id='"+this.context+"EditField' data-prev='"+node.innerHTML+"' "+(arr[2]?'required':'')+">";
        break;
    }
    node.firstElementChild.focus();
  }

  beforeUpdate = (node)=>{
    if (node.getAttribute('data-prev') === node.value) {
      this.afterUpdate(-2);
      return;
    }
    if(node.getAttribute('type')==='checkbox'){
      if((node.checked&&node.getAttribute('data-prev')==='Yes')||(!node.checked&&node.getAttribute('data-prev')==='No')){
        this.afterUpdate(-2);
        return;
      }
    }
    if(node.tagName ==='SELECT'&&this.selFields.length>0) {
      for (let field of this.selFields) {
        if (node.getAttribute('data-name') === field[0]) {
          if (node.value === node.parentElement.getAttribute(field[1])) {
            this.afterUpdate(-2);
            return;
          }
        }
      }
    }
    super.beforeUpdate(node);
  }

  afterUpdate = (response)=>{
    let editField = __("#"+this.context+"EditField");
    if(response===-2&&editField){
      editField.parentElement.innerHTML = editField.getAttribute('data-prev');
    } else if(response===-1){
      $.notify('This field cannot be empty!');
      editField.parentElement.innerHTML = editField.getAttribute('data-prev');
    } else if(response==="1"){
      $.notify("Successfully updated", {className:"success",position:'top right', autoHideDelay: 5000});
      let cell = this.editTable.DataTable().cell(editField.parentElement);

      if(editField.tagName==='SELECT'&&this.selFields.length>0) {
        for (let field of this.selFields) {
          if (editField.getAttribute('data-name') === field[0]) {
            editField.parentElement.setAttribute(field[1],editField.value);
            cell.data(editField.options[editField.selectedIndex].text);
            break;
          }
        }
      }
      else if(editField.getAttribute('type')==='checkbox'){
        editField.parentElement.className = editField.parentElement.className.replace(" form-switch","");
        cell.data((editField.checked)?'Yes':'No');
      } else{
        cell.data(editField.value);
      }
    }
    else if(typeof response === 'object'){
      let message = "";
      for(let key in response){
        if(response.hasOwnProperty(key)) {
          message += " "+response[key][0];
        }
      }
      $.notify(message, {position: "top right", autoHideDelay: 5000});
      editField.parentElement.innerHTML = editField.getAttribute('data-prev');
    }
  }

  afterDestroy = (response)=>{
    response = JSON.parse(response);
    let resp = Number(response['resp']);
    let delField = $("#"+this.context+"DelField");
    let message = (resp===1)?this.delModName+" deleted successfully":(resp===0)?this.delModName+" does not exist":"This "+this.delModName.toLowerCase()+" has associated records";
    $.notify(message, {className:(resp===1)?"info":"error",position: "top right", autoHideDelay: 5000});
    if(resp===1)
      this.editTable.DataTable().row(delField.closest('tr')).remove().draw();
    if(delField)
      delField.removeAttr('id');
  }

  /** executed inside afterShow or AfterFetch Method and only for edit tables
   * ||response is passed in afterShow or AfterFetch method
   * ||caller is 0 for afterShow and 1 for afterFetch
   * ||modResponse (object) modifies response
   * ||keys (string array) headings for the table and determine attributes for each row
   * ||modAttrs (object) modifies attributes
   * ||setDelField (bool) sets a delete field for every row
   * */
  in__(response,caller,keys=[],modAttrs={},modResponse={},setDelField=true){
    if(response.length===0){
      $.notify('No data!');
      caller===0?this.stopShow():this.stopFetch();
      return;
    }
    if(setDelField){
      keys.push('del');
      modResponse['del'] = deleteIcon();
      modAttrs['del']  = {'class':this.delBtnClass.replace('.','')};
    }
    for(let i of response) {
      for (let key in modResponse){
        if(modResponse.hasOwnProperty(key)) {
          if(key==='fn'){
            for(let parameter of modResponse[key]){
              i[parameter[0]] = getFnFromString(parameter[1],this)(...((a=[])=>{parameter[2].forEach((str)=>a.push(i[str])); return a})());
            }
          }
          else {
            i[key] = modResponse[key];
          }
        }
      }
    }
    let respString = JSON.stringify(response);
    let attrs = JSON.parse(respString);
    let isSame = (respString===JSON.stringify(this.t2.obj.tbody.rows.cells.textData));
    this.t2.obj.tbody.rows.cells.textData = response;
    this.t2.obj.tbody.rows.cells.textKeys = keys;
    for (let i of attrs){
      for (let j of keys){
        i[j] = {'data-id':i['id'],'data-name':j,'class':j+'TdEdit','onclick':this.inst+'.editor(this)'};
        if(modAttrs.hasOwnProperty(j)){
          for (let key in modAttrs[j]){
            if (modAttrs[j].hasOwnProperty(key)) {
              i[j][key] = i[modAttrs[j][key]]!==undefined?i[modAttrs[j][key]]:modAttrs[j][key];
            }
          }
        }
      }
    }
    this.t2.obj.tbody.rows.cells.attrs = attrs;
    (this.editTable[0].hidden)?this.present():(!isSame)?showEl([this.reloadBtn[0]]):'';
  }
}

class CrudTableAdd extends CRUD{
  mergedModel = [];
  branchModelStored = [];
  mainModelStored = [];
  cellHtmlClasses = ['active_check','add_rem'];
  storeCriteria = [];

  constructor(inst) {
    super();
    this.inst = inst;
  }

  setVars(idFix='',uri='',headings=[],keys=[],refId){
    this.uri = uri;
    this.tableId = '#'+idFix[0].toLowerCase()+idFix.slice(1)+'Table';
    this.tableEl = $(this.tableId);
    this.editBtn = $('#edit'+idFix+'Btn');
    this.editBtnText = this.editBtn.html();
    this.reloadBtn = $('#edit'+idFix+'ReloadBtn');
    this.table = new TableTemplate();
    this.table.obj.el = this.tableId;
    this.table.obj.thead.cells.text = headings;
    this.table.obj.tfoot.cells.text = headings;
    this.table.obj.tbody.rows.cells.textKeys = keys;
    this.refId = refId;
  }

  setEditTabVars(editTableCols=[],modName=this.idFix,modMainModel={},colvis=true,editTableBtns=["copy", "excel", "csv", "pdf", "print"]){
    this.editTableBtns = editTableBtns;
    this.editTableCols = editTableCols;
    this.colvis = colvis;
    this.modName = modName;
    this.modMainModel = modMainModel;
  }

  events(){
    this.editBtn.on("click",()=>{
      if(this.editBtn.attr('clicked')==='0') {
        this.editBtn.html('hide table').attr({'clicked': '1','class':'btn btn-outline-success'});
        this.show(b$_);
        this.reShow();
      }
      else{
        this.stopShow();
        this.editBtn.html(this.editBtnText).attr({'clicked': '0','class':'btn btn-outline-primary'});
        this.create_destroy(0);
        this.branchModelStored = [];
        this.mainModelStored = [];
      }
    });
    this.reloadBtn.on("click",()=>this.represent());
  }

  create_destroy(choice){
    if(choice===0) {
      this.tableEl.DataTable().destroy();
      this.tableEl.empty().attr({'hidden':'hidden'});
    }
    else{
      let arr = this.editTableBtns;
      let cols = this.editTableCols;
      let colvis = this.colvis;
      const h = this;
      this.tableEl.DataTable({
        "responsive": true, "lengthChange": false, "autoWidth": false, "scrollx": 100,
        "buttons": ((a=[])=>{arr.forEach((i)=>a.push({extend:i,exportOptions:{columns:cols}})); if(colvis)a.push('colvis'); return a})(),
        drawCallback: function(){
          $('.paginate_button:not(.disabled)', this.api().table().container())
            .on('click', function(){
              h.toHtml();
            });
        }
      }).buttons().container().appendTo(this.tableId+'_wrapper .col-md-6:eq(0)');
      let table_wrapper = $(this.tableId+'_wrapper');
      if(colvis) table_wrapper.find('.buttons-colvis span').html('<i class="fas fa-eye"></i>');
      for (let i of arr) {
        switch (i){
          case 'print': case 'copy':
            table_wrapper.find('.buttons-'+i+' span').html('<i class="fas fa-'+i+'"></i>').attr('title', i);
            break;
          default:
            table_wrapper.find('.buttons-'+i+' span').html('<i class="fas fa-file-'+i+'"></i>').attr('title', i);
        }
      }
      this.toHtml();
    }
  }

  toHtml(){
    for (let className of this.cellHtmlClasses) {
      this.tableEl.find('.'+className).each(function (){
        $(this).html($(this).attr(className)).removeAttr(className)
      });
    }
  }

  present(response){
    this.mergedModel = [];
    let ids = [];
    for (let i of response){
      ids.push(i[this.refId].toString());
    }
    for(let i of this.mainModelStored) {
      let temp = {};
      temp[this.refId] = i['id'];
      for (let key in this.modMainModel){
        if(this.modMainModel.hasOwnProperty(key))
          temp[key] = i[this.modMainModel[key]];
      }
      let idIndex = ids.indexOf(i['id'].toString());
      temp['id'] = (idIndex>-1)?response[idIndex]['id']:'';
      temp['prev-active'] = (idIndex>-1)?response[idIndex]['active']:'';
      temp['active'] = (idIndex>-1)?response[idIndex]['active']:"not saved";
      temp['active_check'] = "<input type='checkbox' class='form-check-input' onfocusout='"+this.inst+".beforeUpdate(this)' "+((idIndex>-1)?(response[idIndex]['active']==='Yes')?"checked":"":"checked")+">";
      temp['add_rem'] = (idIndex>-1)?"<button type='button' onclick='if(confirm(\"Delete!\")){this.setAttribute(\"data-id\",this.parentElement.getAttribute(\"data-id\")); "+this.inst+".beforeDestroy(this)}' class='btn btn-outline-danger footbtn'><i class='fas fa-times' title='Delete Row'></i></button>": '<button type="button" class="btn btn-outline-success footbtn" onclick="'+this.inst+'.beforeStore(this)"><i class="fas fa-plus"></i></button>';
      temp['addRem'] = (idIndex>-1)?"x":"+";
      this.mergedModel.push(temp);
    }

    this.table.obj.tbody.rows.cells.textData = this.mergedModel;
    this.table.obj.tbody.rows.cells.attrs = JSON.parse(JSON.stringify(this.mergedModel));

    for(let i of this.table.obj.tbody.rows.cells.attrs){
      for (let j of this.table.obj.tbody.rows.cells.textKeys){
        i[j] = {'data-id':i['id'],'data-name':j,'data-ref-id':i[this.refId]};
        if(j==='active'){
          i[j]['class'] = 'form-switch active_check';
          i[j]['data-prev'] = i['prev-active'];
          i[j]['active_check'] = i['active_check'];
        }
        else if(j==='addRem'){
          i[j]['class'] = 'add_rem'
          i[j]['add_rem'] = i['add_rem']
        }
      }
    }
    this.table.create();
    this.create_destroy(1);
  }

  represent(){
    this.reloadBtn.attr('hidden','hidden');
    this.create_destroy(0);
    this.present(this.branchModelStored);
  }

  afterShow = (response)=>{
    if(response[0].length===0){
      $.notify('No data!');
      this.stopShow();
      return;
    }
    if(JSON.stringify(this.mainModelStored)!==JSON.stringify(response[0])){
      if(this.mainModelStored.length>0){
        this.mainModelStored = response[0];
        this.branchModelStored = response[1];
        this.reloadBtn.removeAttr('hidden');
        return;
      }
      this.mainModelStored = response[0];
      this.branchModelStored = response[1];
      this.present(response[1]);
    }
    else if(JSON.stringify(this.branchModelStored)!==JSON.stringify(response[1])) {
      this.branchModelStored = response[1];
      this.reloadBtn.removeAttr('hidden');
    }
  }

  parent(node,attrs){
    for(let attr of attrs)node.setAttribute(attr,node.parentElement.getAttribute(attr));
  }

  beforeStore(node){
    this.parent(node,['data-prev','data-id','data-name','data-ref-id']);
    this.addedRow = node.closest('tr');
    let data = {'model':node.getAttribute('data-ref-id'),'branch':b$_,'active':this.addedRow.querySelector('.active_check').firstChild.checked?'Yes':'No'};
    for(let criteria of this.storeCriteria){
      let cell = this.addedRow.querySelector(criteria[1]).firstChild;
      if(cell.hasAttribute('required')&&cell.value.trim()===''){
        $.notify('Fill in all the required fields');
        return;
      }
      data[criteria[0]] = cell.getAttribute('type')==='checkbox'?cell.checked?'Yes':'No':cell.value;
    }
    this.store(data);
  }

  beforeUpdate = (node)=>{
    this.parent(node,['data-prev','data-id','data-name','data-ref-id']);
    if(node.getAttribute('data-id')!=="") if(node.value!==node.getAttribute('data-prev')||node.getAttribute('type')==='checkbox') super.beforeUpdate(node);
  }

  afterStore = (response)=>{
    if(response===-1){
      $.notify('Already exists');
    }
    else if(typeof response === 'object'){
      let message = "";
      for(let key in response){
        if(response.hasOwnProperty(key)) {
          message += " "+response[key][0];
        }
      }
      $.notify(message, {position: "top right", autoHideDelay: 5000});
    }
    else{
      $.notify("Successfully added", {className:"success",position:'top right', autoHideDelay: 5000});

      for(let child of this.addedRow.children){
        child.setAttribute('data-id',response);
        if(child.className.search('check')>-1){
          let checkbox = {html:child.innerHTML,val:child.firstChild.checked};
          this.tableEl.DataTable().cell(child).data(checkbox.val?'Yes':'No');
          child.setAttribute('data-prev',checkbox.val?'Yes':'No');
          child.innerHTML = checkbox.html;
          checkbox.val?child.firstElementChild.setAttribute('checked',''):child.firstElementChild.removeAttribute('checked');
        }
        else if(child.hasAttribute('data-prev')){
          let inputField = {html:child.innerHTML,val:child.firstChild.value};
          this.tableEl.DataTable().cell(child).data(inputField.val);
          child.setAttribute('data-prev',inputField.val);
          child.innerHTML = inputField.html;
          child.firstElementChild.value = inputField.val;
        }
      }
      this.tableEl.DataTable().cell(this.addedRow.lastElementChild).data("x");
      this.addedRow.lastElementChild.innerHTML = "<button type='button' onclick='if(confirm(\"Delete!\")){this.setAttribute(\"data-id\",this.parentElement.getAttribute(\"data-id\")); "+this.inst+".beforeDestroy(this)}' class='btn btn-outline-danger footbtn'><i class='fas fa-times' title='Delete product from branch'></i></button>";
    }
  }

  afterUpdate = (response)=>{
    if(response===-1){
      $.notify('This field cannot be empty!');
    }
    else if(response==="1"){
      $.notify("Successfully updated", {className:"success",position:'top right', autoHideDelay: 5000});
      let par = this.updateNode.parentElement;
      let field = par.innerHTML;
      let cell = this.tableEl.DataTable().cell(par);
      if(this.updateNode.getAttribute('type')==='checkbox'){
        let val = this.updateNode.checked;
        par.setAttribute('data-prev',val?'Yes':'No');
        cell.data(val?'Yes':'No');
        par.innerHTML = field;
        val?par.firstElementChild.setAttribute('checked',''):par.firstElementChild.removeAttribute('checked');
      }
      else{
        let val = this.updateNode.value;
        par.setAttribute('data-prev',val);
        cell.data(val);
        par.innerHTML = field;
        par.firstElementChild.value = val;
      }
    }
    else if(typeof response === 'object'){
      let message = "";
      for(let key in response){
        if(response.hasOwnProperty(key)) {
          message += " "+response[key][0];
        }
      }
      $.notify(message, {position: "top right", autoHideDelay: 5000});
    }
  }

  afterDestroy = (response)=>{
    response = JSON.parse(response);
    let resp = Number(response['resp']);
    let message = (resp===1)?this.modName+" removed successfully":(resp===0)?this.modName+" does not exist":"This "+this.modName.toLowerCase()+" has associated records";
    $.notify(message, {className:(resp===1)?"info":"error",position: "top right", autoHideDelay: 5000});
    if(resp===1) {
      let row = this.destroyNode.closest('tr');
      for(let i of row.children){
        i.setAttribute('data-id','');
        if(i.className.search('active_check')>-1){
          let checkbox = {html:i.innerHTML,val:i.firstElementChild.checked};
          this.tableEl.DataTable().cell(i).data('');
          i.setAttribute('data-prev','');
          i.innerHTML = checkbox.html;
          checkbox.val?i.firstElementChild.setAttribute('checked',''):i.firstElementChild.removeAttribute('checked');
        }
        else if(i.hasAttribute('data-prev')){
          let field = {html:i.innerHTML,val:i.firstElementChild.value};
          this.tableEl.DataTable().cell(i).data('');
          i.setAttribute('data-prev','');
          i.innerHTML = field.html;
          i.firstElementChild.value = field.val;
        }
      }

      let par = this.destroyNode.parentElement;
      this.tableEl.DataTable().cell(par).data('+');
      par.innerHTML = '<button type="button" class="btn btn-outline-success footbtn" onclick="'+this.inst+'.beforeStore(this)"><i class="fas fa-plus"></i></button>';
    }
    this.destroyNode = null;
  }
}
