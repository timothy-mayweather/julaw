const headers ={
  'Authorization':'Bearer '+sessionStorage.getItem('token'),
  'Accept':'application/zip',
}
const address = sessionStorage.getItem('address');
let appMode = 'browser';

function isAuth(){
  if(sessionStorage.getItem('token')==null){
    window.location.href = "index.html#login";
  }
  fetch(address+'/is_auth',{method:'get', headers: headers,body: null})
    .then((response)=>response.json())
    .then((data)=>{
      if(!data.hasOwnProperty('auth')){
        sessionStorage.clear();
        window.location.href = "index.html#login";
      }
    });
}
isAuth();
