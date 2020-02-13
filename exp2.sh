#!/bin/bash


echo "############### STARTING EXPERIMENT NUMBER 2: NUMBER OF TERMS INCREASED EXPONENTIALLY ################"
for i in $(seq 1 10); do
  terms=$((2**i))
  prefixFiles="exp2_"$i
  echo ======================= ITERATION NUMBER $i: $terms TERMS ======================
    ./resetDB.sh
    ./runComputation.sh $terms 64 $terms simple exp2 7500 50 20 $prefixFiles true 100 1
 done
 echo "############ SCRIPT FINISHED ############"

