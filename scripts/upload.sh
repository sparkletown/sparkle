#!/bin/bash
set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo ERROR: EVENT is required.
  echo
  echo ${0}: Shell script to upload event config.
  echo
  echo Usage: $0 EVENT
  echo
  echo Example: $0 example
  echo This will store config/example.js in a firestore document at \"config/example\".
  exit 1
fi

API_KEY=$(grep API_KEY $(dirname $0)/../src/secrets.js|head -n1|cut -d\" -f2)
EVENT=$1

node $(dirname $0)/config-upload.js ${API_KEY} ${EVENT} ../configs/${EVENT}.js
