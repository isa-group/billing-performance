#!/bin/bash


echo "############### STARTING EXPERIMENT NUMBER 2: NUMBER OF METRICS INCREASED EXPONENTIALLY ################"
for i in $(seq 0 10); do
  metrics=$((2**i))
  prefixFiles="exp1_"$((i+1))                                                  
  echo ======================= ITERATION NUMBER $((1+i)): $metrics METRICS ======================
    ./resetDB.sh
    ./runComputation.sh 1 $metrics 1 simple exp1 7500 50 20 $prefixFiles true 10
 done

