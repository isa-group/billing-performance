#!/bin/bash


echo "##### STARTING EXPERIMENT NUMBER 5: NUMBER OF ENTRIES INCREASED EXPONENTIALLY #####"
for i in $(seq 1 11); do
  entries=$((3**i))                                                                   
  echo ================ ITERATION NUMBER $i: $entries ENTRIES PER METRIC ================
    ./resetDB.sh
    ./runComputation.sh 64 64 64 medium exp5 $entries 50 20 exp5 true 100 1
done

echo "############ SCRIPT FINISHED ############"
