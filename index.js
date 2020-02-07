const yargs = require('yargs');
const fs = require('fs');
const yaml = require('js-yaml');
const conversor = require('json2yaml');
const randomNormal = require('random-normal');
const request = require("request");
const Influx = require("influx");
const newman = require('newman');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

var apiInflux = "http://localhost:30086/write";


const argv = yargs
    .command('generateExperiment', 'Generates a Yaml with the specified parameters', {
        discounts: {
            description: 'number of different discounts',
            alias: 'di',
            type: 'number',
        },
        metrics: {
            description: 'number of different metrics',
            alias: 'm',
            type: 'number',
        },
        guarantees: {
            description: 'number of different guarantees',
            alias: 'g',
            type: 'number',
        },
        complexity: {
            description: 'complexity wanted',
            alias: 'c',
            type: 'string',
        },
        prefixMetrics: {
            description: 'prefix for metrics wanted',
            alias: 'pm',
            type: 'string',
        },
        number_values: {
          description: 'number of samples',
          alias: 'n',
          type: 'number',
      },
      prefixData: {
          description: 'prefix desired',
          alias: 'pd',
          type: 'string',
      },
      mean: {
          description: 'mean value of metrics',
          alias: 'me',
          type: 'number',
      },
      deviation: {
          description: 'standar deviation of values',
          alias: 'd',
          type: 'number',
      },
      restart: {
          description: 'restart database',
          alias: 'r',
          type: 'string',
      },
      iterations: {
          description: 'number of times the collection will be run',
          alias: 'i',
          type: 'number',
      }
    }
  )
.help().alias('help', 'h').argv;

const csvWriter = createCsvWriter({
  path: './CSVs/Experiment_'+argv.prefixMetrics+'.csv',
  header: [
      {id: 'numberMetrics', title: 'NUMBER_METRICS'},
      {id: 'numberDiscounts', title: 'NUMBER_DISCOUNTS'},
      {id: 'numberGuarantees', title: 'NUMBER_GUARANTEES'},
      {id: 'Complexity', title: 'COMPLEXITY'},
      {id: 'entriesPerMetric', title: 'ENTIRES_PER_METRIC'},
      {id: 'responseAverage', title: 'RESPONSE_AVG'},
      {id: 'responseMin', title: 'RESPONSE_MIN'},
      {id: 'responseMax', title: 'RESPONSE_MAX'},
      {id: 'responseSd', title: 'RESPONSE_SD'},
      {id: 'dataReceived', title: 'BYTES_RECEIVED'},
      {id: 'numberIterations', title: 'NUMBER_ITERATIONS'}
  ]
});

//Variables for the files to write

var sla;
var postRequest;
var requestCollection;
var records = [];




