#!/bin/bash


echo "############# STARTING EXPERIMENT NUMBER 3: COMPLEXITY OF BILLINGS #############"

echo ======================= ITERATION NUMBER 1: SIMPLE COMPLEXITY ======================
    ./resetDB.sh
    ./runComputation.sh 64 64 64 simple exp3 7500 50 20 exp3_simple true 10

echo ======================= ITERATION NUMBER 1: MEDIUM COMPLEXITY ======================
    ./resetDB.sh
    ./runComputation.sh 64 64 64 medium exp3 7500 50 20 exp3_medium true 10

echo ======================= ITERATION NUMBER 1: COMPLEX COMPLEXITY ======================
    ./resetDB.sh
    ./runComputation.sh 64 64 64 complex exp3 7500 50 20 exp3_complex true 10


