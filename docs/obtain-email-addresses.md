## Obtaining email addresses from firebase

WARNING: Only email people with consent. Permission based marketing is the best way to grow your email list.

```
$ firebase auth:export --project co-reality-map auth.json
$ jq '.users[] | "\(.createdAt) \(.email)"' auth.json|awk '$2!="null\"" {print $0}'|sed -e 's/^"//' -e 's/"$//'|awk '{print $1"\t"$2}'|pbcopy
```

Paste into a google sheet. Leftmost column is the [UNIX timestamp](https://en.wikipedia.org/wiki/Unix_time) of the account creation. This can be converted easily:

1. Create a new column to the right of the timestamp
2. Use the formula: `=A4/86400000 + DATE(1970,1,1)`
3. Fill down to get all values
4. Sort by timestamp or the calculated, human date
5. Consider not adding any with a "+"
6. Be mindful this is PII (personally identifiable information) so handle it carefully and treat it as sensitive. It may be subject to the GDPR data privacy requirements in the EU and the CCPA privacy laws in California.
7. Share the Google sheet, ready to import the users into our other email lists.
8. Email the new folks, welcome them, and say thanks for coming to the party!
