#!/bin/bash


echo "############# STARTING EXPERIMENT NUMBER 3: COMPLEXITY OF BILLINGS #############"
for i in $(seq 1 10); do

    echo ======================= ITERATION NUMBER $i: SIMPLE COMPLEXITY ======================
    ./resetDB.sh
    ./runComputation.sh 64 64 64 simple exp3 7500 50 20 exp3_simple_$i true 100 1

    echo ======================= ITERATION NUMBER $i: MEDIUM COMPLEXITY ======================
    ./resetDB.sh
    ./runComputation.sh 64 64 64 medium exp3 7500 50 20 exp3_medium_$i true 100 1

    echo ======================= ITERATION NUMBER $i: COMPLEX COMPLEXITY ======================
    ./resetDB.sh
    ./runComputation.sh 64 64 64 complex exp3 7500 50 20 exp3_complex_$i true 100 1

done
echo "############ SCRIPT FINISHED ############"
