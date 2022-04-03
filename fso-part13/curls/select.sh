#!/bin/bash
PS3='Enter task number: '
# In below command I have added `clear`, `ls` commands to clear screen and list commands. Yo!
# src: https://linuxize.com/post/bash-select/
select script in clear list $(ls $(dirname "$0"))
do
	case $script in
		clear)
			clear
			./$0
		  ;;

		list)
			./$0
		  ;;

		*)
		echo "Selected task: $REPLY"
		./$(dirname "$0")/$script
		  ;;
	esac
done
