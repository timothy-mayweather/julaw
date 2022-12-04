/** document tables*/
new TableUISection('#store-files','FILES','File',[[1],[2]]);

class DocTable extends TableTemplate{

  create() {
    super.create();
    [...this.tbody.querySelectorAll('.fileDate')].forEach( function (el){ el.className+=' datepicker'});
    this.addDatePicker(this.tbody);
  }

  appendRow(rowAttributes = this.obj.tbody.rows, parentNode= this.tbody) {
    super.appendRow(rowAttributes, parentNode);
    this.addDatePicker(parentNode);
  }

  addDatePicker(parentNode){/* to be overridden*/}
}

class Doc extends CrudTable {
  editFields = {'name':['fileName','input-lower',true],'description':['text','input-lower',false],'record_date':['date','date-input',true]}
  filesArray = [];
  filesQueue = [];
  dataDateRequired = true;

  constructor(inst) {
    super(inst);
    this.setVars('file', '/file');
    this.t1 = new DocTable();
    this.uploadCallbackObj = null;
    this.define(["FILE NAME", "RECORD DATE", "DESCRIPTION"]);
    this.addFns([['index','.fileIndex'],['name','.fileName'],['record_date', '.fileDate'], ['description', '.fileDesc']], ['name','record_date','index']);
    this.setEditTabVars([], [0, 1, 2]);
    this.events();
    const thisObj = this, t1Table = __(thisObj.t1.obj.el), addBtn = $(thisObj.addBtnId), dropContainer = $('#drop-container');

    thisObj.t1.addDatePicker = (parentNode)=>{
      const datePickers = parentNode.querySelectorAll('.datepicker');
      for (let i=0; i<datePickers.length; i++){
        const id = (datePickers[i].hasAttribute('id'))?datePickers[i].id:'';
        datePickers[i].value = this.dataDate;
        datePickers[i].id = 'currentPicker';
        dateInp('#currentPicker');
        (id==='')?datePickers[i].removeAttribute('id'):datePickers[i].setAttribute('id',id);
        datePickers[i].className = datePickers[i].className.replace('datepicker','');
      }
    }
    thisObj.t1.populate = (files,callbackObj=null)=>{
      thisObj.uploadCallbackObj = callbackObj;
      thisObj.t1.obj.tbody.rows.number = files.length;
      if(t1Table.hidden){
        thisObj.t1.obj.thead.cells.text[thisObj.t1.obj.thead.cells.text.length-1] = "";
        thisObj.t1.create();
      }
      else {
        thisObj.t1.appendRow();
      }
      const fileFields = t1Table.getElementsByClassName('fileNameTd');
      [...fileFields].forEach(function (fileField,index){
        let name = files[index].name;
        const arr = name.split('.');
        if(arr.length>0){
          name = name.replace('.'+arr[arr.length-1],'');
        }
        fileField.innerHTML = "<input type='text' class='fileName form-control' value='"+name+"' required/><input type='number' required class='fileIndex input-int' value='"+index+"' hidden>";
        thisObj.filesArray.push(files[index]);
        fileField.className = fileField.className.replace('fileNameTd','');
      });
    }
    thisObj.t1.submit = () => {
      thisObj.t1.verify();
      if (thisObj.t1.error) {
        $.notify('Fill in all the required fields', {position: "top right", autoHideDelay: 5000});
      }
      else {
        thisObj.batchStore(thisObj.t1.record);
      }
    }
    thisObj.t1.controlBtn = () =>{
      if(addBtn.attr('data-drop')==='0') {
        dropContainer[0].hidden = false;
        addBtn.attr('data-drop','1').html('Close Drop Zone');
        const fileDiv = document.getElementById('files');
        fileDiv.style.maxHeight = fileDiv.offsetHeight+"px";
      } else {
        dropContainer[0].hidden = true;
        addBtn.attr('data-drop','0').html('Open Drop Zone');
      }
    }
    addBtn.attr('data-drop','0').off('click').html('Open Drop Zone').on("click",()=>thisObj.t1.controlBtn());
  }

  defineCells(cells, table, type) {
    cells.text = ["",myInp(1, 'fileDate datepicker'),myInp(1, 'fileDesc input-lower'),deleteIcon()];

    cells.attr = [{"class":"fileNameTd fileName"+type},{"class":"fileDate"+type},{"class":"fileDesc"+type},myDelAttr(table,"fileDelTd"+type)];
  }

  afterShow = (response)=>{
    const keys = ['name','record_date','description'];
    const modAttrs = {'name':{'data-alias':'alias','data-fname':'name'}};
    this.in__(response,0,keys,modAttrs,{'fn':[['record_date','changeDate',['record_date']]]});
  }

  present() {
    super.present();
    [...this.t2.tbody.getElementsByClassName('nameTdEdit')].forEach((el) => {
      if (!el.hasAttribute('data-linked')) {
        el.addEventListener("click", () => {
          if (this.currentEdit.attr('editing') === '0') {
            let link = "/download/" + el.getAttribute('data-id');
            if (sessionStorage.getItem('address') !== null) {
              link = address + link;
              if (appMode === 'desktop') {
                filename = el.innerHTML;
                alias = el.getAttribute('data-alias');
                document.getElementById('trigModal').click();
                fileId = el.getAttribute('data-id');
                fileLink = link;
                fileEl = el;
              } else {
                download(el, link)
              }
            } else {
              download(el, link);
            }
          }
        });
        el.setAttribute('data-linked', 'linked');
      }
    });
  }

  batchStore(data){
    const thisObj = this;
    let files = [];

    data.forEach(function (el){
      const file = thisObj.filesArray[parseInt(el.index)];
      const arr = file.name.split('.');
      const fileType = file.type.toLowerCase();
      let lowerExt = 'none';
      el.ext = null;
      el.dir = 'other';
      if(arr.length>0){
        el.ext = '.'+arr[arr.length-1];
        el.name += el.ext;
        lowerExt = el.ext.toLowerCase();
        if(fileType.includes('image')){
          el.dir = 'images';
        } else if(fileType.includes('video')){
          el.dir = 'videos';
        } else if(fileType.includes('audio')){
          el.dir = 'audio';
        } else if(lowerExt!=='none'){
          if(lowerExt.match(/pdf|doc|txt|dot|od|xl|xml|rtf|md|pot|pp|csv|xps/g)){el.dir = 'documents';}
          if(lowerExt.match(/zip|tar|rar|7z|arj|iso|bz2|gz|rz|xz|zst/g)){el.dir = 'compressed';}
        }
      }
      files.push({file:file,meta:el});
    });
    thisObj.filesArray = [];
    $(this.t1.el + " tbody").html('');
    this.t1.deleteRow();
    this.uploadCallbackObj.addFiles(files);
  }

  changeDate(dateString){return changeDate(dateString);}

  beforeDestroy(node){
    this.destroyNode = node;
    let uri = this.uri+"/"+node.getAttribute('data-id');
    this.destroy(uri,this.afterDestroy,{path:$(node.closest('tr')).children('.nameTdEdit').attr("data-link")});
  }
}

/** inventory tables */
new TableUISection('#inventory','INVENTORY','',[[1,'Fuel_stock'],[2,'Fuel_stock'],[1,'Tank_stock'],[2,'Tank_stock'],[2,'Stock_account', 'View Stock Accounts']]);

