#!/bin/bash
. $(dirname "$0")/.env-bash # Load .env-bash variables.
addr=localhost:3001/api/notes/2
echo Get Request @ $addr
echo
echo Response:
curl $addr \
 -s | json_pp
#  -s #| json_pp

# USING THIS FILE VIA `run task` vscode's command keybinding (my custom binding) `ctrl+alt+r` work phenolmenally as desirable!
# BCOZ I have configured my tasks.json file in learning_sql level `.vscode/tasks.json` file, yikes!! Src: https://code.visualstudio.com/docs/editor/tasks