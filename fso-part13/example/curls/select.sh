#!/bin/bash
PS3='
----
ENTER TASK NUMBER: '
# In below command I have added `clear`, `ls` commands to clear screen and list commands. Yo!
# USAGE:
# - Press <ENTER> anytime to PRINT the options menu anytime!
# - Press 1 to CLEAR screen anytime.
# - Press ctrl+c to CLOSE the select menu anytime.
# src: https://linuxize.com/post/bash-select/
select script in 'Clear Screen' $(ls $(dirname "$0" ) | grep -v select )
do
	case $script in
		'Clear Screen')
			clear
			"$0"
		  ;;

		*)
		echo "Selected task: $REPLY"
		./$(dirname "$0")/$script
		  ;;
	esac
done