class FuelStock extends CrudTable{
  providence = {"fuel":{uri:'/branch-fuel-product',rec:[],field:'short_name'},"suppliers":{uri:'/supplier',rec:[],field:'name'},"files":{uri:'/file',rec:[],field:'name'}}
  dataDateRequired = true;

  constructor(inst) {
    super(inst);
    this.setVars('fuel_stock','/fuel-stock');
    this.define(["FUEL","SUPPL.","STKNO.","PRICE","QTY","AMOUNT","FILE"]);

    this.addFns([['fuel','.fuelName'],['supplier','.supplierName'],['stockNo','.stockNo'],
      ['price','.price'],['quantity','.quantity'],['file','.file']],['fuel', 'supplier', 'stockNo','price','quantity']);

    this.setEditTabVars([['fuel','fuel'],['supplier','supplier'],['file','file']],[0,1,2,3,4,5,6]);
    this.events();
    this.t1.process = (node)=>this.process(node);
    this.t2.process = (node)=>this.process(node);
  }

  defineCells(cells, table, type) {
    cells.text = [mySel( 'fuelName', table),mySel( 'supplierName', table),myInp(1, 'stockNo input-int'),
      myInp(1, 'price input-float',table), myInp(1, 'quantity input-float',table),"",mySel( 'file', table),deleteIcon()];

    cells.attr = [{"class":"fuelName"+type},{"class":"supplierName"+type},{"class":"stockNo"+type},{"class":"price"+type},{"class":"quantity"+type},
      {"class":"amount amount"+type},{"class":"file"+type},myDelAttr(table,"fuelStockDelTd"+type)];

    if(type==='Edit')
      this.editFields = {'supplier':['select','supplier',null],'file':['select','file',null],'stock_no':['text','input-int',true],
        'unit_price':['text','input-int',true,table],'quantity':['text','input-float',true,table]};
  }

  provide = (node)=>{
    let obj = (node.className.includes('fuel')||node.getAttribute('data-name')==='fuel')?this.providence.fuel:
      (node.className.includes('supplier')||node.getAttribute('data-name')==='supplier')?this.providence.suppliers:this.providence.files;
    super.provide(node, obj.uri, obj.rec, obj.field,(obj.uri==='/supplier')?null:'_'+b$_);
  }

  afterShow = (response)=>this.in__(response,0,['fuel','supplier','stock_no','unit_price','quantity','amount','file'],{'fuel':{'fuel':'fuel_id'},'supplier':{'supplier':'supplier_id'},'file':{'file':'document_id'}},{'fn':[['amount','calculate',['unit_price','quantity']]]});

  calculate(price,quantity){ return (Number(price)*Number(quantity)).toFixed(0).toString(); }

  process(node) {
    let row = $(node.closest('tr'));
    if(row[0].className.includes('Create')) {
      row.children('.amount').html((Number(row.find('.price')[0].value) * Number(row.find('.quantity')[0].value)).toString());
    }
    else {
      let className = node.closest('td').className.includes('quantity')?'.unit_priceTdEdit':'.quantityTdEdit';
      this.editTable.DataTable().cell(row.children('.amountTdEdit')).data((Number(node.value)*Number(row.find(className)[0].innerHTML)).toString());
    }
  }
}

class TankStock extends CrudTable {
  providence = {"tanks":{uri:'/tank',rec:[],field:'name'},"stock":{uri:'/fuel-stock',rec:[],field:'name'}}
  dataDateRequired = true;

  constructor(inst) {
    super(inst);
    this.setVars('tank_stock','/tank-stock');
    this.define(["TANK","STOCK","QTY STOCKED","DIFF","%AGE"]);

    this.addFns([['tank','.tankName'],['stock','.stockName'],['quantity','.quantity'],['stockFuel','.stockName','data-fuel'],['tankFuel','.tankName','data-fuel']],
      ['tank', 'stock','quantity','stockFuel','tankFuel']);

    this.setEditTabVars([['stock','stock']],[0,1,2,3,4]);
    this.events();
    this.t1.process = (node)=>this.process(node);
    this.t2.process = (node)=>this.process(node);
  }

  defineCells(cells, table, type) {
    cells.text = [mySel( 'tankName', table,"autocomplete='off'"),mySel( 'stockName', table, "autocomplete='off'"),myInp(1, 'quantity input-float',table),"","",deleteIcon()];

    cells.attr = [{"class":"tankName"+type},{"class":"stockName"+type},{"class":"quantity"+type},{"class":"diff diff"+type},
      {"class":"percentage percentage"+type},myDelAttr(table,"tankStockDelTd"+type)];

    if(type==='Edit')
      this.editFields = {'stock':['select','stock',null], 'quantity':['text','input-float',true,table]};
  }

  provide = (node)=>{
    let obj = (node.className.includes('tank')||node.getAttribute('data-name')==='tank')?this.providence.tanks:this.providence.stock;
    super.provide(node, obj.uri, obj.rec, obj.field,'_'+b$_);
  }

  in_provide(uri,rowData,optionNode,selectNode) {
    if(uri==='/fuel-stock') {
      $(optionNode).attr({"data-fuel": rowData['fuel_id'], "data-quantity": rowData['quantity'],'data-fuel-name':rowData['fuel']});
      if(!selectNode.hasAttribute('data-change-event')){
        $(selectNode).attr('data-change-event','1').on("change",(ev)=>{
          const el = ev.target;
          const row = $(el.closest('tr'));
          const selectedStock = $(el.options[el.selectedIndex]);
          if(!el.hasAttribute('data-prev')) {
            const tank = row.find('.tankName'), quantity = row.find('.quantity');
            row.find('.diff').html(Number(selectedStock.attr('data-quantity')) - Number(quantity.val()));
            row.find('.percentage').html(((Number(quantity.val()) / Number(selectedStock.attr('data-quantity'))) * 100).toFixed(1));

            const selectedTank = $(tank[0].options[tank[0].selectedIndex]);
            if (selectedTank[0] && selectedTank[0].hasAttribute('data-fuel') && (selectedStock.attr('data-fuel') !== selectedTank.attr('data-fuel'))) {
              $.notify(selectedStock.attr('data-fuel-name') + " in " + selectedTank.attr("data-fuel-name") + " tank!");
              el.removeAttribute('data-fuel');
              el.selectedIndex = -1;
            } else {
              el.setAttribute('data-fuel', selectedStock.attr('data-fuel'));
            }
          } else {
            const tank = row.find('.tankTdEdit'), quantity = row.find('.quantityTdEdit');
            this.editTable.DataTable().cell(row.find('.diffTdEdit')[0]).data(Number(selectedStock.attr('data-quantity')) - Number(quantity.html()));
            this.editTable.DataTable().cell(row.find('.percentageTdEdit')[0]).data(((Number(quantity.html()) / Number(selectedStock.attr('data-quantity'))) * 100).toFixed(1));

            if (selectedStock.attr('data-fuel') !== tank.attr('data-fuel')) {
              $.notify(selectedStock.attr('data-fuel-name') + " in " + tank.attr("data-fuel-name") + " tank!");
              el.removeAttribute('data-fuel');
              el.selectedIndex = -1;
            } else {
              el.setAttribute('data-fuel', selectedStock.attr('data-fuel'));
            }
          }
        });
      }
    } else{
      $(optionNode).attr({"data-fuel": rowData['fuel_id'],'data-fuel-name':rowData['fuel']});
      if(!selectNode.hasAttribute('data-change-event')) {
        $(selectNode).attr('data-change-event', '1').on("change", (ev)=>{
          const el = ev.target;
          const row = $(el.closest('tr'));
          const stock = row.find('.stockName');
          const selectedStock = $(stock[0].options[stock[0].selectedIndex]);
          const selectedTank = $(el.options[el.selectedIndex]);
          if(selectedStock[0]&&selectedStock[0].hasAttribute('data-fuel')&&(selectedStock.attr('data-fuel')!==selectedTank.attr('data-fuel'))){
            $.notify(selectedStock.attr("data-fuel-name")+" in "+selectedTank.attr("data-fuel-name")+" tank!");
            el.removeAttribute('data-fuel');
            el.selectedIndex = -1;
          } else {
            el.setAttribute('data-fuel',selectedTank.attr('data-fuel'));
          }
        });
      }
    }
  }

