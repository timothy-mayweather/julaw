// $sold = array("pms"=>111.50,"ago"=>256.25,"bik"=>25.23);
// $rem = array();
// $per = array();
//
// foreach($dips as $key=>$value){
//   $rem[$key] = ($value+$new[$key] - $sold[$key]);
//   $per[$key] = ($rem[$key]/$capacity[$key])*100;
// }
//
// $debtors = array("Vickie"=>"85000/=","Sanyu"=>"60000/=","Bobly"=>"20000/=","Mzee"=>"1000000/=");
// $items = array("2T"=>5,"Helix"=>8,"RubiaXT"=>25,"BrakeFluid"=>12);

class EstFuel extends CRUD{
  uri = "/dashboard";
  estFuel = __('#est-fuel');
  stored = '';

  constructor() {
    super();
    this.show('estFuel')
    this.reShow();
  }

  afterShow = (response)=>{
    let str = JSON.stringify(response);
    if(str!==this.stored) {
      this.stored = str;
      const estFuel = this.estFuel;
      estFuel.innerHTML = "";
      response.forEach((value) => {
        estFuel.innerHTML += "<div class='progress-group' onmouseenter='this.title=Number(" + value['per'] + ").toFixed(2)+\"%\"'>\n" +
          value['name'] + "<span class='float-right'>" + value['rem'] + "/" + value['capacity'] + "</span>\n" +
          "<div class='progress progress-sm'>\n" +
          "  <div class='progress-bar bg-danger' style='width: " + value['per'] + "%;'></div>\n" +
          "</div>\n" +
          "</div>";
      });
    }
  }
}

class TodayFuel extends CRUD{
  uri = "/dashboard";
  todayFuel = __('#today-fuel');
  stored = '';

  constructor() {
    super();
    this.show('todayFuel');
    this.reShow();
  }

  afterShow = (response)=>{
    let str = JSON.stringify(response);
    if(str!==this.stored) {
      this.stored = str;
      const todayFuel = this.todayFuel;
      todayFuel.innerHTML = "";
      response.forEach((value) => {
        todayFuel.innerHTML += "<p>" + value['name'] + ": " + value['litres'] + " litres</p>";
      });
    }
  }
}

new EstFuel();
new TodayFuel();
