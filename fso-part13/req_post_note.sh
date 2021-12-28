#!/bin/bash
. ./.env-bash # Load .env-bash variables.
addr=localhost:3001/api/notes
echo POST request @ $addr
echo
echo Response:
curl $addr \
 -H "Content-Type: application/json" \
 -X POST \
 -d '{"content": "Very amazing note."}'\
 -s | json_pp
