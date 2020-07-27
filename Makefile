deploy-staging:
	git checkout staging && git pull && rm ./.env && cp ./.env.staging ./.env && rm ./functions/secrets.js && cp ./functions/secrets.staging.js ./functions/secrets.js && firebase use staging && npm run build && firebase deploy --only hosting:staging,functions && rm ./.env && cp ./.env.local ./.env && rm ./functions/secrets.js && cp ./functions/secrets.local.js ./functions/secrets.js

deploy-production:
	git checkout master && git pull && rm ./.env && cp ./.env.production ./.env && rm ./functions/secrets.js && cp ./functions/secrets.production.js ./functions/secrets.js && firebase use prod && npm run build && firebase deploy --only hosting:co-reality-map,functions && rm ./.env && cp ./.env.local ./.env && rm ./functions/secrets.js && cp ./functions/secrets.local.js ./functions/secrets.js
