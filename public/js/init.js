const foot = document.getElementById("foot");
foot.innerHTML = "Copyright &copy; 2021-"+new Date().getFullYear() + foot.innerHTML;
const b$_ = sessionStorage.getItem('branch_id');
const user_role = sessionStorage.getItem('user_role');
document.querySelector("meta[name='csrf-token']").setAttribute('content',sessionStorage.getItem('token'));
document.getElementById("user_name").innerHTML = sessionStorage.getItem('name');
document.getElementById("branch_name").innerHTML = sessionStorage.getItem('branch_name')+" branch";

function logout(event,form){
  event.preventDefault();
  fetch(address+form.getAttribute("action"),{method:form.method, headers: headers, body: null})
    .then((response)=>response.json())
    .then((data)=>{
      if(data.hasOwnProperty('redirect')) {
        sessionStorage.clear();
        window.location.href = data["redirect"];
      }
    });
}
