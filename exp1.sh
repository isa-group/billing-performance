#!/bin/bash


echo "#### STARTING EXPERIMENT NUMBER 1: NUMBER OF METRICS INCREASED EXPONENTIALLY ###"
for i in $(seq 1 10); do
  metrics=$((2**i))
  prefixFiles="exp1_"$i                                                  
  echo ======================= ITERATION NUMBER $i: $metrics METRICS ======================
    ./resetDB.sh
    ./runComputation.sh 64 $metrics 64 simple exp1 7500 50 20 $prefixFiles true 100 1
 done
 echo "############ SCRIPT FINISHED ############"

