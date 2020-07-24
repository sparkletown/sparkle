#!/bin/bash
set -euo pipefail

if [ "$#" -ne 3 ]; then
  echo ERROR: VENUE is required.
  echo
  echo ${0}: Shell script to upload venue config.
  echo
  echo Usage: $0 VENUE USERNAME PASSWORD
  echo
  echo Example: $0 example user@name.com password
  echo This will store configs/example.js in a firestore document at \"venues/example\".
  exit 1
fi

API_KEY=$(grep API_KEY $(dirname $0)/../src/secrets.js|head -n1|cut -d\" -f2)
VENUE=$1
USERNAME=$2
PASSWORD=$3

node $(dirname $0)/config-upload.js ${API_KEY} ${VENUE} ../configs/${VENUE}.js ${USERNAME} ${PASSWORD}