  afterShow = (response)=>{
    const modAttrs = {'tank':{'data-fuel':'fuel_id','data-fuel-name':'fuel',},'stock':{'stock':'stock_id','data-fuel':'fuel_id','data-fuel-name':'fuel','data-quantity':'stockQuantity'}};
    this.in__(response,0,['tank','stock','quantity','diff','percentage'],modAttrs,{'fn':[['diff','calculateDiff',['stockQuantity','quantity']],['percentage','calculatePercentage',['stockQuantity','quantity']]]});
  }

  calculateDiff(stock,quantity){ return (Number(stock)-Number(quantity)).toFixed(0).toString(); }

  calculatePercentage(stock,quantity){ return ((Number(quantity)/Number(stock))*100).toFixed(1).toString(); }

  process(node) {
    let row = $(node.closest('tr'));
    if(row[0].className.includes('Create')) {
      const stock = row.find('.stockName')[0], option = stock.options[stock.selectedIndex], quantity = row.find('.quantity');
      row.find('.diff').html(Number(option.getAttribute('data-quantity')) - Number(quantity.val()));
      row.find('.percentage').html(((Number(quantity.val()) / Number(option.getAttribute('data-quantity'))) * 100).toFixed(1));
    }
    else {
      const stock = row.find('.stockTdEdit');
      this.editTable.DataTable().cell(row.find('.diffTdEdit')[0]).data(Number(stock.attr('data-quantity')) - Number(node.value));
      this.editTable.DataTable().cell(row.find('.percentageTdEdit')[0]).data(((Number(node.value) / Number(stock.attr('data-quantity'))) * 100).toFixed(1));
    }
  }
}

class StockAccount extends CrudTable{
  dataDateRequired = true;

  constructor(inst) {
    super(inst);
    this.setVars('stock_account','/dip', 0, '_'+b$_);

    this.define(["TANK", "OPENING", "NEW", "ACTUAL", "CLOSING", "PER DIPS", "LOSS"],["TOTAL", "N/A"],
      [{"colspan": "4", "style": "text-align:left;"}, {"colspan": "3","style": "text-align:left;"}, {}]);

    this.setEditTabVars([],[0,1,2,3,4,5,6]);
    this.events();
  }

  defineCells(cells, table, type) {
    cells.text = [mySel('tankName', table), myInp(1, 'openingDips input-float',table),
      "0", myInp(1, 'closingDips input-float',table), "0", "0", "0", deleteIcon()];

    cells.attr = [{"class": "tankName"+type}, {"class": "openingDips"+type}, {"class": "stock stock"+type},  {"class": "byMeters byMeters"+type},
      {"class": "byDips byDips"+type}, {"class": "closingDips"+type}, {"class": "diff diff"+type}, myDelAttr(table,"dipDelTd"+type)];
  }

  afterShow = (response)=>{
    let keys = ['tank', 'opening', 'new', 'actual', 'closing', 'per_dips', 'loss'];
    let modAttrs = {'tank':{'tank':'tank_id'}};
    this.in__(response,0,keys,modAttrs);
  }

}

/** dip tables*/
new TableUISection('#dips','DIPS','Dip',[[1],[2]]);

class Dip extends CrudTable{
  tankStock = [];
  dataDateRequired = true;

  constructor(inst) {
    super(inst);
    this.setVars('dip','/dip');

    this.define(["TANK", "OPENING", "NEW", "CLOSING", "SALE (DIPS)", "SALE (METERS)", "DIFF"],["TOTAL", "N/A"],
      [{"colspan": "4", "style": "text-align:left;"}, {"colspan": "3","style": "text-align:left;"}, {}]);

    this.addFns([['tank','.tankName'],['opening','.openingDips'],['closing','.closingDips']],['tank','opening','closing']);
    this.setEditTabVars([],[0,1,2,3,4,5,6]);
    this.events();
    this.t1.process = (node)=>this.process(node);
    this.t2.process = (node)=>this.process(node);
  }

  defineCells(cells, table, type) {
    cells.text = [mySel('tankName', table), myInp(1, 'openingDips input-float',table),
      "0", myInp(1, 'closingDips input-float',table), "0", "0", "0", deleteIcon()];

    cells.attr = [{"class": "tankName"+type}, {"class": "openingDips"+type}, {"class": "stock stock"+type}, {"class": "closingDips"+type},
      {"class": "byDips byDips"+type}, {"class": "byMeters byMeters"+type}, {"class": "diff diff"+type}, myDelAttr(table,"dipDelTd"+type)];

    if(type==='Edit')
      this.editFields = {'opening':['text','input-float',true,table],'closing':['text','input-float',true,table]};
  }

  provide = (node)=>super.provide(node, '/tank-stock', this.tankStock, 'name', '_'+b$_, true);

  in_provide(uri,rowData,optionNode,selectNode) {
    $(optionNode).attr({"data-stock": rowData['stock'],"data-meters": rowData['meters'],"data-opening": rowData['opening']});
    if(!selectNode.hasAttribute('data-change-event')){
      $(selectNode).attr('data-change-event','1').on("change",(ev)=>{
        const el = ev.target;
        const row = $(el.closest('tr'));
        const stock = $(el.options[el.selectedIndex]);
        const newStock = Number(stock.attr('data-stock'));
        const meters = Number(stock.attr('data-meters'));
        const opening = Number(stock.attr('data-opening'))
        const closing = Number(row.find('.closingDips').val());
        row.find('.stock').html(newStock);
        row.find('.openingDips').val(opening);
        row.find('.byDips').html(opening+newStock-closing);
        row.find('.byMeters').html(meters);
        row.find('.diff').html((opening+newStock-closing-meters).toFixed(2));
      });
    }
  }

  afterShow = (response)=>{
    let keys = ['tank', 'opening', 'stock', 'closing','byDips','byMeters','diff'];
    let modAttrs = {'tank':{'tank':'tank_id'}};
    this.in__(response,0,keys,modAttrs);
  }

