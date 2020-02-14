const yargs = require('yargs');
const fs = require('fs');
const yaml = require('js-yaml');
const conversor = require('json2yaml');
const randomNormal = require('random-normal');
const request = require("request");

const newman = require('newman');

const apiInflux = "http://localhost:30086/write";

// Arguments of the command 'generateExperiment'
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
        prefixFiles: {
          description: 'prefix desired',
          alias: 'pf',
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
        generateData: {
          description: 'restart database',
          alias: 'ge',
          type: 'string',
        },
        iterationsCollection: {
          description: 'number of times the collection will be run per newman call',
          alias: 'i',
          type: 'number',
        },
        newmanCalls: {
          description: 'number of parallel newman calls',
          alias: 'ne',
          type: 'number',
        }
      }
    )
.help().alias('help', 'h').argv;

// Variables of the files to write

var sla;
var postRequest;
var requestCollection;

if (argv._.includes('generateExperiment')) {

  if(!fs.existsSync(argv.prefixMetrics + "_TimeStamp")){
    fs.mkdirSync(argv.prefixMetrics + "_TimeStamp");
  }
  if(!fs.existsSync(argv.prefixMetrics + "_TimeStamp/Datasets")){
    fs.mkdirSync(argv.prefixMetrics + "_TimeStamp/Datasets");
  }
  if(!fs.existsSync(argv.prefixMetrics + "_TimeStamp/SLAs")){
    fs.mkdirSync(argv.prefixMetrics + "_TimeStamp/SLAs");
  }
  if(!fs.existsSync(argv.prefixMetrics + "_TimeStamp/Collections")){
    fs.mkdirSync(argv.prefixMetrics + "_TimeStamp/Collections");
  }
  if(!fs.existsSync(argv.prefixMetrics + "_TimeStamp/Results")){
    fs.mkdirSync(argv.prefixMetrics + "_TimeStamp/Results");
  }

  new Promise(function (resolve, reject) {
    fs.readFile(argv.prefixMetrics + '_TimeStamp/SLAs/PoetisaSLA_' + argv.prefixFiles + '.yml', (err, data) => {
      if(err){

        console.log("Starting the SLA generator.........")
        // Reading file baseYaml.json to use as base
        fs.readFile('bases/baseYaml.json', (err, data) => {
          if(err) throw err;
          sla = JSON.parse(data);
      
          // Defining variables to use in the metric and discount generation
          let units = ["B","KB","MB","GB","TB","PT","EB", "%"];
          var comparators = ["<", ">", "<=", ">="];
          var operators = ["+", "-", "*", "/"];
          var conectors = ["&&", "||"];
          var newMetrics = [];
      
      
          // Generating metrics
          for(i= 0; i<argv.metrics; i++){
              var valor = "generated_" + argv.prefixMetrics + "_" + (newMetrics.length + 1);
      
              // Saving each metric for later use
              newMetrics.push(valor);
      
              // Random unit (Bytes, KiloBytes... or %)
              unit = units[Math.floor(Math.random() * 8)];
              
              // New metric, note that all have the 'computer' field going through /generated/
              let metr = {
                  schema: {
                      descripcion: "Randomly generated metric",
                      type: "double",
                      unit: unit
                  },
                  computer: "http://localhost:30500/api/v3/generated/"+ valor
              };
              // Minimum and maximum (between 1 and 100) for metrics that are not %
              if(unit != "%"){
                  metr.schema["minimum"] = 0;
                  metr.schema["maximum"] = Math.floor(Math.random() * 99)+1;
              }
              // Adding the new metric to the new file
              sla.terms.metrics[valor] = metr;
          }
          console.log("#### Metrics generated");
      
          // Generating discounts
          for(i= 0; i<argv.discounts; i++){
            
            // Declaration of different variables used depending on the complexity chosen
      
              // 4 random chosen comparators from the comparators list defined earlier
              let comparator = comparators[Math.floor(Math.random() * comparators.length)];
              let comparator2 = comparators[Math.floor(Math.random() * comparators.length)];
              let comparator3 = comparators[Math.floor(Math.random() * comparators.length)];
              let comparator4 = comparators[Math.floor(Math.random() * comparators.length)];
      
              // 4 random chosen operators from the operators list defined earlier
              let operator = operators[Math.floor(Math.random() * operators.length)];
              let operator2 = operators[Math.floor(Math.random() * operators.length)];
              let operator3 = operators[Math.floor(Math.random() * operators.length)];
              let operator4 = operators[Math.floor(Math.random() * operators.length)];
      
              // 1 random chosen conector from the conectors list defined earlier
              let conector = conectors[Math.floor(Math.random() * conectors.length)];
      
              // 6 random chosen metrics from the newMetrics list used to save the metrics
              let metricDiscount = newMetrics[Math.floor(Math.random() * newMetrics.length)];
              let metricDiscount2 = newMetrics[Math.floor(Math.random() * newMetrics.length)];
              let metricDiscount3 = newMetrics[Math.floor(Math.random() * newMetrics.length)];
              let metricDiscount4 = newMetrics[Math.floor(Math.random() * newMetrics.length)];
              let metricDiscount5 = newMetrics[Math.floor(Math.random() * newMetrics.length)];
              let metricDiscount6 = newMetrics[Math.floor(Math.random() * newMetrics.length)];
      
              // Units from the first 4 selected metrics (will be used to set the value of the next variables)
              let unitMetric = sla.terms.metrics[metricDiscount].schema.unit;
              let unitMetric2 = sla.terms.metrics[metricDiscount2].schema.unit;
              let unitMetric3 = sla.terms.metrics[metricDiscount3].schema.unit;
              let unitMetric4 = sla.terms.metrics[metricDiscount4].schema.unit;
      
              // 4 condition values to use on the billing, this values depend upon the maximum of the metric associated to that value condition
              // (in order to not make impossible to fulfil comparisons) or betweem 1 and 99 for % metrics
              let valueCondition = 0;
              if(unitMetric == "%"){
                valueCondition = (Math.floor(Math.random() * 98) +1);
              }else{
                valueCondition = (Math.floor(Math.random() *100* sla.terms.metrics[metricDiscount].schema.maximum-1)+1)/100;
              }
      
              let valueCondition2 = 0;
              if(unitMetric2 == "%"){
                  valueCondition2 = (Math.floor(Math.random() * 98) +1);
              }else{
                  valueCondition2 = (Math.floor(Math.random() *100* sla.terms.metrics[metricDiscount2].schema.maximum-1)+1)/100;
              }
      
              let valueCondition3 = 0;
              if(unitMetric3 == "%"){
                  valueCondition3 = (Math.floor(Math.random() * 98) +1);
              }else{
                  valueCondition3 = (Math.floor(Math.random() *100* sla.terms.metrics[metricDiscount3].schema.maximum-1)+1)/100;
              }
      
              let valueCondition4 = 0;
              if(unitMetric4 == "%"){
                  valueCondition4 = (Math.floor(Math.random() * 98) +1);
              }else{
                  valueCondition4 = (Math.floor(Math.random() *100* sla.terms.metrics[metricDiscount4].schema.maximum-1)+1)/100;
              }
      
              // Declaration of the newDiscount with a value between 1 and 25 and variable condition depending upon the complexity given
              // (simple complexity is used as default, even if the complexity given is not a valid one)
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
            
            // Saving the new discount in the new file
            sla.terms.pricing.billing.rewards[0].of.push(newDiscount);
          }
          console.log("#### Discounts generated");
      
          // Generating discounts
          for(i= 0; i<argv.guarantees; i++){
              // Randomly selected metric to use in the guarantee and maximum value and unit of that metric
              let metricGuarantee = newMetrics[Math.floor(Math.random() * newMetrics.length)];
              let maximumMetric = sla.terms.metrics[metricGuarantee].schema.maximum;
              let unitMetric = sla.terms.metrics[metricGuarantee].schema.unit;
      
              // Initialization of the 3 values to use in the guarantee
              let valorGuarantee1 = 0;
              let valorGuarantee2 = 0;
              let valorGuarantee3 = 0;
      
              // Giving values to the variables between 50 and 99 if the metric's unit is % or between 50% and 100% of the maximum metric's value otherwise
              if(unitMetric == "%"){
                  valorGuarantee1 = (Math.floor(Math.random() *100* 49))/100 + 50;
                  valorGuarantee2 = (Math.floor(Math.random() *100* 49))/100 + 50;
                  valorGuarantee3 = (Math.floor(Math.random() *100* 49))/100 + 50;
              }else{
                  valorGuarantee1 = (Math.floor(Math.random() *50* maximumMetric-1))/100 + maximumMetric/2;
                  valorGuarantee2 = (Math.floor(Math.random() *50* maximumMetric-1))/100 + maximumMetric/2;
                  valorGuarantee3 = (Math.floor(Math.random() *50* maximumMetric-1))/100 + maximumMetric/2;
              }
      
              //Definition of the guarantee
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
              //Saving the new guarantee in the new file
              sla.terms.guarantees.push(newGuarantee);
          }
          console.log("#### Guarantees generated");
      
          // Writing the file into a .yml
          let slaYaml = conversor.stringify(sla);
          let yamlStr = yaml.safeDump(slaYaml);
      
          fs.writeFileSync(argv.prefixMetrics+'_TimeStamp/SLAs/PoetisaSLA_' + argv.prefixFiles + '.yml', yamlStr.slice(7, yamlStr.length), 'utf8');
      
          console.log(".....SLA finished and writen in "+argv.prefixMetrics+"_TimeStamp/SLAs/PoetisaSLA_" + argv.prefixFiles + ".yml");

          return resolve();
        });
      }else{
        sla = yaml.load(data);
        console.log("SLA detected, using existing SLA........")
        return resolve();
      }
  
    });
  }).then(() =>{

    new Promise(function (resolve, reject) {
      fs.readFile(argv.prefixMetrics + '_TimeStamp/Collections/Poetisa.collection_'+argv.prefixFiles+'.json', (err, data) => {
        if(err){
          
          //Collection Generator -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
          console.log("Starting the Collection Generator.......");
          // Reading file baseRequest.json to use as base
          fs.readFile('bases/baseRequest.json', (err, data) => {
            if(err) throw err;
            postRequest = JSON.parse(data);
            
            // Declaration of variables to use, including the list of billing conditions and guarantees
            let max= 0;
            let billings = sla.terms.pricing.billing.rewards[0].of;
            let current_billing;
            let guarantees = sla.terms.guarantees;
            let current_guarantee;
      
            // Adding the metrics of the sla to the request
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
                    maximum: max.toString(),
                    type: "double",
                    unit: me.schema.unit
                },
                computer: "http://localhost:5001/api/v3/generated/"+m
              }
              postRequest.terms.metrics[m] = met;
            }
      
            // Adding the billings of the sla to the request
            for(i=0; i< billings.length; i++){
              current_billing = billings[i];
              current_billing["value"] = current_billing["value"].toString();
              postRequest.terms.pricing.billing.rewards[0].of.push(current_billing);
              
            }
      
            // Adding the billings of the sla to the request
            for(i=0; i< guarantees.length; i++){
              current_guarantee = guarantees[i];
              postRequest.terms.guarantees.push(current_guarantee);
            }
      
            // Reading file Poetisa.baseCollection.json to use as base
            fs.readFile('bases/Poetisa.baseCollection.json', (err, data) => {
              if(err) throw err;
              requestCollection = JSON.parse(data);
      
              // Adding the request generated to the collection
              requestCollection.item[0].request.body.raw = JSON.stringify(postRequest);
              // Writting the new collection
              fs.writeFileSync(argv.prefixMetrics + '_TimeStamp/Collections/Poetisa.collection_'+argv.prefixFiles+'.json', JSON.stringify(requestCollection), 'utf8');
              console.log(".....Collection finished and writen in "+ argv.prefixMetrics +"_TimeStamp/Collections/Poetisa.collection_"+argv.prefixFiles+".json");
              return resolve();
            });
          });
  
        }else{
          requestCollection = JSON.parse(data);
          console.log("Collection detected, using existing collection........")
          return resolve();
        }
      });
    }).then(() =>{ 
      //Data Generator ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

      // Generation of the bodies of data to post with apiInflux
      new Promise(function (resolve, reject) {

        // Data will only be generated if specified
        
        if(argv.generateData == "true"){
          
          console.log("Starting the Data Generator.......");

          //Declaration of variables to use
          var body = "";
          var numberOfEntries = 0;
          var numberOfMetrics = 0;
          var is_percentage = false;
          var metric_value = 0;
          var bodies = [];
          var currentMax = 0;
          var datasetFile = "";
          var csvCount = 0;
          var numberEntriesCsv = 0;

          // This variable has the nanoseconds between the value of the times of each entry in the database
          // We always use the same temporal windows with a difference in nanoseconds between the first and last instant being 37328400000000000
          // Knowing that and the number of entries, the difference between entries it's calculated like this.
          var timeJump = 37328400000000000/ (argv.number_values - 1);
    
          // For each metrics <argv.number_values> number of entries will be writen
          for( m in sla.terms.metrics){

            // Select the current metric and see if it's unit is %
            metric = sla.terms.metrics[m];
            currentMax = metric.schema.maximum;
            is_percentage = metric.schema.unit == "%";
            numberOfMetrics++;
  
            for(i=0; i<argv.number_values; i++){
              numberOfEntries++;
              
              // For each entrie a value is calculated with a normal
              if(is_percentage){
                // If the metric is % the value will be a normal calculated with the mean and deviation given which are already in %
                metric_value = randomNormal({mean: argv.mean, dev: argv.deviation}).toFixed(2)
              }else{
                // If the metric is not % the value will be a normal calculated with the normalised value of the maximum of the metric
                // multiplied by the mean and deviation respectively
                metric_value = randomNormal({mean: (metric.schema.maximum/100) * argv.mean, dev: (metric.schema.maximum/100)* argv.deviation})
                .toFixed(2);
              }
    
              // Checking if any value is off parameters and correcting it if necessary
              if(metric_value < 0){
                metric_value = 0;
              }else if(!is_percentage && metric_value > currentMax){
                metric_value = metric.schema.maximum;
              }else if(is_percentage && metric_value > 100){
                metric_value = 100;
              }
      
              // Adding the new entry to the current body
              body +=
                    "generated_" + argv.prefixMetrics + "_" + numberOfMetrics +
                    ",namespace_name=default,cluster_name=default,labels=mysql,type=pod,pod_name=moodle-rc-11700317 value=" +
                    metric_value + " " +
                    // Time in nanoseconds of the entry to have in the database, 1473199200000000000 is the time in nanoseconds of the begining
                    // of the temporal window used
                    Math.floor(timeJump * i + 1473199200000000000) + "\n";
                  

              // As the database can't manage a single Post with too many entries, every 112500 entries or at the last entrie,
              // the current body will be saved and then reseted as to make as many Posts as bodies we have at the end.
              // Doing it this way will prevent an overload in the database
              if(numberOfEntries % 112500 == 0 || numberOfEntries == argv.metrics*argv.number_values)  {
                bodies.push(body);
                body = "";
                
              }  
              if(numberOfEntries % 450000 == 0 || numberOfEntries == argv.metrics*argv.number_values)  {

                let csvBody = "NUMBER_METRICS,NUMBER_DISCOUNTS,NUMBER_GUARANTEES,COMPLEXITY,ENTIRES_PER_METRIC,RESPONSE_AVG,"+
                  "RESPONSE_MIN,RESPONSE_MAX,RESPONSE_SD,BYTES_RECEIVED,NUMBER_COLLECTIONS,NUMBER_ITERATIONS\n";
                let numberBodiesToAdd = 0;

                if(numberOfEntries % 450000 == 0){
                  numberBodiesToAdd = 4;
                  numberEntriesCsv = 450000;
                }else{
                  numberBodiesToAdd = Math.floor( ((numberOfEntries % 450000)/112500) +1);
                  numberEntriesCsv = numberOfEntries % 450000;
                }
                for(j = 0;j<numberBodiesToAdd;j++){
                  csvBody += bodies[j + (csvCount*4)];
                }
            
                csvCount++;

                datasetFile = './' + argv.prefixMetrics + '_TimeStamp/Datasets/Dataset_'+argv.prefixFiles+'_'+numberEntriesCsv+'_Entries_'+csvCount+'.csv';
                console.log("Writing dataset in "+datasetFile+" .......");
                fs.writeFileSync(datasetFile, csvBody,'utf8');
              }
            } 
            
          }
          
          console.log(bodies.length + " sets of data generated, posting them to InfluxDB......");
          // Lastly each of the bodies we have will be posted to the DB with 2s between Posts as not to overload the DB
          var cont = 0;
          for(b= 0; b<bodies.length; b++){
    
            setTimeout(() => {
    
              if(cont==bodies.length -1 ){
                // At the last body we resolve the promise to let it know that we finished
                apiWriteInflux(bodies[cont]).then(() =>{
                  console.log(".............All data posted to InfluxDB");
                  bodies = [];
                  return resolve();
                });
    
              }else{
    
                apiWriteInflux(bodies[cont]);
                console.log((((cont+1)/bodies.length)*100).toFixed(2)+"% of data posted");
              }
              cont++;
              
            }, 2000*(b+1));
    
          }
          
        }else{
          console.log("New data won't be generated.........");
          return resolve();
        }
      }).then(() =>{
      //Collection Runner and CSV Writer ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  
        //Once all the data is in the DB, a newman.run will be launch with the collection previously generated

        var pathToCSV = './' + argv.prefixMetrics + '_TimeStamp/Results/Experiment_'+argv.prefixMetrics+'.csv';
        var newData = "";
        var contCollections = 0;
        
        console.log('Running '+argv.newmanCalls+' collections, '+argv.iterationsCollection+' times each .......');

        for(i=0; i< argv.newmanCalls; i++){

          newman.run({
            collection: requestCollection,
            iterationCount: argv.iterationsCollection // As many  iterations as indicated
          }).on('done', function (err, summary) {
            if (err || summary.error) {
                console.error('collection run encountered an error.');
            }else {
              setTimeout(() => {
              
                fs.readFile(pathToCSV, (err, data) => {
                  if(err){
  
                    let header =
                     "NUMBER_METRICS,NUMBER_DISCOUNTS,NUMBER_GUARANTEES,COMPLEXITY,ENTIRES_PER_METRIC,RESPONSE_AVG,"+
                    "RESPONSE_MIN,RESPONSE_MAX,RESPONSE_SD,BYTES_RECEIVED,NUMBER_COLLECTIONS,NUMBER_ITERATIONS\n"+
                    argv.metrics+","+argv.discounts+","+argv.guarantees+","+argv.complexity+","+argv.number_values+","+
                    summary.run.timings.responseAverage.toFixed(2).toString()+","+summary.run.timings.responseMin.toString()+","+
                    summary.run.timings.responseMax.toString()+","+summary.run.timings.responseSd.toFixed(2).toString()+","+
                    summary.run.transfers.responseTotal.toString()+","+argv.newmanCalls+","+argv.iterationsCollection+"\n";
  
                    fs.writeFileSync(pathToCSV, header ,'utf8');
                  }else{
                    
                    // Once we have the results of newman.run in 'summary', we push it to 'records'
                    if(newData == ""){
                      newData = data;
                    }
                    newData += argv.metrics+","+argv.discounts+","+argv.guarantees+","+argv.complexity+","+argv.number_values+","+
                    summary.run.timings.responseAverage.toFixed(2).toString()+","+summary.run.timings.responseMin.toString()+","+
                    summary.run.timings.responseMax.toString()+","+summary.run.timings.responseSd.toFixed(2).toString()+","+
                    summary.run.transfers.responseTotal.toString()+","+argv.newmanCalls+","+argv.iterationsCollection+"\n";
  
                  }
                    contCollections++;
  
                  if(contCollections == argv.newmanCalls){
                    if(newData.length > 0){
                      fs.writeFileSync(pathToCSV, newData,'utf8');
                    }
                    console.log("All running collections finished, results written in " + pathToCSV + " .......");
                  }
                });
              }, 100* (contCollections +1));
            }
          });
        }
      });
    });
  });
}


// Funcion de escritura en la DB 'k8s'
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