if (argv._.includes('generateExperiment')) {

//Sla Generator ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  fs.readFile('bases/baseYaml.json', (err, data) => {
    if(err) throw err;
    sla = JSON.parse(data);
    let units = ["B","KB","MB","GB","TB","PT","EB", "%"];
    var comparators = ["<", ">", "<=", ">="];
    var operators = ["+", "-", "*", "/"];
    var conectors = ["&&", "||"];

    var newMetrics = [];
    while(newMetrics.length < argv.metrics){
        var valor = "generated_" + argv.prefixMetrics + "_" + (newMetrics.length + 1);

        newMetrics.push(valor);

        unit = units[Math.floor(Math.random() * 8)];
        let ne = {
            schema: {
                descripcion: "Randomly generated metric",
                type: "double",
            },
            computer: "http://localhost:30500/api/v3/generated/"+ valor
        };
        if(unit != "%"){
            ne.schema["minimum"] = 0;
            ne.schema["maximum"] = Math.floor(Math.random() * 99)+1;
        }
        ne.schema["unit"] = unit;
        sla.terms.metrics[valor] = ne;
        
    }

    for(i= 0; i<argv.discounts; i++){
        let metricDiscount = newMetrics[Math.floor(Math.random() * newMetrics.length)];
        let unitMetric = sla.terms.metrics[metricDiscount].schema.unit;
        let comparator = comparators[Math.floor(Math.random() * comparators.length)];
        let valueCondition = 0;

        let comparator2 = comparators[Math.floor(Math.random() * comparators.length)];
        let comparator3 = comparators[Math.floor(Math.random() * comparators.length)];
        let comparator4 = comparators[Math.floor(Math.random() * comparators.length)];

        let operator = operators[Math.floor(Math.random() * operators.length)];
        let operator2 = operators[Math.floor(Math.random() * operators.length)];
        let operator3 = operators[Math.floor(Math.random() * operators.length)];
        let operator4 = operators[Math.floor(Math.random() * operators.length)];

        let conector = conectors[Math.floor(Math.random() * conectors.length)];

        let metricDiscount2 = newMetrics[Math.floor(Math.random() * newMetrics.length)];
        let metricDiscount3 = newMetrics[Math.floor(Math.random() * newMetrics.length)];
        let metricDiscount4 = newMetrics[Math.floor(Math.random() * newMetrics.length)];
        let metricDiscount5 = newMetrics[Math.floor(Math.random() * newMetrics.length)];
        let metricDiscount6 = newMetrics[Math.floor(Math.random() * newMetrics.length)];

        let unitMetric2 = sla.terms.metrics[metricDiscount2].schema.unit;
        let unitMetric3 = sla.terms.metrics[metricDiscount4].schema.unit;
        let unitMetric4 = sla.terms.metrics[metricDiscount5].schema.unit;

        let valueCondition2 = 0;
        if(unitMetric2 == "%"){
            valueCondition2 = (Math.floor(Math.random() * 9800) +1)/100;
        }else{
            valueCondition2 = (Math.floor(Math.random() *100* sla.terms.metrics[metricDiscount2].schema.maximum-1)+1)/100;
        }

        let valueCondition3 = 0;
        if(unitMetric3 == "%"){
            valueCondition3 = (Math.floor(Math.random() * 9800) +1)/100;
        }else{
            valueCondition3 = (Math.floor(Math.random() *100* sla.terms.metrics[metricDiscount4].schema.maximum-1)+1)/100;
        }

        let valueCondition4 = 0;
        if(unitMetric4 == "%"){
            valueCondition4 = (Math.floor(Math.random() * 9800) +1)/100;
        }else{
            valueCondition4 = (Math.floor(Math.random() *100* sla.terms.metrics[metricDiscount5].schema.maximum-1)+1)/100;
        }


        if(unitMetric == "%"){
            valueCondition = (Math.floor(Math.random() * 9800) +1)/100;
        }else{
            valueCondition = (Math.floor(Math.random() *100* sla.terms.metrics[metricDiscount].schema.maximum-1)+1)/100;
        }

        if(argv.complexity == "complex"){

          var newDiscount = {
            value: Math.floor(Math.random() * 24)+1,
            condition: "(" + metricDiscount + operator + metricDiscount2 + " " + comparator + " " + valueCondition +
             operator2 + valueCondition2 + " " + comparator2 + " " + metricDiscount3 + ") " + conector +
              "(" + metricDiscount4 + operator3 + metricDiscount5 + " " + comparator3 + " " + valueCondition3 +
               operator4 + valueCondition4 + " " + comparator4 + " " + metricDiscount6 + ") "
              
          }
        }else if(argv.complexity == "medium"){
          var newDiscount = {
            value: Math.floor(Math.random() * 24)+1,
            condition: metricDiscount + operator + metricDiscount2 + " " + comparator + " " + valueCondition
             + operator2 + valueCondition2 + " " + comparator2 + " " + metricDiscount3
              
          }
        }else{
          var newDiscount = {
            value: Math.floor(Math.random() * 24)+1,
            condition: metricDiscount + " " + comparator + " " + valueCondition
              
          }            
        }


        sla.terms.pricing.billing.rewards[0].of.push(newDiscount);
    }
    
    for(i= 0; i<argv.guarantees; i++){
        let metricGuarantee = newMetrics[Math.floor(Math.random() * newMetrics.length)];
        let maximumMetric = sla.terms.metrics[metricGuarantee].schema.maximum;
        
        let unitMetric = sla.terms.metrics[metricGuarantee].schema.unit;
        let valorGuarantee1 = 0;
        let valorGuarantee2 = 0;
        let valorGuarantee3 = 0;

        if(unitMetric == "%"){
            valorGuarantee1 = (Math.floor(Math.random() *100* 49))/100 + 50;
            valorGuarantee2 = (Math.floor(Math.random() *100* 49))/100 + 50;
            valorGuarantee3 = (Math.floor(Math.random() *100* 49))/100 + 50;
        }else{
            valorGuarantee1 = (Math.floor(Math.random() *50* maximumMetric-1))/100 + maximumMetric/2;
            valorGuarantee2 = (Math.floor(Math.random() *50* maximumMetric-1))/100 + maximumMetric/2;
            valorGuarantee3 = (Math.floor(Math.random() *50* maximumMetric-1))/100 + maximumMetric/2;
        }

        let newGuarantee = {
            id: "G_" + metricGuarantee,
            scope: {
              priority: {
                $ref: "#/context/definitions/scopes/impact"
              },
              node: {
                $ref: "#/context/definitions/scopes/node"
              }
            },
            of: [
              {
                scope: {
                  node: "k-master, k-mysql, k-nfs, k-proxy",
                  impact: "high"
                },
                objective: metricGuarantee + " >= " + valorGuarantee1,
                window: {
                  type: "static",
                  period: "monthly",
                  initial: "2018-05-01T00:00:00.000Z"
                }
              },
              {
                scope: {
                  node: "k-minion1, k-minion2, k-minion3, k-minion4, k-minion5",
                  impact: "medium"
                },
                objective: metricGuarantee + " >= " + valorGuarantee2,
                window: {
                  type: "static",
                  period: "monthly",
                  initial: "2018-05-01T00:00:00.000Z"
                }
              },
              {
                scope: {
                  node: "k-portal, k-registry",
                  impact: "low"
                },
                objective: metricGuarantee + " >= " + valorGuarantee3,
                window: {
                  type: "static",
                  period: "monthly",
                  initial: "2018-05-01T00:00:00.000Z"
                }
              }
            ]
          }
          sla.terms.guarantees.push(newGuarantee);
    }

    let slaYaml = conversor.stringify(sla);

    let yamlStr = yaml.safeDump(slaYaml);
    fs.writeFileSync('SLAs/PoetisaSLA_' + argv.prefixMetrics + '.yml', yamlStr.slice(7, yamlStr.length), 'utf8');




//Collection Generator -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    fs.readFile('bases/baseCollection.json', (err, data) => {
      if(err) throw err;
      postRequest = JSON.parse(data);
      let max= 0;
      let billings = sla.terms.pricing.billing.rewards[0].of;
      let current_billing;
      let guarantees2 = sla.terms.guarantees;
      let current_guarantee;
      for(m in sla.terms.metrics){
        me = sla.terms.metrics[m];
        
        if(me.schema.unit == "%"){
          max = 100;
        }else{
          max = me.schema.maximum;
        }
        let met = {
          schema: {
              description: "Generated",
              minimum: "0",
              maximum: "" + max.toString(),
              type: "double",
              unit: me.schema.unit
          },
          computer: "http://localhost:5001/api/v3/generated/"+m
        }
        postRequest.terms.metrics[m] = met;
      }

      for(i=0; i< billings.length; i++){
        current_billing = billings[i];
        //current_billing["$$hashKey"] = "object:"+ (i+5);
        current_billing["value"] = current_billing["value"].toString();
        postRequest.terms.pricing.billing.rewards[0].of.push(current_billing);
        
      }

      for(i=0; i< guarantees2.length; i++){
        current_guarantee = guarantees2[i];
        postRequest.terms.guarantees.push(current_guarantee);
      }
      fs.readFile('bases/Poetisa.baseCollection.json', (err, data) => {
        if(err) throw err;
        requestCollection = JSON.parse(data);

        requestCollection.item[0].request.body.raw = JSON.stringify(postRequest);
        fs.writeFileSync('SLAs/Poetisa.collection_'+argv.prefixMetrics+'.json', JSON.stringify(requestCollection), 'utf8');
      });
    });