  process(node) {
    let row = $(node.closest('tr'));
    if(row[0].className.includes('Create')) {
      let byDips = Number(row.find('.openingDips').val())+Number(row.find('.stock').html())-Number(row.find('.closingDips').val());
      row.children('.byDips').html(byDips.toFixed(2).toString());
      row.children('.diff').html((byDips-Number(row.find('.byMeters').html())).toFixed(2).toString());
    }
    else {
      const opening = node.getAttribute('data-name').includes('opening')?Number(node.value):Number(row.children('.openingTdEdit').html());
      const closing = node.getAttribute('data-name').includes('closing')?Number(node.value):Number(row.children('.closingTdEdit').html());
      const byDips = (opening+Number(row.children('.stockTdEdit').html())-closing).toFixed(2);
      const byMeters = Number(row.children('.byMetersTdEdit').html());
      this.editTable.DataTable().cell(row.children('.byDipsTdEdit')[0]).data(byDips);
      this.editTable.DataTable().cell(row.children('.diffTdEdit')[0]).data((byDips-byMeters).toFixed(2));
    }
  }
}

/** meter tables*/
new TableUISection('#meters','METERS','Meter',[[1],[2]]);

class Meter extends CrudTable{
  nozzles = [];
  dataDateRequired = true;
  shift = true;

  constructor(inst) {
    super(inst);
    this.setVars('meter',"/meter");

    this.define(["NOZZLE", "OPENING", "CLOSING", "RTT", "LITRES", "PRICE", "AMOUNT"],["TOTAL", "", "", ""],
      [{"colspan": "4", "style": "text-align:left;"}, {"class": "totalLitres"},{},{"class": "totalAmount"},{}]);

    this.addFns([['fuel','.fuel'],['nozzle','.nozzle'],['opening','.openingMeter'],['closing','.closingMeter'],['rtt','.rtt'],
      ['price','.price'],['oldPrice','.oldPrice']],['nozzle','opening','closing','rtt','price']);

    this.setEditTabVars([],[0,1,2,3,4,5,6]);
    this.events();
    this.t1.process = (node)=>this.process(node);
    this.t1.afterDelete = (table)=>{$(table.querySelector('input')).trigger('input');}
    this.t2.process = (node)=>this.process(node);
  }

  defineCells(cells, table, type) {
    cells.text = [myInp(1, 'fuel',null,null,true,'hidden')+mySel('nozzle', table), myInp(1, 'openingMeter input-float', table)
    , myInp(1, 'closingMeter input-float', table), myInp(1, 'rtt input-float', table, '0.00'),
    "", myInp(1, 'price input-float', table)+myInp(1, 'oldPrice input-float', null, null, true, "hidden "), "", deleteIcon()];

    cells.attr = [{"class": "nozzle"+type}, {"class": "openingMeter"+type}, {"class": "closingMeter"+type}, {"class": "rtt"+type},
      {"class": "litres litres"+type}, {"class": "price"+type}, {"class": "amount amount"+type}, myDelAttr(table,"meterDelTd"+type)];

    if(type==='Edit')
      this.editFields = {'opening':['text','input-float',true,table],'closing':['text','input-float',true,table],'rtt':['text','input-float',true,table],'price':['text','input-float',true,table]};
  }

  provide = (node)=>super.provide(node, '/nozzle', this.nozzles, 'name', '_'+b$_, true);

  in_provide(uri,rowData,optionNode,selectNode) {
    if(!selectNode.hasAttribute('data-prev')){
      let attrObj = {"data-price": rowData['price'],"data-fuel":rowData['fuel'], "data-opening":rowData['opening']};
      if(user_role==="manager"){
        attrObj["data-closing"]=rowData['closing'];
        attrObj["data-rtt"]=rowData['rtt'];
      }
      $(optionNode).attr(attrObj);
      if (!selectNode.hasAttribute('data-change-event')) {
        $(selectNode).attr('data-change-event', '1').on("change", (ev) => {
          const el = ev.target;
          const row  = $(el.closest('tr'));
          row.find('.oldPrice').val(Number($(el.options[el.selectedIndex]).attr('data-price')));
          row.find('.price').val(Number($(el.options[el.selectedIndex]).attr('data-price'))).trigger("input");
          row.find('.openingMeter').val(Number($(el.options[el.selectedIndex]).attr('data-opening'))).trigger("input");
          row.find('.fuel').val($(el.options[el.selectedIndex]).attr('data-fuel'));
          if(user_role==="manager"){
            row.find('.closingMeter').val(Number($(el.options[el.selectedIndex]).attr('data-closing'))).trigger("input");
            row.find('.rtt').val(Number($(el.options[el.selectedIndex]).attr('data-rtt'))).trigger("input");
          }
        });
      }
    }
  }

  afterShow = (response)=>{
    let keys = ['nozzle', 'opening', 'closing', 'rtt','litres','price','amount'];
    this.in__(response,0,keys,{nozzle:{'nozzle':'nozzle_id'}});
  }

  present() {
    super.present();
    let litreSum=0, amountSum=0;
    [...this.editTable[0].getElementsByClassName('litresTdEdit')].forEach((el)=>{
      litreSum+=Number(el.innerHTML);
    });
    [...this.editTable[0].getElementsByClassName('amountTdEdit')].forEach((el)=>{
      amountSum+=Number(el.innerHTML);
    });
    this.editTable.find('.totalLitres').html(litreSum.toFixed(2));
    this.editTable.find('.totalAmount').html(amountSum);
  }

  process(node) {
    let row = $(node.closest('tr'));
    if(row[0].className.includes('Create')) {
      const litres = Number(row.find('.closingMeter').val())-Number(row.find('.openingMeter').val())-Number(row.find('.rtt').val());
      const amount = litres*Number(row.find('.price').val());
      let litreSum=0, amountSum=0;
      row.children('.litres').html(litres.toFixed(2).toString());
      row.children('.amount').html(amount.toFixed(0).toString());

      [...this.addTable[0].getElementsByClassName('litres')].forEach((el)=>{
        litreSum+=Number(el.innerHTML);
      });
      [...this.addTable[0].getElementsByClassName('amount')].forEach((el)=>{
        amountSum+=Number(el.innerHTML);
      });
      this.addTable.find('.totalLitres').html(litreSum.toFixed(2));
      this.addTable.find('.totalAmount').html(amountSum.toFixed(0));
    }
    else {
      const litres = Number(row.find('.closingMeter').val())-Number(row.find('.openingMeter').val())-Number(row.find('.rtt').val());
      const amount = litres*Number(row.find('.price').val());
      let litreSum=0, amountSum=0;
      row.children('.litres').html(litres.toFixed(2).toString());
      row.children('.amount').html(amount.toFixed(0).toString());

      [...this.addTable[0].getElementsByClassName('litres')].forEach((el)=>{
        litreSum+=Number(el.innerHTML);
      });
      [...this.addTable[0].getElementsByClassName('amount')].forEach((el)=>{
        amountSum+=Number(el.innerHTML);
      });
      this.addTable.find('.totalLitres').html(litreSum.toFixed(2));
      this.addTable.find('.totalAmount').html(amountSum.toFixed(0));
    }
  }
}

  /** item tables*/
new TableUISection('#sales','PRODUCT SALES','Product_sale',[[1],[2]]);

class ProductSale extends CrudTable{
  currData = [];
  dataDateRequired = true;
  shift = true;

  constructor(inst) {
    super(inst);
    this.setVars('product_sale',"/product-sale");

    this.define(["PRODUCT", "TYPE", "QTY", "PRICE", "AMOUNT"],["TOTAL", ""],
      [{"colspan": "4", "style": "text-align:left;"},{"class": "totalAmount"},{}]);

    this.addFns([['product','.product'],['quantity','.quantity'],['price','.price'],['oldPrice','.oldPrice']],['product','quantity','price']);

    this.setEditTabVars([],[0,1,2,3,4]);
    this.events();
    this.t1.process = (node)=>this.process(node);
    this.t1.afterDelete = (table)=>{$(table.querySelector('input')).trigger('input');}
    this.t2.process = (node)=>this.process(node);
  }

