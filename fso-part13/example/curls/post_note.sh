#!/bin/bash
. $(dirname "$0")/.env-bash # Load .env-bash variables.
addr=localhost:3001/api/notes
echo POST request @ $addr
echo
echo Response:
curl $addr \
 -H "Content-Type: application/json" \
 -X POST \
 -d '{"content": "Very amazing note."}'\
 -s | json_pp
# or

# USING THIS FILE VIA `run task` vscode's command keybinding (my custom binding) `ctrl+alt+r` work phenolmenally as desirable!
# BCOZ I have configured my tasks.json file in learning_sql level `.vscode/tasks.json` file, yikes!! Src: https://code.visualstudio.com/docs/editor/tasks