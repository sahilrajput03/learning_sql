#!/bin/bash
PS3='ENTER TASK NUMBER: '
# In below command I have added `clear`, `ls` commands to clear screen and list commands. Yo!
# USAGE:
# - Press Enter anytime to print the options menu!
# - Press 1 to clear screen anytime.
# src: https://linuxize.com/post/bash-select/
select script in 'Clear Screen' $(ls $(dirname "$0"))
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
