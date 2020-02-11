#!/bin/bash


echo "############### STARTING EXPERIMENT NUMBER 2: NUMBER OF TERMS INCREASED EXPONENTIALLY ################"
for i in $(seq 0 10); do
  terms=$((2**i))
  prefixFiles="exp2_"$((i+1))
  echo ======================= ITERATION NUMBER $((1+i)): $terms TERMS ======================
    ./resetDB.sh
    ./runComputation.sh $terms 64 $terms simple exp2 7500 50 20 $prefixFiles true 10
 done

