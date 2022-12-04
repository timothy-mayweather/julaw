/** dispensing tables*/
new TableUISection('#dispensing-reg','GAS DETAILS','',[[1,'Fuel_product'],[2,'Fuel_product'],[3,'branchFuelProduct','Branch Fuel Products'],[1,'Tank'],[2,'Tank'],[1,'Pump'],[2,'Pump'],[1,'Nozzle'],[2,'Nozzle']]);

class FuelProduct extends CrudTable{
  editFields = {'name':['text','input-lower',true],'short_name':['text','input-lower',true],'description':['text','input-lower',false]}

  constructor(inst) {
    super(inst);
    this.setVars('fuel_product','/fuel-product',1);
    this.define(["NAME","SHORT","DESCRIPTION","ACTIVE"]);
    this.addFns([['name','.fuelProductName'],['short_name','.fuelProductShortName'],
      ['description','.fuelProductDesc'],['active','.fuelProductActive']],['name', 'short_name']);
    this.setEditTabVars([],[0,1,2,3]);
    this.events();
  }

  defineCells(cells, table, type) {
    cells.text = [myInp(1, 'fuelProductName input-lower'),
      myInp(1, 'fuelProductShortName input-lower'), myInp(1,'fuelProductDesc input-lower'),
      myCheckBox("fuelProductActive","checked"),deleteIcon()];

    cells.attr = [{"class":"fuelProductName"+type},{"class":"fuelProductShortName"+type},{"class":"fuelProductDesc"+type},
      {"class":"form-switch fuelProductCheck"+type},myDelAttr(table,"fuelProductDelTd"+type)];

  }

  afterFetch = (response)=>this.in__(response,1,['name', 'short_name', 'description', 'active']);
}

class BranchFuelProduct extends CrudTableAdd{
  cellHtmlClasses = ['active_check','price_input','add_rem'];
  storeCriteria = [['price','.price_input']];

  constructor(inst) {
    super(inst);
    this.setVars('BranchFuelProduct','/branch-fuel-product',['PRODUCT','PRICE','ACTIVE','-'],['product', 'price','active','addRem'],'product_id');
    this.setEditTabVars([0,1,2],'Product');
    this.events();
  }