  defineCells(cells, table, type) {
    cells.text = [mySel('product', table),"",myInp(1, 'quantity input-float', table),
      myInp(1, 'price input-float', table)+myInp(1, 'oldPrice input-float', null, null, true, "hidden "), "", deleteIcon()];

    cells.attr = [{"class": "product"+type}, {"class": "type productType"+type}, {"class": "quantity"+type},
      {"class": "price"+type}, {"class": "amount amount"+type}, myDelAttr(table,"saleDelTd"+type)];

    if(type==='Edit')
      this.editFields = {'quantity':['text','input-float',true,table],'price':['text','input-float',true,table]};
  }

  provide = (node)=>super.provide(node, '/branch-product', this.currData, 'name', '_'+b$_, true);

  in_provide(uri,rowData,optionNode,selectNode) {
    if(!selectNode.hasAttribute('data-prev')){
      let attrObj = {"data-price": rowData['price'],"data-product-type":rowData['type']};
      // if(user_role==="manager"){
      //   attrObj["data-closing"]=rowData['closing'];
      //   attrObj["data-rtt"]=rowData['rtt'];
      // }
      $(optionNode).attr(attrObj);
      if (!selectNode.hasAttribute('data-change-event')) {
        $(selectNode).attr('data-change-event', '1').on("change", (ev) => {
          const el = ev.target;
          const row  = $(el.closest('tr'));
          row.find('.oldPrice').val(Number($(el.options[el.selectedIndex]).attr('data-price')));
          row.find('.price').val(Number($(el.options[el.selectedIndex]).attr('data-price'))).trigger("input");
          row.find('.type').html($(el.options[el.selectedIndex]).attr('data-product-type'));
          // if(user_role==="manager"){
          //   row.find('.closingMeter').val(Number($(el.options[el.selectedIndex]).attr('data-closing'))).trigger("input");
          //   row.find('.rtt').val(Number($(el.options[el.selectedIndex]).attr('data-rtt'))).trigger("input");
          // }
        });
      }
    }
  }

  present() {
    super.present();
    let amountSum=0;

    [...this.editTable[0].getElementsByClassName('amountTdEdit')].forEach((el)=>{
      amountSum+=Number(el.innerHTML);
    });
    this.editTable.find('.totalAmount').html(amountSum);
  }

  afterShow = (response)=>{
    let keys = ['name', 'type', 'quantity','price','amount'];
    this.in__(response,0,keys,{name:{'product':'product_id'}});
  }

  process(node) {
    let row = $(node.closest('tr'));
    if(row[0].className.includes('Create')) {
      const amount = Number(row.find('.quantity').val())*Number(row.find('.price').val());
      let amountSum=0;
      row.children('.amount').html(amount.toFixed(0).toString());

      [...this.addTable[0].getElementsByClassName('amount')].forEach((el)=>{
        amountSum+=Number(el.innerHTML);
      });
      this.addTable.find('.totalAmount').html(amountSum.toFixed(0));
    }
    else {
      const amountField = row.find('.amountTdEdit');
      const totAmountField = this.editTable.find('.totalAmount');

      const f = {'quantity':0,'price':0};
      ['quantity','price'].forEach((el)=>{
        f[el] = (node.getAttribute('data-name') === el)?Number(node.value):Number(row.find('.'+el+'TdEdit')[0].innerHTML);
      })
      const amount = f.quantity*f.price;
      let amountSum = Number(totAmountField.html())-Number(amountField.html())+amount
      amountField.html(amount);
      totAmountField.html(amountSum)
    }
  }
}

/** receivable tables*/
new TableUISection('#receivables','RECEIVABLES','Receivable',[[1],[2]]);

class Receivable extends CrudTable{
  receivables = [];
  dataDateRequired = true;
  shift = true;

  constructor(inst) {
    super(inst);
    this.setVars('receivable',"/receivable");

    this.define(["NAME","DESCRIPTION","AMOUNT"],["TOTAL", ""],
      [{"colspan": "2", "style": "text-align:left;"},{"class": "totalAmount"},{}]);

    this.addFns([['receivable','.receivableName'],['description','.receivableDesc'],['amount','.amount']],['amount','receivable']);

    this.setEditTabVars([['name','name']],[0,1,2]);
    this.events();
    this.t1.process = (node)=>this.process(node);
    this.t1.afterDelete = (table)=>{$(table.querySelector('input')).trigger('input');}
    this.t2.process = (node)=>this.process(node);
  }

  defineCells(cells, table, type) {
    cells.text = [mySel('receivableName',table),myInp(1, 'receivableDesc input-lower'),myInp(1, 'amount input-float', table), deleteIcon()];

    cells.attr = [{"class": "receivableName"+type}, {"class": "receivableDesc"+type}, {"class": "amount"+type},myDelAttr(table,"receivableDelTd"+type)];

    if(type==='Edit')
      this.editFields = {'name':['select','name',null],'description':['text','input-lower'],'amount':['text','input-float',true,table]};
  }

  provide = (node)=>super.provide(node, '/branch-receivable-type', this.receivables, 'name', '_'+b$_, true);

  in_provide(uri,rowData,optionNode,selectNode) {
    // if(!selectNode.hasAttribute('data-prev')){
    //   let attrObj = {"data-price": rowData['price'],"data-fuel":rowData['fuel'], "data-opening":rowData['opening']};
    //   if(user_role==="manager"){
    //     attrObj["data-closing"]=rowData['closing'];
    //     attrObj["data-rtt"]=rowData['rtt'];
    //   }
    //   $(optionNode).attr(attrObj);
    //   if (!selectNode.hasAttribute('data-change-event')) {
    //     $(selectNode).attr('data-change-event', '1').on("change", (ev) => {
    //       const el = ev.target;
    //       const row  = $(el.closest('tr'));
    //       row.find('.oldPrice').val(Number($(el.options[el.selectedIndex]).attr('data-price')));
    //       row.find('.price').val(Number($(el.options[el.selectedIndex]).attr('data-price'))).trigger("input");
    //       row.find('.openingMeter').val(Number($(el.options[el.selectedIndex]).attr('data-opening'))).trigger("input");
    //       row.find('.fuel').val($(el.options[el.selectedIndex]).attr('data-fuel'));
    //       if(user_role==="manager"){
    //         row.find('.closingMeter').val(Number($(el.options[el.selectedIndex]).attr('data-closing'))).trigger("input");
    //         row.find('.rtt').val(Number($(el.options[el.selectedIndex]).attr('data-rtt'))).trigger("input");
    //       }
    //     });
    //   }
    // }
  }

  present() {
    super.present();
    let amountSum=0;
    [...this.editTable[0].getElementsByClassName('amountTdEdit')].forEach((el)=>{
      amountSum+=Number(el.innerHTML);
    });

    this.editTable.find('.totalAmount').html(amountSum);
  }

  afterShow = (response)=>{
    let keys = ['name', 'description', 'amount'];
    this.in__(response,0,keys,{name:{'recv_name':'recv_id'}});
  }

