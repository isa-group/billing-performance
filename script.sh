
#!/bin/bash

echo "Enter the number of discounts you want -->"
read response
discounts=$response
echo "Enter the number of metrics you want -->"
read response
metrics=$response
echo "Enter the number of guarantees you want -->"
read response
guarantees=$response
echo "Enter the complexity you want (simple, medium or complex) -->"
read response
complexity="$response"
echo "Enter the prefix you want in the metric -->"
read response
prefixMetric="$response"
echo "Enter the number of entries you want per metric in the database -->"
read response
numberEntries=$response
echo "Enter the mean value of metrics in the database (in percentage)-->"
read response
mean=$response
echo "Enter the standar deviation of values in the database (in percentage) -->"
read response
deviation=$response
echo "Enter the prefix you want for the entries -->"
read response
prefixEntries="$response"
echo "Reset database? (true or false) -->"
read response
reset="$response"
echo "Number of iterations of the experiment -->"
read response
iterations="$response"

node index.js generateYaml --discounts $discounts -m $metrics -g $guarantees -c $complexity -p $prefixMetric
sleep 1
node index.js generateDataset -n $numberEntries -m $mean -d $deviation --prefix $prefixEntries -r $reset
sleep 1
node index.js generateCollection
sleep 1
newman run Poetisa.collection.json -n $iterations
