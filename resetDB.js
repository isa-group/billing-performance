const Influx = require("influx");

function restartDB() {
 

  var o = new Influx.InfluxDB({
    host: "localhost",
    port: 30086,
    database: "_internal"
  });
  o.dropDatabase('k8s').then(()=>{
    o.createDatabase('k8s')
  });
    

}
restartDB();
