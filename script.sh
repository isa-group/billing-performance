
#!/bin/bash

if [ "$#" -ne 11 ]; then
    echo "ERROR: Wrong number of parameters!"
    echo "Usage: $0 <discounts> <metrics> <guarantees> <complexity> <prefixMetric> <numberEntries> <mean> <deviation> <prefixEntries> <reset> <iterations> "
    echo "Example: $0 9 4 2 simple Metr 100  50 20 dataExample true 1"
    exit
fi

discounts=$1
metrics=$2
guarantees=$3
complexity="$4"
prefixMetric="$5"
numberEntries=$6
mean=$7
deviation=$8
prefixEntries="$9"
shift 9
reset="$1"
iterations="$2"

node --max-old-space-size=8192 index.js generateExperiment --discounts $discounts -m $metrics -g $guarantees -c $complexity --prefixMetrics $prefixMetric -n $numberEntries --mean $mean -d $deviation --prefixData $prefixEntries -r $reset -i $iterations

