# Scripts for Various Sparkly Things

Most scripts have their own usage instructions within the script themselves, which you can also see when running those scripts with no arguments.

These scripts require a Firebase service account key, which you setup once for each environment. To obtain this file, go to the Firebase admin console and follow these steps:

1. Go to _Project Settings_
2. Go to _Service Accounts_
3. Click `Generate new private key`
4. You will be prompted to download a file that looks similar to `PROJECT-ID-firebase-adminsdk-abc12-1234567890.json`
5. Save it to your `scripts` folder (it is automatically excluded in our default `.gitignore` file)

**WARNING:** this file grants passwordless access to ALL data in Firebase, including delete access. Treat the file like a private key (because it is one!) and keep it safe.

Run your chosen script just like any other command line tool. If you are creating a new environment, we recommend starting with the Bootstrap script:

```
./bootstrap-new-environment.ts [project-id] [project-private-key]
```

For example:

```
./bootstrap-new-environment.ts my-project my-project-firebase-adminsdk-abc12-1234567890.json
```