  process(node) {
    let row = $(node.closest('tr'));
    if(row[0].className.includes('Create')) {
      let amountSum=0;

      [...this.addTable[0].getElementsByClassName('amount')].forEach((el)=>{
        amountSum+=Number(el.value);
      });
      this.addTable.find('.totalAmount').html(amountSum.toFixed(0));
    }
    else {
      let amountSum=Number(node.value);

      [...this.editTable[0].getElementsByClassName('amountTdEdit')].forEach((el)=>{
        let num = Number(el.innerHTML);
        amountSum+= isNaN(num)?0:num;
      });
      this.editTable.find('.totalAmount').html(amountSum.toFixed(0));
    }
  }
}

/** expense tables*/
new TableUISection('#expenses','EXPENSES','Expense',[[1],[2]]);

class Expense extends CrudTable{
  expenses = [];
  dataDateRequired = true;
  shift = true;

  constructor(inst) {
    super(inst);
    this.setVars('expense',"/expense");

    this.define(["NAME","DESCRIPTION","AMOUNT"],["TOTAL", ""],
      [{"colspan": "2", "style": "text-align:left;"},{"class": "totalAmount"},{}]);

    this.addFns([['expense','.expenseName'],['description','.expenseDesc'],['amount','.amount']],['amount','expense']);

    this.setEditTabVars([['name','name']],[0,1,2]);
    this.events();
    this.t1.process = (node)=>this.process(node);
    this.t1.afterDelete = (table)=>{$(table.querySelector('input')).trigger('input');}
    this.t2.process = (node)=>this.process(node);
  }

  defineCells(cells, table, type) {
    cells.text = [mySel('expenseName',table),myInp(1, 'expenseDesc input-lower'),myInp(1, 'amount input-float', table), deleteIcon()];

    cells.attr = [{"class": "expenseName"+type}, {"class": "expenseDesc"+type}, {"class": "amount"+type},myDelAttr(table,"expenseDelTd"+type)];

    if(type==='Edit')
      this.editFields = {'name':['select','name',null],'description':['text','input-lower'],'amount':['text','input-float',true,table]};
  }

  provide = (node)=>super.provide(node, '/branch-expense-type', this.expenses, 'name', '_'+b$_, true);

  in_provide(uri,rowData,optionNode,selectNode) {
    // if(!selectNode.hasAttribute('data-prev')){
    //   let attrObj = {"data-price": rowData['price'],"data-fuel":rowData['fuel'], "data-opening":rowData['opening']};
    //   if(user_role==="manager"){
    //     attrObj["data-closing"]=rowData['closing'];
    //     attrObj["data-rtt"]=rowData['rtt'];
    //   }
    //   $(optionNode).attr(attrObj);
    //   if (!selectNode.hasAttribute('data-change-event')) {
    //     $(selectNode).attr('data-change-event', '1').on("change", (ev) => {
    //       const el = ev.target;
    //       const row  = $(el.closest('tr'));
    //       row.find('.oldPrice').val(Number($(el.options[el.selectedIndex]).attr('data-price')));
    //       row.find('.price').val(Number($(el.options[el.selectedIndex]).attr('data-price'))).trigger("input");
    //       row.find('.openingMeter').val(Number($(el.options[el.selectedIndex]).attr('data-opening'))).trigger("input");
    //       row.find('.fuel').val($(el.options[el.selectedIndex]).attr('data-fuel'));
    //       if(user_role==="manager"){
    //         row.find('.closingMeter').val(Number($(el.options[el.selectedIndex]).attr('data-closing'))).trigger("input");
    //         row.find('.rtt').val(Number($(el.options[el.selectedIndex]).attr('data-rtt'))).trigger("input");
    //       }
    //     });
    //   }
    // }
  }

  present() {
    super.present();
    let amountSum=0;
    [...this.editTable[0].getElementsByClassName('amountTdEdit')].forEach((el)=>{
      amountSum+=Number(el.innerHTML);
    });

    this.editTable.find('.totalAmount').html(amountSum);
  }

  afterShow = (response)=>{
    let keys = ['name', 'description', 'amount'];
    this.in__(response,0,keys,{name:{'exp_name':'exp_id'}});
  }

  process(node) {
    let row = $(node.closest('tr'));
    if(row[0].className.includes('Create')) {
      let amountSum=0;

      [...this.addTable[0].getElementsByClassName('amount')].forEach((el)=>{
        amountSum+=Number(el.value);
      });
      this.addTable.find('.totalAmount').html(amountSum.toFixed(0));
    }
    else {
      let amountSum=Number(node.value);

      [...this.editTable[0].getElementsByClassName('amountTdEdit')].forEach((el)=>{
        let num = Number(el.innerHTML);
        amountSum+= isNaN(num)?0:num;
      });
      this.editTable.find('.totalAmount').html(amountSum.toFixed(0));
    }
  }
}

/** transaction tables*/
new TableUISection('#transactions','TRANSACTIONS','Transaction',[[1],[2]]);

class Transaction extends CrudTable{
  transactions = [];
  dataDateRequired = true;
  shift = true;

  constructor(inst) {
    super(inst);
    this.setVars('transaction',"/transaction");

    this.define(["NAME","OPENING","CLOSING","CHANGE","DEPOSIT","WITHDRAW","DIFF"],["TOTAL", "","",""],
      [{"colspan": "4", "style": "text-align:left;"},{"class": "totalDeposit"},{"class": "totalWithdraw"},{}]);

    this.addFns([['transaction','.transactionName'],['opening','.opening'],['closing','.closing'],['deposit','.deposit'],['withdraw','.withdraw']],['transaction','opening','closing','deposit','withdraw']);

    this.setEditTabVars([['name','name']],[0,1,2,4,5]);
    this.events();
    this.t1.process = (node)=>this.process(node);
    this.t1.afterDelete = (table)=>{$(table.querySelector('input')).trigger('input');}
    this.t2.process = (node)=>this.process(node);
  }

  defineCells(cells, table, type) {
    cells.text = [mySel('transactionName',table),myInp(1, 'opening input-float', table),myInp(1, 'closing input-float', table),"",myInp(1, 'deposit input-float', table),myInp(1, 'withdraw input-float', table),"", deleteIcon()];

    cells.attr = [{"class": "transactionName"+type}, {"class": "opening"+type}, {"class": "closing"+type}, {"class": "change change"+type}, {"class": "deposit"+type}, {"class": "withdraw"+type},{"class": "diff diff"+type},myDelAttr(table,"transactionDelTd"+type)];

    if(type==='Edit')
      this.editFields = {'name':['select','name',null],'opening':['text','input-float',true,table],'closing':['text','input-float',true,table],'deposit':['text','input-float',true,table],'withdraw':['text','input-float',true,table]};
  }

  provide = (node)=>super.provide(node, '/branch-transaction-type', this.transactions, 'name', '_'+b$_, true);

