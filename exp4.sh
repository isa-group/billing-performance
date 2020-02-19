#!/bin/bash


echo "##### STARTING EXPERIMENT NUMBER 4: NUMBER OF PARALLEL POSTS INCREASED EXPONENTIALLY #####"

./resetDB.sh
echo ================ ITERATION NUMBER 1: 1 PARALLEL POSTMAN POST ================
./runComputation.sh 64 64 64 medium exp4 7500 50 20 exp4 true 100 1
for i in $(seq 2 11); do
  parallelCalls=$((100/$i))                           
  echo ================ ITERATION NUMBER $((i -1)): $i PARALLEL POSTMAN POSTS ================
    ./runComputation.sh 64 64 64 medium exp4 7500 50 20 exp4 false $parallelCalls $i
 done
 echo "############ SCRIPT FINISHED ############"