  present(response){
    this.mergedModel = [];
    let ids = [];
    for (let i of response){
      ids.push(i['product_id'].toString());
    }
    for(let i of this.mainModelStored) {
      let temp = {};
      temp['product_id'] = i['id'];
      temp['product'] = i['short_name'];
      let idIndex = ids.indexOf(i['id'].toString());
      temp['prev-price'] = temp['price'] = (idIndex>-1)?Number(response[idIndex]['price']).toFixed(0):'';
      temp['prev-active'] = temp['active'] = (idIndex>-1)?response[idIndex]['active']:'';
      temp['id'] = (idIndex>-1)?response[idIndex]['id']:'';
      temp['price_input'] = "<input type='text' placeholder='enter price' value='"+temp['price']+"' class='form-control input-int' onfocusout='"+this.inst+".beforeUpdate(this)' required>";
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
        else if(j==='price'){
          i[j]['class'] = 'price_input'
          i[j]['data-prev'] = i['prev-price'];
          i[j]['price_input'] = i['price_input'];
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
}

class Tank extends CrudTable{
  products = [];

  constructor(inst) {
    super(inst);
    this.setVars('tank','/tank');
    this.define(["FUEL","NAME","CAPACITY","RESERVE","WORKING CAP.","DESCRIPTION","ACTIVE"]);
    this.addFns([['fuel','.fuelType'],['name','.tankName'],['capacity','.tankCapacity'],['reserve','.tankReserve'],
      ['description','.tankDesc'],['active','.tankActive']],['name', 'fuel', 'capacity','reserve']);
    this.setEditTabVars([['fuel','product']],[0,1,2,3,4,5,6]);
    this.events();
    this.t1.process = (node)=>this.process(node);
    this.t2.process = (node)=>this.process(node);
  }

  defineCells(cells, table, type) {
    cells.text = [mySel( 'fuelType', table),
      myInp(1, 'tankName input-lower'), myInp(1,'tankCapacity input-float',table),myInp(1,'tankReserve input-float',table),"",
      myInp(1,'tankDesc input-lower'),myCheckBox("tankActive","checked"),deleteIcon()];

    cells.attr = [{"class":"fuelType"+type},{"class":"tankName"+type},{"class":"tankCapacity"+type},{"class":"tankReserve"+type},{"class":"tankWorkingCap tankWorkingCap"+type},
      {"class":"tankDesc"+type},{"class":"form-switch tankCheck"+type},myDelAttr(table,"tankDelTd"+type)];

    if(type==='Edit')
      this.editFields = {'name':['text','input-lower',true],'capacity':['text','input-float',true,table],'reserve':['text','input-float',true,table],'description':['text','input-lower',false]};
  }

  provide = (node)=>super.provide(node, '/branch-fuel-product', this.products, 'short_name','_'+b$_);

  afterShow = (response)=>{
    let keys = ['fuel', 'name', 'capacity', 'reserve', 'working', 'description', 'active'];
    let modAttrs = {'fuel':{'product':'fuel_id'}};
    let modResponse = {'fn':[['working','calculate',['capacity','reserve']]]};
    this.in__(response,0,keys,modAttrs,modResponse);
  }

  calculate(capacity,reserve) { return (Number(capacity)-Number(reserve)).toFixed(0).toString(); }

  process(node) {
    let row = $(node.closest('tr'));
    if(row[0].className.includes('Create'))
      row.children('.tankWorkingCap').html((Number(row.find('.tankCapacity')[0].value)-Number(row.find('.tankReserve')[0].value)).toString());
    else {
      if(node.closest('td').className.includes('capacity')){
        this.editTable.DataTable().cell(row.children('.workingTdEdit')).data((Number(node.value)-Number(row.find('.reserveTdEdit')[0].innerHTML)).toString());
      }
      else{
        this.editTable.DataTable().cell(row.children('.workingTdEdit')).data((Number(row.find('.capacityTdEdit')[0].innerHTML)-Number(node.value)).toString());
      }
    }
  }
}

class Pump extends CrudTable{
  editFields = {'name':['text','input-lower',true],'description':['text','input-lower',false]};

  constructor(inst) {
    super(inst);
    this.setVars('pump','/pump');
    this.define(["NAME","DESCRIPTION","ACTIVE"]);
    this.addFns([['name','.pumpName'],['description','.pumpDesc'],['active','.pumpActive']],['name']);
    this.setEditTabVars([],[0,1,2]);
    this.events();
  }

  defineCells(cells, table, type) {
    cells.text = [myInp(1, 'pumpName input-lower'),myInp(1, 'pumpDesc input-lower'),
      myCheckBox("pumpActive","checked"),deleteIcon()];

    cells.attr = [{"class":"pumpName"+type},{"class":"pumpDesc"+type},
      {"class":"form-switch pumpCheck"+type},myDelAttr(table,"pumpDelTd"+type)];
  }

  afterShow = (response)=>this.in__(response,0,['name','description','active']);
}

class Nozzle extends CrudTable{
  providence = {"tanks":{uri:'/tank',rec:[]},"pumps":{uri:'/pump',rec:[]}}
  editFields = {'tank':['select','tank',null],'pump':['select','pump',null],'name':['text','input-lower',true]};

  constructor(inst) {
    super(inst);
    this.setVars('nozzle','/nozzle');
    this.define(["TANK","PUMP","NAME","ACTIVE"]);
    this.addFns([['tank','.tankName'],['name','.nozzleName'],['pump','.pumpName'],
      ['active','.nozzleActive']],['name', 'tank', 'pump']);

    this.setEditTabVars([['tank','tank'],['pump','pump']],[0,1,2,3]);
    this.events();
  }

  defineCells(cells, table, type) {
    cells.text = [mySel( 'tankName', table),mySel( 'pumpName', table),
      myInp(1, 'nozzleName input-lower'), myCheckBox("nozzleActive","checked"),deleteIcon()];

    cells.attr = [{"class":"tankName"+type},{"class":"pumpName"+type},{"class":"nozzleName"+type},
      {"class":"form-switch nozzleCheck"+type},myDelAttr(table,"nozzleDelTd"+type)];
  }

  provide = (node)=>{
    let obj = (node.className.includes('tank')||node.getAttribute('data-name')==='tank')?this.providence.tanks:this.providence.pumps;
    super.provide(node, obj.uri, obj.rec, 'name',(obj.uri==='/tank')?'_'+b$_:b$_);
  }

  afterShow = (response)=>this.in__(response,0,['tank', 'pump', 'name', 'active'],{'tank':{'tank':'tank_id'},'pump':{'pump':'pump_id'}});
}

/** product tables*/
let pType = ['<label for="productType" id="typeH" style="width: 60%;" hidden>\n' +
'<input type="text" class="form-control" id="productType" placeholder="e.g lubricant" style="width: 100%; display:inline;">\n' +
'</label><button type="button" class="btn btn-outline-primary" id="addProductTypeBtn">Add Product Type</button>',
  '<button type="button" class="btn btn-outline-primary" id="editProductTypeBtn">View Or Edit Product Types</button>\n' +
  '<button type="button" class="btn btn-outline-success" id="editProductTypeReloadBtn" hidden><span class="spinner-grow spinner-grow-sm"></span> Reload</button>\n' +
  '<div id="productTypeEditArea" hidden></div>'
];

new TableUISection('#products-reg','PRODUCTS','Product',[[0,pType[0]],[0,pType[1]],[1],[2],[3,'branchProduct','Branch Products']]);

class ProductTypeForm extends CRUD{
  uri = "/product-type";
  addProductTypeBtn = $("#addProductTypeBtn");
  productType = $("#productType");
  typeViewArea = $('#typeViewArea');
  editTypeBtn = $('#editProductTypeBtn');
  editTypeReloadBtn = $('#editProductTypeReloadBtn');
  typeEditArea = $('#productTypeEditArea');
  updating = false;
  refetched = '';
  tempStr = '';
  fetched = "";

  constructor(inst) {
    super();
    this.inst = inst;
    this.events();
  }

  events(){
    this.productType.on("input", ()=>{
      let str = this.productType.val();
      this.productType.val("");
      this.productType.val(str.toLowerCase());
    });
    this.addProductTypeBtn.on("click",()=>{
      let typeH = __("#typeH");
      if(typeH.hidden){
        showEl([typeH]);
        this.addProductTypeBtn.html("<i class='fas fa-check' title='Submit'></i>").attr('class','btn btn-outline-success footbtn');
      }
      else{
        let type = __("#productType");
        if((type.value.trim()).length===0){
          hideEl([typeH]);
          this.addProductTypeBtn.html('Add Product Type').attr('class','btn btn-outline-primary');
          return;
        }
        this.store({records:[{type: type.value}]});
      }
    });
    this.editTypeBtn.on("click",()=>{
      if(this.typeEditArea.attr('hidden')){
        this.typeEditArea.html("").attr('hidden',false);
        this.editTypeBtn.html("hide list").attr('class','btn btn-outline-success');
        this.fetched = "";
        this.tempStr = '';
        this.fetch();
        this.refetch();
      }
      else{
        this.stopFetch();
        this.updating = false;
        this.typeEditArea.attr('hidden',true);
        this.editTypeBtn.html("View Or Edit Product Types").attr('class','btn btn-outline-primary');
      }
    });
    this.editTypeReloadBtn.on("click",()=>this.represent());
  }

  present(response=this.fetched){
    let list = "<ul style='padding:5px;'>";
    for (let i = 0; i < response.length; i++) {
      list += "<li style='list-style-type:none' id='type_list"+response[i]['id']+"'>" + "<input type='text' value='"+response[i]['type']+"' class='form-control typeEdit' data-name='type' data-id='"+response[i]['id']+"' oninput='this.value = this.value.toLowerCase(); "+this.inst+".beforeUpdate(this)' style='width: 60%; margin: 4px; display:inline;' required='required'>" +
        "<button class='btn btn-outline-danger' onclick='if(confirm(\"Delete!\"))"+this.inst+".beforeDestroy(this);' data-id='"+response[i]['id']+"' type='button'><i class='fas fa-trash-alt' title='Delete type'></i></button>" + "" +
        "</li>";
    }
    list += "</ul>";
    this.typeEditArea.html(list);
  }

  represent(){
    this.updating = false;
    this.present();
    this.editTypeReloadBtn.attr('hidden','hidden');
  }

  afterStore = (response)=>{
    let message = "";
    if(typeof response === 'object'){
      for(let key in response){
        if(response.hasOwnProperty(key)) {
          message += " "+response[key][0];
        }
      }
      $.notify(message, {position: "top right", autoHideDelay: 5000});
    }
    else if (response==='0'){
      $.notify("Successfully saved.", {className:"success",position: "top right", autoHideDelay: 5000});
      let type = __("#productType");
      type.value = "";
    }
  }

  afterFetch = (response)=> {
    let tempStr = "";
    for (let i = 0; i < response.length; i++) tempStr += '_'+response[i]['id'];
    if(JSON.stringify(response)===JSON.stringify(this.fetched)||this.tempStr===tempStr)return;
    this.fetched=response;
    this.tempStr=tempStr;
    if(this.updating) {
      this.editTypeReloadBtn.removeAttr('hidden');
    }
    else {
      this.present();
    }
  }

  afterUpdate = (response)=>{
    this.updating = true;

    if(response===-1){
      $.notify('This field cannot be empty!');
    }
    else if(response==="1"){
      $.notify("...", {className:"success",position:'top right', showDuration:0,hideDuration:0,autoHideDelay: 150});
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
    let message = (resp===1)?"Type deleted successfully":(resp===0)?"Type does not exist":"There exist products defined by this type";
    $.notify(message, {className:(resp===1)?"info":"error",position: "top right", autoHideDelay: 5000});
    if(resp===1) {
      $("#type_list" + response['id']).remove();
    }
  }
}

class ProductReg extends CrudTable{
  choices = [];
  editFields = {'name':['text','input-lower',true],'short_name':['text','input-lower',true],'description':['text','input-lower',false],'type_name':['select','type-id','type']}

  constructor(inst) {
    super(inst);
    this.setVars('product','/product',1);
    this.define(["NAME","SHORT","DESCRIPTION","TYPE","ACTIVE"]);
    this.addFns([['name','.productName'],['short_name','.productShortName'],['type','.productType'],
      ['description','.productDesc'],['active','.productActive']],['name', 'short_name', 'type']);
    this.setEditTabVars([['type','type-id']],[0,1,2,3,4]);
    this.events();
  }

  defineCells(cells, table, type) {
    cells.text = [myInp(1, 'productName input-lower'),
      myInp(1, 'productShortName input-lower'), myInp(1,'productDesc input-lower'),
      mySel('productType', table),myCheckBox("productActive","checked"),deleteIcon()];

    cells.attr = [{"class":"productName"+type},{"class":"productShortName"+type},{"class":"productDesc"+type},
      {"class":"productType"+type},{"class":"form-switch productCheck"+type},myDelAttr(table,"productDelTd"+type)];

  }

  provide = (node)=>super.provide(node, '/product-type', this.choices, 'type');

  afterFetch = (response)=> {
    let keys = ['name', 'short_name', 'description', 'type_name', 'active'];
    let modAttrs = {'type_name':{'type-id':'type'}};
    this.in__(response,1,keys,modAttrs);
  }
}

class BranchProduct extends CrudTableAdd{
  cellHtmlClasses = ['active_check','price_input','add_rem'];
  storeCriteria = [['price','.price_input']];

  constructor(inst) {
    super(inst);
    this.setVars('BranchProduct','/branch-product',['PRODUCT','TYPE','PRICE','ACTIVE','-'],['product', 'type', 'price','active','addRem'],'product_id');
    this.setEditTabVars([0,1,2,3],'Product');
    this.events();
  }

  present(response){
    this.mergedModel = [];
    let ids = [];
    for (let i of response){
      ids.push(i['product_id'].toString());
    }
    for(let i of this.mainModelStored) {
      let temp = {};
      temp['product_id'] = i['id'];
      temp['product'] = i['short_name'];
      temp['type'] = i['type_name'];
      let idIndex = ids.indexOf(i['id'].toString());
      temp['prev-price'] = temp['price'] = (idIndex>-1)?Number(response[idIndex]['price']).toFixed(0):'';
      temp['prev-active'] = temp['active'] = (idIndex>-1)?response[idIndex]['active']:'';
      temp['id'] = (idIndex>-1)?response[idIndex]['id']:'';
      temp['price_input'] = "<input type='text' placeholder='enter price' value='"+temp['price']+"' class='form-control input-int' onfocusout='"+this.inst+".beforeUpdate(this)' required>";
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
        else if(j==='price'){
          i[j]['class'] = 'price_input'
          i[j]['data-prev'] = i['prev-price'];
          i[j]['price_input'] = i['price_input'];
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
}

/** supplier & customer tables*/
new TableUISection('#suppliers-customers-reg','SUPPLIERS & CUSTOMERS','',[[1,'Supplier'],[2,'Supplier'],[1,'Customer'],[2,'Customer'],[3,'branchCustomer','Branch Customers'],[1,'Employee'],[2,'Employee']]);

class Supplier extends CrudTable{
  editFields = {'name':['text','input-lower',true],'email':['text','input-lower',true],'phone':['text','input-lower',true],'location':['text','input-lower',true],'description':['text','input-lower',false]};

  constructor(inst) {
    super(inst);
    this.setVars('supplier','/supplier',1);
    this.define(["NAME","EMAIL","PHONE","LOCATION","DESCRIPTION","ACTIVE"]);
    this.addFns([['name','.supplierName'],['email','.supplierEmail'],['phone','.supplierPhone'],['location','.supplierLocation'],
      ['description','.supplierDesc'],['active','.supplierActive']],['name','email','phone','location']);
    this.setEditTabVars([],[0,1,2,3,4,5]);
    this.events();
  }

  defineCells(cells, table, type) {
    cells.text = [myInp(1, 'supplierName input-lower'), myInp(1, 'supplierEmail input-lower'),myInp(1, 'supplierPhone input-lower'),
      myInp(1, 'supplierLocation input-lower'),myInp(1, 'supplierDesc input-lower'),myCheckBox("supplierActive","checked"),deleteIcon()];

    cells.attr = [{"class":"supplierName"+type},{"class":"supplierEmail"+type},{"class":"supplierPhone"+type},{"class":"supplierLocation"+type},
      {"class":"supplierDesc"+type},{"class":"form-switch supplierCheck"+type},myDelAttr(table,"supplierDelTd"+type)];
  }

  afterFetch = (response)=> {
    this.in__(response,1,['name','email','phone','location','description','active']);
  }
}

class Customer extends CrudTable{
  editFields = {'name':['text','input-lower',true],'short':['text','input-lower',true]};

  constructor(inst) {
    super(inst);
    this.setVars('customer','/customer',1);
    this.define(["NAME","SHORT","ACTIVE"]);
    this.addFns([['name','.customerName'],['short','.customerShort'],['active','.customerActive']],['name','short']);
    this.setEditTabVars([],[0,1,2]);
    this.events();
  }

  defineCells(cells, table, type) {
    cells.text = [myInp(1, 'customerName input-lower'), myInp(1, 'customerShort input-lower'), myCheckBox("customerActive","checked"),deleteIcon()];

    cells.attr = [{"class":"customerName"+type},{"class":"customerShort"+type},{"class":"form-switch customerCheck"+type},myDelAttr(table,"customerDelTd"+type)];
  }

  afterFetch = (response)=> {
    this.in__(response,1,['name', 'short','active']);
  }
}

class Employee extends CrudTable{
  editFields = {};

  constructor(inst) {
    super(inst);
    this.setVars('employee','/employee',0);
    this.define(["NAME","PHONE","EMAIL","ACTIVE","USER"]);
    this.addFns([['name','.employeeName'],['phone','.employeePhone'],['email','.employeeEmail'],['active','.employeeActive'],['user','.user']],['name','phone']);
    this.setEditTabVars([],[0,1,2,3,4]);
    this.events();
  }

  defineCells(cells, table, type) { //
    cells.text = [myInp(1, 'employeeName input-lower'), myInp(1, 'employeePhone input-int'), myInp(3, 'employeeEmail'), myCheckBox("employeeActive","checked"),myCheckBox("user"), deleteIcon()];

    cells.attr = [{"class":"employeeName"+type},{"class":"employeePhone"+type},{"class":"employeeEmail"+type},{"class":"form-switch employeeCheck"+type},{"class":"form-switch user"+type},myDelAttr(table,"employeeDelTd"+type)];
  }

  isUser(user){ return user === null? 'No': 'Yes'}

  afterShow = (response)=> {
    this.in__(response,0,['name', 'phone', 'email', 'active', 'user'],{},{'fn':[['user','isUser',['user_id']]]});
  }
}

class BranchCustomer extends CrudTableAdd{
  cellHtmlClasses = ['active_check','description_input','debtor_check','prepaid_check','add_rem'];
  storeCriteria = [['description','.description_input'],['debtor','.debtor_check'],['prepaid','.prepaid_check']];

  constructor(inst) {
    super(inst);
    this.setVars('BranchCustomer','/branch-customer',['CUSTOMER','DESCRIPTION','DEBTOR','PREPAID','ACTIVE','-'],['name','description','debtor', 'prepaid','active','addRem'],'customer_id');
    this.setEditTabVars([0,1,2,3,4],'Customer');
    this.events();
  }

  present(response){
    this.mergedModel = [];
    let ids = [];
    for (let i of response){
      ids.push(i['customer_id'].toString());
    }
    for(let i of this.mainModelStored) {
      let temp = {};
      temp['customer_id'] = i['id'];
      temp['name'] = i['short'];
      let idIndex = ids.indexOf(i['id'].toString());

      temp['prev-description'] = temp['description'] = (idIndex>-1)?response[idIndex]['description']:'';
      temp['prev-debtor'] = temp['debtor'] = (idIndex>-1)?response[idIndex]['debtor']:'';
      temp['prev-prepaid'] = temp['prepaid'] = (idIndex>-1)?response[idIndex]['prepaid']:'';
      temp['prev-active'] = temp['active'] = (idIndex>-1)?response[idIndex]['active']:'';
      temp['id'] = (idIndex>-1)?response[idIndex]['id']:'';

      temp['description_input'] = "<input type='text' placeholder='description' value='"+temp['description']+"' class='form-control input-lower' onfocusout='"+this.inst+".beforeUpdate(this)'>";
      temp['active_check'] = "<input type='checkbox' class='form-check-input' onfocusout='"+this.inst+".beforeUpdate(this)' "+((idIndex>-1)?(response[idIndex]['active']==='Yes')?"checked":"":"checked")+">";
      temp['debtor_check'] = "<input type='checkbox' class='form-check-input' onfocusout='"+this.inst+".beforeUpdate(this)' "+((idIndex>-1)?(response[idIndex]['debtor']==='Yes')?"checked":"":"checked")+">";
      temp['prepaid_check'] = "<input type='checkbox' class='form-check-input' onfocusout='"+this.inst+".beforeUpdate(this)' "+((idIndex>-1)?(response[idIndex]['prepaid']==='Yes')?"checked":"":"")+">";
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
        else if(j==='debtor'){
          i[j]['class'] = 'form-switch debtor_check';
          i[j]['data-prev'] = i['prev-debtor'];
          i[j]['debtor_check'] = i['debtor_check'];
        }
        else if(j==='prepaid'){
          i[j]['class'] = 'form-switch prepaid_check';
          i[j]['data-prev'] = i['prev-prepaid'];
          i[j]['prepaid_check'] = i['prepaid_check'];
        }
        else if(j==='description'){
          i[j]['class'] = 'description_input'
          i[j]['data-prev'] = i['prev-description'];
          i[j]['description_input'] = i['description_input'];
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
}

/** expense type tables*/
new TableUISection('#expense-reg','EXPENSE TYPES','Expense_type',[[1],[2],[3,'branchExpense_type','Branch Expense Types']]);

class ExpenseType extends CrudTable{
  editFields = {'name':['text','input-lower',true],'description':['text','input-lower',false]};

  constructor(inst) {
    super(inst);
    this.setVars('expense_type','/expense-type',1);
    this.define(["NAME","DESCRIPTION","ACTIVE"]);
    this.addFns([['name','.expenseTypeName'],['description','.expenseTypeDesc'],['active','.expenseTypeActive']],['name']);
    this.setEditTabVars([],[0,1,2]);
    this.events();
  }
  defineCells(cells, table, type) {
    cells.text = [myInp(1, 'expenseTypeName input-lower'), myInp(1, 'expenseTypeDesc input-lower'),myCheckBox("expenseTypeActive","checked"),deleteIcon()];
    cells.attr = [{"class":"expenseTypeName"+type},{"class":"expenseTypeDesc"+type},{"class":"form-switch expenseTypeCheck"+type},myDelAttr(table,"expense_typeDelTd"+type)];
  }

  afterFetch = (response)=> {
    this.in__(response,1,['name', 'description', 'active']);
  }
}

class BranchExpenseType extends CrudTableAdd{
  constructor(inst) {
    super(inst);
    this.setVars('BranchExpense_type','/branch-expense-type',['EXPENSE','DESCRIPTION','ACTIVE','-'],['name', 'description','active','addRem'],'exp_id');
    this.setEditTabVars([0,1,2],'Expense type',{'name':'name','description':'description'});
    this.events();
  }
}

/** receivable type tables*/
new TableUISection('#receivable-reg','RECEIVABLE TYPES','Receivable_type',[[1],[2],[3,'branchReceivable_type','Branch Receivables']]);

class ReceivableType extends CrudTable{
  editFields = {'name':['text','input-lower',true],'description':['text','input-lower',false]};

  constructor(inst) {
    super(inst);
    this.setVars('receivable_type','/receivable-type',1);
    this.define(["NAME","DESCRIPTION","ACTIVE"]);
    this.addFns([['name','.receivableTypeName'],['description','.receivableTypeDesc'],['active','.receivableTypeActive']],['name']);
    this.setEditTabVars([],[0,1,2]);
    this.events();
  }
  defineCells(cells, table, type) {
    cells.text = [myInp(1, 'receivableTypeName input-lower'), myInp(1, 'receivableTypeDesc input-lower'),myCheckBox("receivableTypeActive","checked"),deleteIcon()];
    cells.attr = [{"class":"receivableTypeName"+type},{"class":"receivableTypeDesc"+type},{"class":"form-switch receivableTypeCheck"+type},myDelAttr(table,"receivable_typeDelTd"+type)];
  }

  afterFetch = (response)=> {
    this.in__(response,1,['name', 'description', 'active']);
  }
}

class BranchReceivableType extends CrudTableAdd{
  constructor(inst) {
    super(inst);
    this.setVars('BranchReceivable_type','/branch-receivable-type',['RECEIVABLE','DESCRIPTION','ACTIVE','-'],['name', 'description','active','addRem'],'recv_id');
    this.setEditTabVars([0,1,2],'Receivable type',{'name':'name','description':'description'});
    this.events();
  }
}

/** transaction type tables*/
new TableUISection('#transaction-reg','TRANSACTION TYPES','Transaction_type',[[1],[2],[3,'branchTransaction_type','Branch Transactions']]);

class TransactionType extends CrudTable{
  editFields = {'name':['text','input-lower',true],'description':['text','input-lower',false]};

  constructor(inst) {
    super(inst);
    this.setVars('transaction_type','/transaction-type',1);
    this.define(["NAME","DESCRIPTION","ACTIVE"]);
    this.addFns([['name','.transactionTypeName'],['description','.transactionTypeDesc'],['active','.transactionTypeActive']],['name']);
    this.setEditTabVars([],[0,1,2]);
    this.events();
  }
  defineCells(cells, table, type) {
    cells.text = [myInp(1, 'transactionTypeName input-lower'), myInp(1, 'transactionTypeDesc input-lower'),myCheckBox("transactionTypeActive","checked"),deleteIcon()];
    cells.attr = [{"class":"transactionTypeName"+type},{"class":"transactionTypeDesc"+type},{"class":"form-switch transactionTypeCheck"+type},myDelAttr(table,"transaction_typeDelTd"+type)];
  }

  afterFetch = (response)=> {
    this.in__(response,1,['name', 'description', 'active']);
  }
}

class BranchTransactionType extends CrudTableAdd{
  constructor(inst) {
    super(inst);
    this.setVars('BranchTransaction_type','/branch-transaction-type',['TRANSACTION','DESCRIPTION','ACTIVE','-'],['name', 'description','active','addRem'],'tr_id');
    this.setEditTabVars([0,1,2],'Transaction type',{'name':'name','description':'description'});
    this.events();
  }
}

/** operation objects*/
const fuelProduct = new FuelProduct('fuelProduct');
const branchFuelProduct = new BranchFuelProduct('branchFuelProduct');
const tank = new Tank('tank');
const pump = new Pump('pump');
const nozzle = new Nozzle('nozzle');
const productTypeForm = new ProductTypeForm('productTypeForm');
const productReg = new ProductReg('productReg');
const branchProduct = new BranchProduct('branchProduct');
const supplier = new Supplier('supplier');
const customer = new Customer('customer');
const employee = new Employee('employee');
const branchCustomer = new BranchCustomer('branchCustomer');
const expenseType = new ExpenseType('expenseType');
const branchExpenseType = new BranchExpenseType('branchExpenseType');
const receivableType = new ReceivableType('receivableType');
const branchReceivableType = new BranchReceivableType('branchReceivableType');
const transactionType = new TransactionType('transactionType');
const branchTransactionType = new BranchTransactionType('branchTransactionType');
