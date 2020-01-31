const yargs = require('yargs');
const fs = require('fs');
const yaml = require('js-yaml');
const conversor = require('json2yaml');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const randomNormal = require('random-normal');
const request = require("request");
const Influx = require("influx");

var apiInflux = "http://localhost:30086/write";


const argv = yargs
    .command('generateYaml', 'Generates a Yaml with the specified parameters', {
        discounts: {
            description: 'number of different discounts',
            alias: 'd',
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
        prefix: {
            description: 'prefix for metrics wanted',
            alias: 'p',
            type: 'string',
        }
    })
    .command('generateDataset', 'Generates a Dataset with the specified parameters', {
      number_values: {
          description: 'number of samples',
          alias: 'n',
          type: 'number',
      },
      prefix: {
          description: 'prefix desired',
          alias: 'p',
          type: 'string',
      },
      mean: {
          description: 'mean value of metrics',
          alias: 'm',
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
      }
  })
    .help()
    .alias('help', 'h')
    .argv;

if (argv._.includes('generateYaml')) {

  fs.readFile('base.json', (err, data) => {
    if(err) throw err;
    var file = JSON.parse(data);
    let units = ["B","KB","MB","GB","TB","PT","EB", "%"];
    var comparators = ["<", ">", "<=", ">="];
    var operators = ["+", "-", "*", "/"];
    var conectors = ["&&", "||"];

    var newMetrics = [];
    while(newMetrics.length < argv.metrics){
        var valor = "generated_" + argv.prefix + "_" + (newMetrics.length + 1);

        newMetrics.push(valor);

        unit = units[Math.floor(Math.random() * 8)];
        let ne = {
            schema: {
                descripcion: "Randomly generated metric",
                type: "double",
            },
            computer: "http://localhost:30500/api/v3/"+ valor
        };
        if(unit != "%"){
            ne.schema["minimum"] = 0;
            ne.schema["maximum"] = Math.floor(Math.random() * 99)+1;
        }
        ne.schema["unit"] = unit;
        file.terms.metrics[valor] = ne;
      
    }

    for(i= 0; i<argv.discounts; i++){
        let metricDiscount = newMetrics[Math.floor(Math.random() * newMetrics.length)];
        let unitMetric = file.terms.metrics[metricDiscount].schema.unit;
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

        let unitMetric2 = file.terms.metrics[metricDiscount2].schema.unit;
        let unitMetric3 = file.terms.metrics[metricDiscount4].schema.unit;
        let unitMetric4 = file.terms.metrics[metricDiscount5].schema.unit;

        let valueCondition2 = 0;
        if(unitMetric2 == "%"){
            valueCondition2 = (Math.floor(Math.random() * 9800) +1)/100;
        }else{
            valueCondition2 = (Math.floor(Math.random() *100* file.terms.metrics[metricDiscount2].schema.maximum-1)+1)/100;
        }

        let valueCondition3 = 0;
        if(unitMetric3 == "%"){
            valueCondition3 = (Math.floor(Math.random() * 9800) +1)/100;
        }else{
            valueCondition3 = (Math.floor(Math.random() *100* file.terms.metrics[metricDiscount4].schema.maximum-1)+1)/100;
        }

        let valueCondition4 = 0;
        if(unitMetric4 == "%"){
            valueCondition4 = (Math.floor(Math.random() * 9800) +1)/100;
        }else{
            valueCondition4 = (Math.floor(Math.random() *100* file.terms.metrics[metricDiscount5].schema.maximum-1)+1)/100;
        }


        if(unitMetric == "%"){
            valueCondition = (Math.floor(Math.random() * 9800) +1)/100;
        }else{
            valueCondition = (Math.floor(Math.random() *100* file.terms.metrics[metricDiscount].schema.maximum-1)+1)/100;
        }

        if(argv.complexity == "complex"){

          var newDiscount = {
            value: Math.floor(Math.random() * 24)+1,
            condition: "(" + metricDiscount + operator + metricDiscount2 + " " + comparator + " " + valueCondition + operator2 + valueCondition2 + " " + comparator2 + " " + metricDiscount3 + ") " + conector + "(" + metricDiscount4 + operator3 + metricDiscount5 + " " + comparator3 + " " + valueCondition3 + operator4 + valueCondition4 + " " + comparator4 + " " + metricDiscount6 + ") "
              
          }
        }else if(argv.complexity == "medium"){
          var newDiscount = {
            value: Math.floor(Math.random() * 24)+1,
            condition: metricDiscount + operator + metricDiscount2 + " " + comparator + " " + valueCondition + operator2 + valueCondition2 + " " + comparator2 + " " + metricDiscount3
              
          }
        }else{
          var newDiscount = {
            value: Math.floor(Math.random() * 24)+1,
            condition: metricDiscount + " " + comparator + " " + valueCondition
              
          }            
        }


        file.terms.pricing.billing.rewards[0].of.push(newDiscount);
    }

    for(i= 0; i<argv.guarantees; i++){
        let metricGuarantee = newMetrics[Math.floor(Math.random() * newMetrics.length)];
        let maximumMetric = file.terms.metrics[metricGuarantee].schema.maximum;
        let unitMetric = file.terms.metrics[metricGuarantee].schema.unit;
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
          file.terms.guarantees.push(newGuarantee);
    }

    let fileYaml = conversor.stringify(file);

    let yamlStr = yaml.safeDump(fileYaml);
    fs.writeFileSync('PoetisaSLA.yml', yamlStr.slice(7, yamlStr.length), 'utf8');
    fs.readFile('baseSwagger.json', (err, data) => {
      if(err) throw err;
      let file2 = JSON.parse(data);
  
      let newPath = {
        get: {
          description: "Returns the average value of the metric",
          operationId: "generated",
          parameters: [
            {
              name: "from",
              in: "query",
              description: "from date yyyy-mm-dd",
              required: true,
              type: "string",
              format: "date"
            },
            {
              name: "to",
              in: "query",
              description: "to date yyyy-mm-dd",
              required: false,
              type: "string",
              format: "date"
            },
            {
              name: "node",
              in: "query",
              description: "node of the system",
              required: false,
              type: "string"
            },
            {
              name: "namespace",
              in: "query",
              description: "namespace of the system",
              required: false,
              type: "string"
            },
            {
              name: "pod_name",
              in: "query",
              description: "pod of the system",
              required: false,
              type: "string"
            },
            {
              name: "metric_name",
              in: "query",
              description: "Name of the metric",
              required: false,
              type: "string"
            }
          ],
          responses: {
            200: {
              description: "average value of the node"
            },
            default: {
              description: "unexpected error"
            }
          },
          "x-swagger-router-controller": "Default"
        }
      }
  
      for(i= 0; i< newMetrics.length; i++){
  
        file2.paths["/"+newMetrics[i]] = newPath;
  
      }
      let fileYaml2 = conversor.stringify(file2);
  
      let yamlStr2 = yaml.safeDump(fileYaml2);
      fs.writeFileSync('swaggerV3.yaml', yamlStr2.slice(7, yamlStr2.length), 'utf8');
    });

  // Collection Generator------------------------------------------------------------------------------------------------------

    fs.readFile('baseCollection.json', (err, data) => {
      if(err) throw err;
      let file3 = JSON.parse(data);
      let max= 0;
      let met;
      let billings = file.terms.pricing.billing.rewards[0].of;
      let current_billing;
      let guarantees2 = file.terms.guarantees;
      let current_guarantee;
      for(m in file.terms.metrics){
        me = file.terms.metrics[m];
        
        if(me.schema.unit == "%"){
          max = 100;
        }else{
          max = me.schema.maximum;
        }
        let met = {
          schema: {
              description: "Generated",
              minimum: "" + 0,
              maximum: "" + max,
              type: "double",
              unit: me.schema.unit
          },
          computer: "http://localhost:5001/api/v3/"+m+"&metric_name="+m
        }
        file3.terms.metrics[m] = met;
      }

      for(i=0; i< billings.length; i++){
        current_billing = billings[i];
        current_billing["$$hashKey"] = "object:"+ (i+5);
        current_billing["value"] = ""+current_billing["value"];
        file3.terms.pricing.billing.rewards[0].of.push(current_billing);
        
      }

      for(i=0; i< guarantees2.length; i++){
        current_guarantee = guarantees2[i];
        file3.terms.guarantees.push(current_guarantee);
      }
      console.log(current_guarantee);
      
      fs.writeFileSync('prueba.json',JSON.stringify( file3), 'utf8');
    });
  });


    
}

if (argv._.includes('generateDataset')) {
  fs.readFile('PoetisaSLA.yml', (err, data) => {
    if(err) throw err;
    let file = yaml.load(data);
    let fileJson = JSON.parse( JSON.stringify(file));

    var records = [];
    var body = "";
    var timeJump = 37328400000000000/ (argv.number_values - 1);
    var j = 0;
    var is_percentage = false;
    var metric_value = 0;

    for( m in fileJson.terms.metrics){
      metric = fileJson.terms.metrics[m];
      is_percentage = metric.schema.unit == "%";
      j++;
      for(i=0; i<argv.number_values; i++){
        
        if(is_percentage){
          metric_value = randomNormal({mean: argv.mean, dev: argv.deviation}).toFixed(2)
        }else{
          metric_value = randomNormal({mean: (metric.schema.maximum/100) * argv.mean, dev: (metric.schema.maximum/100)* argv.deviation}).toFixed(2);
        }
        body +=
              argv.prefix + "_M-" + j +
              ",namespace_name=default,cluster_name=default,labels=mysql,type=pod,pod_name=moodle-rc-11700317 value=" +
              metric_value + " " +
              Math.floor(timeJump * i + 1473199200000000000) + "\n";
      }
    }
    if(argv.restart == "true"){
      restartDB();
    }
    setTimeout(() => {
      apiWriteInflux(body);
    }, 200);

  });
}


function restartDB() {
  return new Promise(function (resolve, reject) {

    var o = new Influx.InfluxDB({
      host: "localhost",
      port: 30086,
      database: "_internal"
    });
    o.dropDatabase('k8s');
    setTimeout(() => {
      o.createDatabase('k8s');
    }, 100);
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
      console.log(data);
      return resolve(body);
    });
  });
}