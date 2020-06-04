EVENT=example
CONFIG=example.js
node $(dirname $0)/config-upload.js ${EVENT} $(dirname $0)/../configs/${CONFIG}
