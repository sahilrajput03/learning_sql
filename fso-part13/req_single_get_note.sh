#!/bin/bash
. ./.env-bash # Load .env-bash variables.
addr=localhost:3001/api/notes/2
echo Get Request @ $addr
echo
echo Response:
curl $addr \
 -s #| json_pp
