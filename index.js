const yargs = require('yargs');
const fs = require('fs');
const yaml = require('js-yaml');
const conversor = require('json2yaml');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const randomNormal = require('random-normal');
const request = require("request");

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
      N: {
          description: 'number of samples',
          alias: 'n',
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
    .help()
    .alias('help', 'h')
    .argv;



if (argv._.includes('generateYaml')) {

    fs.readFile('prueba.json', (err, data) => {
        if(err) throw err;
        let file = JSON.parse(data);
        let units = ["B","KB","MB","GB","TB","PT","EB", "%"];
        var comparators = ["=", "<", ">", "<=", ">="];
        var operators = ["+", "-", "*", "/"];
        var conectors = ["&&", "||"];

        var newMetrics = [];
        while(newMetrics.length < argv.metrics){
            var valor = argv.prefix + (newMetrics.length + 1);

            if(!newMetrics.includes(valor)){
                newMetrics.push(valor);
            }
            unit = units[Math.floor(Math.random() * 8)];
            let ne = {
                schema: {
                    descripcion: "Randomly generated metric",
                    type: "double",
                },
                computer: "http://localhost:30500/api/v1/metrics/"+ valor
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

            if(unitMetric == "%"){
                valueCondition = (Math.floor(Math.random() * 9800) +1)/100;
            }else{
                valueCondition = (Math.floor(Math.random() *100* file.terms.metrics[metricDiscount].schema.maximum-1)+1)/100;
            }

            if(argv.complexity == "complex"){
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

              var newDiscount = {
                value: Math.floor(Math.random() * 24)+1,
                condition: "(" + metricDiscount + operator + metricDiscount2 + " " + comparator + " " + valueCondition + operator2 + valueCondition2 + " " + comparator2 + " " + metricDiscount3 + ") " + conector + "(" + metricDiscount4 + operator3 + metricDiscount5 + " " + comparator3 + " " + valueCondition3 + operator4 + valueCondition4 + " " + comparator4 + " " + metricDiscount6 + ") "
                  
              }
            }else if(argv.complexity == "medium"){

              let metricDiscount2 = newMetrics[Math.floor(Math.random() * newMetrics.length)];
              let metricDiscount3 = newMetrics[Math.floor(Math.random() * newMetrics.length)];
              let unitMetric2 = file.terms.metrics[metricDiscount2].schema.unit;
              let valueCondition2 = 0;
              if(unitMetric2 == "%"){
                  valueCondition2 = (Math.floor(Math.random() * 9800) +1)/100;
              }else{
                  valueCondition2 = (Math.floor(Math.random() *100* file.terms.metrics[metricDiscount2].schema.maximum-1)+1)/100;
              }

              let comparator2 = comparators[Math.floor(Math.random() * comparators.length)];
              let operator = operators[Math.floor(Math.random() * operators.length)];
              let operator2 = operators[Math.floor(Math.random() * operators.length)];

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
        fs.writeFileSync('PoetisaSLA.yaml', yamlStr.slice(7, yamlStr.length), 'utf8');

    });
}

if (argv._.includes('generateData')) {
  fs.readFile('PoetisaSLA.yaml', (err, data) => {
    if(err) throw err;
    let file = yaml.load(data);
    let fileJson = JSON.parse( JSON.stringify(file));

    const csvWriter = createCsvWriter({
      path: './dataset.txt',
      header: [
          {id: 'name', title: 'name'},
          {id: 'time', title: 'time'},
          {id: 'cluster_name', title: 'cluster_name'},
          {id: 'labels', title: 'labels'},
          {id: 'namespace_name', title: 'namespace_name'},
          {id: 'pod_name', title: 'pod_name'},
          {id: 'type', title: 'type'},
          {id: 'value', title: 'value'}
      ]
  });

  /*const records = [];
    for( m in fileJson.terms.metrics){
      metric = fileJson.terms.metrics[m];

      records.push({name: metric.computer.slice(metric.computer.lastIndexOf("metrics/")+8,metric.computer.length),
        time: Math.floor(randomNormal({mean: 14918634, dev: 186642}))*100000000000,
        cluster_name: 'default',
        labels: 'mysql',
        namespace_name: 'default',
        pod_name: 'moodle-rc-11700317',
        type: metric.schema.maximum,
        value: Math.floor(Math.random() *100* metric.schema.maximum)/100
      });
    }
    csvWriter.writeRecords(records);*/

    //var records = '# DML\n# CONTEXT-DATABASE: k8s\n\n';
    var records = '';
    for( m in fileJson.terms.metrics){
      metric = fileJson.terms.metrics[m];

      records += metric.computer.slice(metric.computer.lastIndexOf("metrics/")+8,metric.computer.length) + ',time=' 
        + Math.floor(randomNormal({mean: 14918634, dev: 186642}))*100000000000 + ',cluster_name=default,labels=mysql,namespace_name= default,'
        + 'pod_name=moodle-rc-11700317,type=pod,value=' + Math.floor(Math.random() *100* metric.schema.maximum)/100+'\n';
    }
    apiWriteInflux(records);
    var stream = fs.createWriteStream('dataset.txt');
    stream.once('open', function(fd){
      stream.write(records);
    });
  });
}

function rand_str() {
    const list = "ABCDEFGHIJKLMNPQRSTUVWXYZ";
    var res = "";
    for(var i = 0; i < 3; i++) {
        var rnd = Math.floor(Math.random() * list.length);
        res = res + list.charAt(rnd);
    }
    return res;
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
      console.log("api " + data);
      return resolve(body);
    });
  });
}