//Data Generator ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    var body = "";
    var timeJump = 37328400000000000/ (argv.number_values - 1);
    var j = 0;
    var is_percentage = false;
    var metric_value = 0;
    var bodies = [];


    new Promise(function (resolve, reject) {
      if(argv.restart == "true"){
        restartDB().then(() =>{return resolve()});
      }else{
        return resolve();
      }
    }).then(()=> {
      new Promise(function (resolve, reject) {
        for( m in sla.terms.metrics){
          metric = sla.terms.metrics[m];
          is_percentage = metric.schema.unit == "%";
          j++;
  
          for(i=0; i<argv.number_values; i++){
            
            if(is_percentage){
              metric_value = randomNormal({mean: argv.mean, dev: argv.deviation}).toFixed(2)
            }else{
              metric_value = randomNormal({mean: (metric.schema.maximum/100) * argv.mean, dev: (metric.schema.maximum/100)* argv.deviation})
              .toFixed(2);
            }
            if(metric_value < 0){
              metric_value = 0;
            }
    
            body +=
                  //argv.prefixData + "_M-" + j +
                  "generated_" + argv.prefixMetrics + "_" + j +
                  ",namespace_name=default,cluster_name=default,labels=mysql,type=pod,pod_name=moodle-rc-11700317 value=" +
                  metric_value + " " +
                  Math.floor(timeJump * i + 1473199200000000000) + "\n";
                
            }    
          if(j % 16 == 0 || j == argv.metrics)  {
              bodies.push(body);
              body = "";
          }  
        
        }
        console.log(bodies.length);
        var cont = 0;
        for(b= 0; b<bodies.length; b++){
          setTimeout(() => {
            if(cont==bodies.length -1 ){
              apiWriteInflux(bodies[cont]).then(() =>{return resolve()});

            }else{

              apiWriteInflux(bodies[cont]);
            }
            cont++;
          }, 2000*(b+1));
        }
      }).then(() =>{


        newman.run({
          collection: requestCollection,
          iterationCount: argv.iterations
        }).on('start', function (err, args) { // on start of run, log to console
          console.log('running a collection...');
        }).on('done', function (err, summary) {
          if (err || summary.error) {
              console.error('collection run encountered an error.');
          }
          else {
            records.push(
              {numberMetrics: argv.metrics,  numberDiscounts: argv.discounts,  numberGuarantees: argv.guarantees,
              Complexity: argv.complexity,  entriesPerMetric: argv.number_values,  responseAverage: summary.run.timings.responseAverage.toString(),
              responseMin: summary.run.timings.responseMin.toString(),  responseMax: summary.run.timings.responseMax.toString(),
              responseSd: summary.run.timings.responseSd.toFixed(2).toString(), dataReceived: summary.run.transfers.responseTotal.toString(),
              numberIterations: argv.iterations}
            );
          }
      
        csvWriter.writeRecords(records)
        .then(() => {
            console.log('...Done');
          });
        });
      });
    });
  });
}



//Collection Runner and CSV Writer ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------










function restartDB() {
  return new Promise(function (resolve, reject) {

    var o = new Influx.InfluxDB({
      host: "localhost",
      port: 30086,
      database: "_internal"
    });
    o.dropDatabase('k8s').then(()=>{
      o.createDatabase('k8s').then(()=>{
        return resolve();
      });
    });
      

  });
  
}

function apiWriteInflux(data) {
  var options = {
    method: "POST",
    url: apiInflux,
    qs: {
      db: "k8s",
      precision: "ns"
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: data
  };
  return new Promise(function(resolve, reject) {
    request(options, function(error, response, body) {
      if (error) return reject(error);
      
      return resolve(body);
    });
  });
}