  in_provide(uri,rowData,optionNode,selectNode) {
    // if(!selectNode.hasAttribute('data-prev')){
    //   let attrObj = {"data-price": rowData['price'],"data-fuel":rowData['fuel'], "data-opening":rowData['opening']};
    //   if(user_role==="manager"){
    //     attrObj["data-closing"]=rowData['closing'];
    //     attrObj["data-rtt"]=rowData['rtt'];
    //   }
    //   $(optionNode).attr(attrObj);
    //   if (!selectNode.hasAttribute('data-change-event')) {
    //     $(selectNode).attr('data-change-event', '1').on("change", (ev) => {
    //       const el = ev.target;
    //       const row  = $(el.closest('tr'));
    //       row.find('.oldPrice').val(Number($(el.options[el.selectedIndex]).attr('data-price')));
    //       row.find('.price').val(Number($(el.options[el.selectedIndex]).attr('data-price'))).trigger("input");
    //       row.find('.openingMeter').val(Number($(el.options[el.selectedIndex]).attr('data-opening'))).trigger("input");
    //       row.find('.fuel').val($(el.options[el.selectedIndex]).attr('data-fuel'));
    //       if(user_role==="manager"){
    //         row.find('.closingMeter').val(Number($(el.options[el.selectedIndex]).attr('data-closing'))).trigger("input");
    //         row.find('.rtt').val(Number($(el.options[el.selectedIndex]).attr('data-rtt'))).trigger("input");
    //       }
    //     });
    //   }
    // }
  }

  present() {
    super.present();

    let depositSum=0, withdrawSum=0;

    [...this.editTable[0].getElementsByClassName('depositTdEdit')].forEach((el)=>{
      depositSum+=Number(el.innerHTML);
    });
    [...this.editTable[0].getElementsByClassName('withdrawTdEdit')].forEach((el)=>{
      withdrawSum+=Number(el.innerHTML);
    });

    this.editTable.find('.totalDeposit').html(depositSum.toFixed(0));
    this.editTable.find('.totalWithdraw').html(withdrawSum.toFixed(0));
  }

  afterShow = (response)=>{
    let keys = ['name', 'opening', 'closing','change','deposit','withdraw','diff'];
    this.in__(response,0,keys,{name:{'tr_name':'trans_id'}});
  }

  process(node) {
    let row = $(node.closest('tr'));
    if(row[0].className.includes('Create')) {
      //stock = row.find('.stockName')[0], option = stock.options[stock.selectedIndex], quantity = row.find('.quantity');
      const change = Number(row.find('.opening')[0].value) - Number(row.find('.closing')[0].value);
      const diff = Number(row.find('.deposit')[0].value) - Number(row.find('.withdraw')[0].value);
      const attr = change===diff?{'color':'initial','border':'initial'}:{'color':'red','border':'2px solid red'};
      row.find('.change').html(change).css(attr);
      row.find('.diff').html(diff).css(attr);

      let depositSum=0, withdrawSum=0;

      [...this.addTable[0].getElementsByClassName('deposit')].forEach((el)=>{
        depositSum+=Number(el.value);
      });
      [...this.addTable[0].getElementsByClassName('withdraw')].forEach((el)=>{
        withdrawSum+=Number(el.value);
      });
      this.addTable.find('.totalDeposit').html(depositSum.toFixed(0));
      this.addTable.find('.totalWithdraw').html(withdrawSum.toFixed(0));
    }
    else {
      const f = {'opening':0,'closing':0,'deposit':0,'withdraw':0};
      ['opening','closing','deposit','withdraw'].forEach((el)=>{
        f[el] = (node.getAttribute('data-name') === el)?Number(node.value):Number(row.find('.'+el+'TdEdit')[0].innerHTML);
      })
      const change = f.opening-f.closing, diff = f.deposit-f.withdraw;
      const attr = change===diff?{'color':'initial','border':'initial'}:{'color':'red','border':'2px solid red'};
      row.find('.changeTdEdit').html(change).css(attr);
      row.find('.diffTdEdit').html(diff).css(attr);

      let depositSum=0, withdrawSum=0;

      [...this.editTable[0].getElementsByClassName('depositTdEdit')].forEach((el)=>{
        let num = Number(el.innerHTML);
        depositSum+= isNaN(num)?Number(node.value):num;
      });
      [...this.editTable[0].getElementsByClassName('withdrawTdEdit')].forEach((el)=>{
        let num = Number(el.innerHTML);
        withdrawSum+=isNaN(num)?Number(node.value):num;
      });
      this.editTable.find('.totalDeposit').html(depositSum.toFixed(0));
      this.editTable.find('.totalWithdraw').html(withdrawSum.toFixed(0));
    }
  }
}

/** transaction tables*/
new TableUISection('#debts','DEBTS','Debt',[[1],[2]]);

class Debt extends CrudTable{
  provided = [];
  dataDateRequired = true;
  shift = true;

  constructor(inst) {
    super(inst);
    this.setVars('debt',"/debt");

    this.define(["NAME","DESCRIPTION","TAKEN","PAID"],["TOTAL", "",""],
      [{"colspan": "2", "style": "text-align:left;"},{"class": "totalTaken"},{"class": "totalPaid"}]);

    this.addFns([['name','.customerName'],['description','.description'],['taken','.taken'],['paid','.paid']],['name']);

    this.setEditTabVars([['name','name']],[0,1,2,3]);
    this.events();
    this.t1.process = (node)=>this.process(node);
    this.t1.afterDelete = (table)=>{$(table.querySelector('input')).trigger('input');}
    this.t2.process = (node)=>this.process(node);
  }

  defineCells(cells, table, type) {
    cells.text = [mySel('customerName',table),myInp(1, 'description input-lower'),myInp(1, 'taken input-float', table),myInp(1, 'paid input-float', table), deleteIcon()];

    cells.attr = [{"class": "customerName"+type}, {"class": "description"+type}, {"class": "taken"+type}, {"class": "paid"+type},myDelAttr(table,"debtDelTd"+type)];

    if(type==='Edit')
      this.editFields = {'name':['select','name',null],'description':['text','input-lower'],'taken':['text','input-float',false,table],'paid':['text','input-float',false,table]};
  }

  provide = (node)=>super.provide(node, '/branch-customer', this.provided, 'name', '_'+b$_, true);

  in_provide(uri,rowData,optionNode,selectNode) {
    // if(!selectNode.hasAttribute('data-prev')){
    //   let attrObj = {"data-price": rowData['price'],"data-fuel":rowData['fuel'], "data-opening":rowData['opening']};
    //   if(user_role==="manager"){
    //     attrObj["data-closing"]=rowData['closing'];
    //     attrObj["data-rtt"]=rowData['rtt'];
    //   }
    //   $(optionNode).attr(attrObj);
    //   if (!selectNode.hasAttribute('data-change-event')) {
    //     $(selectNode).attr('data-change-event', '1').on("change", (ev) => {
    //       const el = ev.target;
    //       const row  = $(el.closest('tr'));
    //       row.find('.oldPrice').val(Number($(el.options[el.selectedIndex]).attr('data-price')));
    //       row.find('.price').val(Number($(el.options[el.selectedIndex]).attr('data-price'))).trigger("input");
    //       row.find('.openingMeter').val(Number($(el.options[el.selectedIndex]).attr('data-opening'))).trigger("input");
    //       row.find('.fuel').val($(el.options[el.selectedIndex]).attr('data-fuel'));
    //       if(user_role==="manager"){
    //         row.find('.closingMeter').val(Number($(el.options[el.selectedIndex]).attr('data-closing'))).trigger("input");
    //         row.find('.rtt').val(Number($(el.options[el.selectedIndex]).attr('data-rtt'))).trigger("input");
    //       }
    //     });
    //   }
    // }
  }

