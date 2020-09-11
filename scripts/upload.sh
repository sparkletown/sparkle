#!/bin/bash
set -euo pipefail

if [ "$#" -ne 4 ]; then
  echo ERROR: VENUE is required.
  echo
  echo ${0}: Shell script to upload venue config.
  echo
  echo Usage: $0 PROJECT_ID VENUE USERNAME PASSWORD
  echo
  echo Example: $0 co-reality-map example user@name.com password
  echo This will store configs/example.js in a firestore document at \"venues/example\".
  exit 1
fi

PROJECT_ID=$1
API_KEY=$(grep API_KEY $(dirname $0)/../.env|head -n1|cut -d= -f2)
VENUE=$2
USERNAME=$3
PASSWORD=$4

node $(dirname $0)/config-upload.js ${PROJECT_ID} ${API_KEY} ${VENUE} ../configs/${VENUE}.js ${USERNAME} ${PASSWORD}
