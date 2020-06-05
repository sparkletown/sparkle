EVENT=example
CONFIG=example.js
API_KEY=$(grep API_KEY $(dirname $0)/../src/secrets.js|head -n1|cut -d\" -f2)

node $(dirname $0)/config-upload.js ${API_KEY} ${EVENT} ../configs/${CONFIG}