  present() {
    super.present();

    let paidSum=0, takenSum=0;

    [...this.editTable[0].getElementsByClassName('paidTdEdit')].forEach((el)=>{
      paidSum+=Number(el.innerHTML);
    });
    [...this.editTable[0].getElementsByClassName('takenTdEdit')].forEach((el)=>{
      takenSum+=Number(el.innerHTML);
    });
    this.editTable.find('.totalTaken').html(takenSum.toFixed(0));
    this.editTable.find('.totalPaid').html(paidSum.toFixed(0));
  }

  afterShow = (response)=>{
    let keys = ['name', 'description', 'taken','paid'];
    this.in__(response,0,keys,{name:{'customer':'customer'}});
  }

  process(node) {
    let row = $(node.closest('tr'));
    if(row[0].className.includes('Create')) {
      let paidSum=0, takenSum=0;

      [...this.addTable[0].getElementsByClassName('paid')].forEach((el)=>{
        paidSum+=Number(el.value);
      });
      [...this.addTable[0].getElementsByClassName('taken')].forEach((el)=>{
        takenSum+=Number(el.value);
      });
      this.addTable.find('.totalTaken').html(takenSum.toFixed(0));
      this.addTable.find('.totalPaid').html(paidSum.toFixed(0));
    }
    else {
      let takenSum=0, paidSum=0;

      [...this.editTable[0].getElementsByClassName('takenTdEdit')].forEach((el)=>{
        let num = Number(el.innerHTML);
        takenSum+= isNaN(num)?Number(node.value):num;
      });
      [...this.editTable[0].getElementsByClassName('paidTdEdit')].forEach((el)=>{
        let num = Number(el.innerHTML);
        paidSum+=isNaN(num)?Number(node.value):num;
      });
      this.editTable.find('.totalTaken').html(takenSum.toFixed(0));
      this.editTable.find('.totalPaid').html(paidSum.toFixed(0));
    }
  }
}

/** prepaid tables*/
new TableUISection('#prepaid','PREPAID','Prepaid',[[1],[2]]);

class Prepaid extends CrudTable{
  provided = [];
  dataDateRequired = true;
  shift = true;

  constructor(inst) {
    super(inst);
    this.setVars('prepaid',"/prepaid");

    this.define(["NAME","DESCRIPTION","TAKEN","DEPOSIT"],["TOTAL", "",""],
      [{"colspan": "2", "style": "text-align:left;"},{"class": "totalTaken"},{"class": "totalDeposit"}]);

    this.addFns([['name','.customerName'],['description','.description'],['taken','.taken'],['deposit','.deposit']],['name']);

    this.setEditTabVars([['name','name']],[0,1,2,3]);
    this.events();
    this.t1.process = (node)=>this.process(node);
    this.t1.afterDelete = (table)=>{$(table.querySelector('input')).trigger('input');}
    this.t2.process = (node)=>this.process(node);
  }

  defineCells(cells, table, type) {
    cells.text = [mySel('customerName',table),myInp(1, 'description input-lower'),myInp(1, 'taken input-float', table),myInp(1, 'deposit input-float', table), deleteIcon()];

    cells.attr = [{"class": "customerName"+type}, {"class": "description"+type}, {"class": "taken"+type}, {"class": "deposit"+type},myDelAttr(table,"prepaidDelTd"+type)];

    if(type==='Edit')
      this.editFields = {'name':['select','name',null],'description':['text','input-lower'],'taken':['text','input-float',false,table],'deposit':['text','input-float',false,table]};
  }

  provide = (node)=>super.provide(node, '/branch-customer', this.provided, 'name', '_'+b$_, true);

  in_provide(uri,rowData,optionNode,selectNode) {
    // if(!selectNode.hasAttribute('data-prev')){
    //   let attrObj = {"data-price": rowData['price'],"data-fuel":rowData['fuel'], "data-opening":rowData['opening']};
    //   if(user_role==="manager"){
    //     attrObj["data-closing"]=rowData['closing'];
    //     attrObj["data-rtt"]=rowData['rtt'];
    //   }
    //   $(optionNode).attr(attrObj);
    //   if (!selectNode.hasAttribute('data-change-event')) {
    //     $(selectNode).attr('data-change-event', '1').on("change", (ev) => {
    //       const el = ev.target;
    //       const row  = $(el.closest('tr'));
    //       row.find('.oldPrice').val(Number($(el.options[el.selectedIndex]).attr('data-price')));
    //       row.find('.price').val(Number($(el.options[el.selectedIndex]).attr('data-price'))).trigger("input");
    //       row.find('.openingMeter').val(Number($(el.options[el.selectedIndex]).attr('data-opening'))).trigger("input");
    //       row.find('.fuel').val($(el.options[el.selectedIndex]).attr('data-fuel'));
    //       if(user_role==="manager"){
    //         row.find('.closingMeter').val(Number($(el.options[el.selectedIndex]).attr('data-closing'))).trigger("input");
    //         row.find('.rtt').val(Number($(el.options[el.selectedIndex]).attr('data-rtt'))).trigger("input");
    //       }
    //     });
    //   }
    // }
  }

  present() {
    super.present();

    let depositSum=0, takenSum=0;

    [...this.editTable[0].getElementsByClassName('depositTdEdit')].forEach((el)=>{
      depositSum+=Number(el.innerHTML);
    });
    [...this.editTable[0].getElementsByClassName('takenTdEdit')].forEach((el)=>{
      takenSum+=Number(el.innerHTML);
    });
    this.editTable.find('.totalTaken').html(takenSum.toFixed(0));
    this.editTable.find('.totalDeposit').html(depositSum.toFixed(0));
  }

  afterShow = (response)=>{
    let keys = ['name', 'description', 'taken','deposit'];
    this.in__(response,0,keys,{name:{'customer':'customer'}});
  }

  process(node) {
    let row = $(node.closest('tr'));
    if(row[0].className.includes('Create')) {
      let depositSum=0, takenSum=0;

      [...this.addTable[0].getElementsByClassName('deposit')].forEach((el)=>{
        depositSum+=Number(el.value);
      });
      [...this.addTable[0].getElementsByClassName('taken')].forEach((el)=>{
        takenSum+=Number(el.value);
      });
      this.addTable.find('.totalTaken').html(takenSum.toFixed(0));
      this.addTable.find('.totalDeposit').html(depositSum.toFixed(0));
    }
    else {
      let takenSum=0, depositSum=0;

      [...this.editTable[0].getElementsByClassName('takenTdEdit')].forEach((el)=>{
        let num = Number(el.innerHTML);
        takenSum+= isNaN(num)?Number(node.value):num;
      });
      [...this.editTable[0].getElementsByClassName('depositTdEdit')].forEach((el)=>{
        let num = Number(el.innerHTML);
        depositSum+=isNaN(num)?Number(node.value):num;
      });
      this.editTable.find('.totalTaken').html(takenSum.toFixed(0));
      this.editTable.find('.totalDeposit').html(depositSum.toFixed(0));
    }
  }
}

const doc = new Doc('doc');
const fuelStock = new FuelStock('fuelStock');
const tankStock = new TankStock('tankStock');
const dip = new Dip('dip');
const meter = new Meter('meter');

const productSale = new ProductSale('productSale');
const receivable = new Receivable('receivable');
const expense = new Expense('expense');
const transaction = new Transaction('transaction');
const debt = new Debt('debt');
const prepaid = new Prepaid('prepaid');
const stockAccount = new StockAccount('stockAccount');
