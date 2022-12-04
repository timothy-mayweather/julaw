// let meterTable = new MeterTable();
// let obj1 = meterTable.obj;
// {
//   obj1.trigger = "#enterMeters";
//   obj1.el = "#meterTable";
//   obj1.thead.cells.text = ["PRODUCTS", "OPENING", "CLOSING", "RTT", "LITRES", "PRICE", "AMOUNT", rowBtn('meter')];
//   obj1.tbody.attr = {"id": "meterInputArea"};
//   obj1.tbody.rows.attr = {"class": "meterTableRows"};

//   obj1.tbody.rows.cells.text = [mySel('nozzle', 'meter'), myInp(2, 'openingMeters', 'meter')
//     , myInp(2, 'closingMeters', 'meter'), myInp(2, 'rtt', 'meter', '0.00'),
//     "", myInp(2, 'prices', 'meter'), "", deleteIcon()];
//
//   obj1.tbody.rows.cells.attr = [{"class": "nozzleH"}, {"class": "openingMH"}, {"class": "closingMH"},
//     {"class": "rttH"}, {"class": "litresM"}, {"class": "pricesMH"}, {"class": "amountM"},
//     myDelAttr('meter')];
//
//   obj1.tfoot.cells.text = ["TOTAL", "", "", "", submitBtn('meter')];
//   obj1.tfoot.cells.attr = [{"colspan": "4", "style": "text-align:left;"}, {
//     "id": "totalLitreDisplay",
//     "class": "litres"
//   }, {},
//     {"id": "totalAmountDisplay", "class": "debit"}, {}];
//
//   meterTable.choices = ["PMS1", "PMS2", "AGO1", "AGO2", "BIK"];
// }
// $("#enterMeters").on("click",()=>{meterTable.create()});
//
// let debtTable = new DebtTable();
// let obj3 = debtTable.obj;
// {
//   obj3.trigger = "#enterDebt";
//   obj3.el = "#debtTable";
//   obj3.thead.cells.text = ["NAME","DESCRIPTION", "PAID", "TAKEN",rowBtn('debt')];
//   obj3.tbody.attr = {"id": "debtInputArea"};
//   obj3.tbody.rows.attr = {"class": "debtTableRows"};
//
//   obj3.tbody.rows.cells.text = [mySel('debtorName', 'debt'), myInp(1, 'debtDesc', 'debt'),
//     myInp(2, 'paidDebt', 'debt'), myInp(2, 'takenDebt', 'debt'), deleteIcon()];
//
//   obj3.tbody.rows.cells.attr = [{"class": "debtorNameH"}, {"class": "debtDescH"},
//     {"class": "paidDebtH"}, {"class": "takenDebtH"}, myDelAttr('debt')];
//
//   obj3.tfoot.cells.text = ["TOTAL","","", submitBtn('debt')];
//   obj3.tfoot.cells.attr = [{"colspan": "2", "style": "text-align:left;"},
//     {"id":"totalPaid", "class":"debit"},{"id":"totalTaken", "class":"credit"}, {}];
//
//   debtTable.choices = ["Kibalama", "Ruth", "Joseph", "Timothy", "Sharon", "Bobly"];
// }
// $("#enterDebt").on("click",()=>{debtTable.create()});
//
// let expenseTable = new ExpenseTable();
// let obj4 = expenseTable.obj;
// {
//   obj4.trigger = "#enterExpense";
//   obj4.el = "#expenseTable";
//   obj4.thead.cells.text = ["NAME","DESCRIPTION", "AMOUNT",rowBtn('expense')];
//   obj4.tbody.attr = {"id": "expenseInputArea"};
//   obj4.tbody.rows.attr = {"class": "expenseTableRows"};
//
//   obj4.tbody.rows.cells.text = [mySel('expenseName', 'expense'), myInp(1, 'expenseDesc', 'expense'),
//     myInp(2, 'expenseAmount', 'expense'), deleteIcon()];
//
//   obj4.tbody.rows.cells.attr = [{"class": "expenseNameH"}, {"class": "expenseDescH"},
//     {"class": "expenseAmountH"}, myDelAttr('expense')];
//
//   obj4.tfoot.cells.text = ["TOTAL","", submitBtn('expense')];
//   obj4.tfoot.cells.attr = [{"colspan": "2", "style": "text-align:left;"},
//     {"id":"totalEAmount", "class":"credit"}, {}];
//
//   expenseTable.choices = ["Electricity", "Rent", "Transport", "Construction", "Salary", "FuelPurchase"];
// }
// $("#enterExpense").on("click",()=>{expenseTable.create()});
//
// let itemTable = new ItemTable();
// let obj5 = itemTable.obj;
// {
//   obj5.trigger = "#enterItems";
//   obj5.el = "#itemTable";
//   obj5.thead.cells.text = ["NAME", "TYPE", "DESCRIPTION", "QUANTITY", "PRICE", "AMOUNT",rowBtn('item')];
//   obj5.tbody.attr = {"id": "itemInputArea"};
//   obj5.tbody.rows.attr = {"class": "itemTableRows"};
//
//   obj5.tbody.rows.cells.text = [mySel('itemName', 'item'),"", myInp(1, 'itemDesc', 'item'),
//     myInp(2, 'itemQty', 'item'),myInp(2, 'itemPrice', 'item'),"", deleteIcon()];
//
//   obj5.tbody.rows.cells.attr = [{"class": "itemNameH"}, {"class": "itemType"},{"class": "itemDescH"},
//     {"class": "itemQtyH"},{"class": "itemPriceH"},{"class": "itemAmountH"}, myDelAttr('item')];
//
//   obj5.tfoot.cells.text = ["TOTAL","", submitBtn('item')];
//   obj5.tfoot.cells.attr = [{"colspan": "5", "style": "text-align:left;"},
//     {"id":"totalAmountArea", "class":"debit"}, {}];
//
//   itemTable.choices = {Lubricant:["2T", "Coolant", "Helix", "Hexelium", "RubiaX"], Drink:["Water", "Soda"]};
// }
// $("#enterItems").on("click",()=>{itemTable.create()});
//
// let receivableTable = new ReceivableTable();
// let obj6 = receivableTable.obj;
// {
//   obj6.trigger = "#enterReceivable";
//   obj6.el = "#receivableTable";
//   obj6.thead.cells.text = ["NAME","DESCRIPTION", "AMOUNT", rowBtn('receivable')];
//   obj6.tbody.attr = {"id": "receivableInputArea"};
//   obj6.tbody.rows.attr = {"class": "receivableTableRows"};
//
//   obj6.tbody.rows.cells.text = [mySel('receivableName', 'receivable'), myInp(1, 'receivableDesc', 'receivable'),
//     myInp(2, 'receivableAmount', 'receivable'), deleteIcon()];
//
//   obj6.tbody.rows.cells.attr = [{"class": "receivableNameH"},{"class": "receivableDescH"},
//     {"class": "receivableAmountH"}, myDelAttr('receivable')];
//
//   obj6.tfoot.cells.text = ["TOTAL","", submitBtn('receivable')];
//   obj6.tfoot.cells.attr = [{"colspan": "2", "style": "text-align:left;"},
//     {"id":"totalRAmount", "class":"debit"}, {}];
//
//   receivableTable.choices = ["Pressure rent", "Airtel Commission", "MTN Commission"];
// }
// $("#enterReceivable").on("click",()=>{receivableTable.create()});
//
// let transactionTable = new TransactionTable();
// let obj7 = transactionTable.obj;
// {
//   obj7.trigger = "#enterTransaction";
//   obj7.el = "#transactionTable";
//   obj7.thead.cells.text = ["TYPE", "OPENING BAL.","CLOSING BAL.", "CHANGE", "DEPOSIT", "WITHDRAW", "DIFF",rowBtn('transaction')];
//   obj7.tbody.attr = {"id": "transactionInputArea"};
//   obj7.tbody.rows.attr = {"class": "transactionTableRows"};
//
//   obj7.tbody.rows.cells.text = [mySel('transactionName', 'transaction'),myInp(2, 'trOpeningBal', 'transaction'),
//     myInp(2, 'trClosingBal', 'transaction'),"",myInp(2, 'trDeposit', 'transaction'),
//     myInp(2, 'trWithdraw', 'transaction'),"",deleteIcon()];
//
//   obj7.tbody.rows.cells.attr = [{"class": "transactionNameH"},{"class": "trOpeningBalH"},{"class": "trClosingBalH"},
//     {"class": "trChange"},{"class": "trDepositH"},{"class": "trWithdrawH"},
//     {"class": "trDiff"},myDelAttr('transaction')];
//
//   obj7.tfoot.cells.text = ["TOTAL","","","", submitBtn('transaction')];
//   obj7.tfoot.cells.attr = [{"colspan": "4", "style": "text-align:left;"},
//     {"id":"totalDeposit", "class":"debit"},{"id":"totalWithdraw", "class":"credit"}, {},{}];
//
//   transactionTable.choices = ["MTN", "AIRTEL", "AGENT_BANKING"];
// }
// $("#enterTransaction").on("click",()=>{transactionTable.create()});
//
// let prepaidTable = new PrepaidTable();
// let obj8 = prepaidTable.obj;
// {
//   obj8.trigger = "#enterPrepaid";
//   obj8.el = "#prepaidTable";
//   obj8.thead.cells.text = ["NAME","DESCRIPTION", "PAID", "TAKEN",rowBtn('prepaid')];
//   obj8.tbody.attr = {"id": "prepaidInputArea"};
//   obj8.tbody.rows.attr = {"class": "prepaidTableRows"};
//
//   obj8.tbody.rows.cells.text = [mySel('prepaidName', 'prepaid'), myInp(1, 'prepaidDesc', 'prepaid'),
//     myInp(2, 'paidPrepaid', 'prepaid'), myInp(2, 'takenPrepaid', 'prepaid'), deleteIcon()];
//
//   obj8.tbody.rows.cells.attr = [{"class": "prepaidNameH"}, {"class": "prepaidDescH"},
//     {"class": "paidPrepaidH"}, {"class": "takenPrepaidH"}, myDelAttr('prepaid')];
//
//   obj8.tfoot.cells.text = ["TOTAL","","", submitBtn('prepaid')];
//   obj8.tfoot.cells.attr = [{"colspan": "2", "style": "text-align:left;"},
//     {"id":"totalPrepaidPaid", "class":"debit"},{"id":"totalPrepaidTaken", "class":"credit"}, {}];
//
//   prepaidTable.choices = ["KCC", "KAKOOGE", "NAKASONGOLA", "CAO"];
// }
// $("#enterPrepaid").on("click",()=>{prepaidTable.create()});
//
// let productRegTable = new ProductRegTable();
// let obj9 = productRegTable.obj;
// {
//   obj9.trigger = "#addProduct";
//   obj9.el = "#productTable";
//   obj9.thead.cells.text = ["NAME","SHORT","DESCRIPTION","TYPE","ACTIVE",rowBtn('productReg')];
//   obj9.tbody.attr = {"id": "productInputArea"};
//   obj9.tbody.rows.attr = {"class": "productTableRows"};
//
//   obj9.tbody.rows.cells.text = [myInp(1, 'productName', 'productReg'),
//     myInp(1, 'productShortName', 'productReg'), myInp(1,'productDesc','productReg'),
//     mySel('productType', 'productReg'),"<input type='checkbox' class='productActive form-check-input' checked=''>",deleteIcon()];
//
//   obj9.tbody.rows.cells.attr = [{},{},{},{},{"class":"form-switch"},myDelAttr('productReg')];
//   obj9.tfoot.cells.text = ["NAME","SHORT","DESCRIPTION","TYPE","ACTIVE",submitBtn('productReg')];
// }
// $("#addProduct").on("click",()=>{productRegTable.create()});
//
// let productEditTable = new ProductRegTable();
// let obj10 = productEditTable.obj;
// {
//   obj10.trigger = "#editProduct";
//   obj10.el = "#productTableEdit";
//   obj10.thead.cells.text = ["NAME","SHORT","DESCRIPTION","TYPE","ACTIVE",""];
//   obj10.tfoot.cells.text = ["NAME","SHORT","DESCRIPTION","TYPE","ACTIVE",""];
//
// }
// $("#editProduct").on("click",()=>{productEditTable.edit()});
//
// let dateChoose = $("#date-choose");
// let dateType = $("#date-type");
// let timeType = $("#time-type");
// let checkDone = $("#check-done");
// let quantityNo = 0;
// let qtyField = $("#qtyField");
// let tField = $("#tField");
// let dateTime = $("#dateTime");
//
// dateType.hide();
// timeType.hide();
// checkDone.hide();
//
// dateChoose.on("click",()=>{
//   dateChoose.hide();
//   dateType.show();
//   timeType.show();
//   checkDone.show();
// });
//
// checkDone.on("click",()=>{
//   dateType.hide();
//   timeType.hide();
//   checkDone.hide();
//   dateChoose.show();
//   const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
//   let dateChoice = (dateType.val()).slice(8) + " " +  months[Number((dateType.val()).slice(5,7))-1] + " " + (dateType.val()).slice(0,4) + " " + timeType.val() + " hrs";
//   dateChoose.html(dateChoice);
//   dateTime.val(dateChoice);
// });
//
// makeReceiptTable();
//
// function makeReceiptTable() {
//   //creating table
//   let recpTable = $("<table></table>").attr({"id":"recpTable", "class":"table table-striped"});
//   //creating table head and adding its contents
//   let recpTableHead = $("<thead></thead>").append(createHeadingRow());
//   //creating table body
//   let recpTableBody = $("<tbody></tbody>").attr("id", "recpInputArea").append(createRecpRow());
//   //creating table foot
//   let recpTableFoot = $("<tfoot></tfoot>").attr("id","recpTableFoot").append(makeFoot());
//   recpTable.append(recpTableHead, recpTableBody, recpTableFoot);
//   //creating new buttons
//   let createRowButton = $("<button></button>").text("+Add Row").attr({"id":"addRecpRow", "type":"button","class":"btn btn-outline-success"});
//   createRowButton.on("click",()=>{recpTableBody.append(createRecpRow())});
//   $("#recpTableContainer").append(recpTable, createRowButton);
// }
//
// function createHeadingRow(){
//   let tableHeadings = ["No.", "Product", "Quantity", "Price", "Amount"];
//   let row = $("<tr></tr>")
//   for (let x of tableHeadings){
//     if (x === "Amount"){
//       let cell = ($("<th></th>").text(x)).attr({"colspan":"2", "style":"text-align:left"});
//       row.append(cell);
//     }else {
//       row.append($("<th></th>").text(x));
//     }
//   }
//   return row;
// }
//
// function createRecpRow(){
//   let row = $("<tr></tr>").attr("class", "recpTableRows");
//   //1st cell
//   let cell1 = $("<td></td>").attr("class", "rItemNo").html((++quantityNo).toString());
//   qtyField.val(quantityNo);
//   //3rd cell
//   let cell3 = $("<td></td>").attr("class", "prodHolder");
//   let cellInput3 = document.createElement("input");
//   cellInput3.setAttribute("type", "text");
//   cellInput3.setAttribute("class", "prod form-control");
//   cellInput3.setAttribute("name", "prod"+quantityNo);
//   cell3.append(cellInput3);
//   //4th cell
//   let cell4 = $("<td></td>").attr("class", "qtyHolder");
//   let cellInput4 = document.createElement("input");
//   cellInput4.setAttribute("type", "text");
//   cellInput4.setAttribute("class", "qty form-control");
//   cellInput4.setAttribute("name", "qty"+quantityNo);
//   cell4.append(cellInput4);
//   //5th cell
//   let cell5 = $("<td></td>").attr("class", "rpPriceHold");
//   let cellInput5 = document.createElement("input");
//   cellInput5.setAttribute("type", "number");
//   cellInput5.setAttribute("class", "recpPrice form-control");
//   cellInput5.setAttribute("name", "recpPrice"+quantityNo);
//   cell5.append(cellInput5);
//   //6th cell
//   let cell6 = $("<td></td>").attr("class", "rpAmountHold");
//   let cellInput6 = document.createElement("input");
//   cellInput6.setAttribute("type", "number");
//   cellInput6.setAttribute("class", "rpAmount form-control");
//   cellInput6.setAttribute("name", "rpAmount"+quantityNo);
//   cellInput6.addEventListener("input", ()=>{updateRecpRecords(cellInput6)});
//   cell6.append(cellInput6);
//   //6th cell
//   let cell7 = document.createElement("td");
//   cell7.setAttribute("class", "del");
//   cell7.addEventListener("click", ()=>{deleteRecpRow(cell7)});
//   let deleteIcon = document.createElement("img");
//   deleteIcon.src = "../images/delete.png";
//   deleteIcon.alt = "-X-";
//   deleteIcon.title = "delete row";
//   cell7.append(deleteIcon);
//   return row.append(cell1, cell3, cell4, cell5, cell6, cell7);
// }
//
// function makeFoot(){
//   let cell1 = $("<td></td>").text("TOTAL").attr({"colspan":"4", "align":"right"});
//   let cell2 = $("<td></td>").attr({"id":"recpTotalAmountArea","text-align":"left"});
//   return $("<tr></tr>").append(cell1, cell2, $("<td></td>"));
// }
//
// function deleteRecpRow(node){
//   if(confirm("Delete this row?")) {
//     //first Reset all input fields to zero
//     node.parentElement.setAttribute("id", "deleted");
//     node.parentElement.children[1].firstElementChild.id = "deletedRecp";
//     node.parentElement.children[4].firstElementChild.value = "0";
//     quantityNo=0;
//     updateRecpRecords(node.parentElement.children[4].firstElementChild);
//     node.parentElement.remove();
//     for(let x of document.getElementsByClassName("recpTableRows")){
//       (x.children)[0].innerHTML = (++quantityNo).toString();
//       (x.children)[1].firstChild.setAttribute("name", "prod"+quantityNo);
//       (x.children)[2].firstChild.setAttribute("name", "qty"+quantityNo);
//       (x.children)[3].firstChild.setAttribute("name", "recpPrice"+quantityNo);
//       (x.children)[4].firstChild.setAttribute("name", "rpAmount"+quantityNo);
//     }
//     qtyField.val(quantityNo);
//   }
//   let count = $("#recpInputArea tr").length;
//   if (count === 0){
//     $("#recpTable").remove();
//     $("#addRecpRow").remove();
//     updateRecpRecords(undefined);
//   }
// }
//
// function updateRecpRecords(node){
//   if (node === undefined){
//     return;
//   }
//   let className = node.className;
//   let sum = 0;
//   for(let x of document.getElementsByClassName(className)){
//     sum += Number(x.value);
//   }
//   document.getElementById("recpTotalAmountArea").innerText = sum.toString();
//   tField.val(sum.toString());
// }
