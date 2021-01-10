#!/bin/bash

printf "> Sniffing for bad patterns...\n"

# Check For ESLint
ESLINT="node_modules/eslint"
if [ ! -d "$ESLINT" ]; then
	printf "! ESLint not found at ${ESLINT}, check your dev environment.\n> Commit aborted.\n> ---\n"
	exit 1 # exit with failure status
fi

# Run ESLint
ERRORS=0
for file in $(git diff --cached --name-only | grep -E '\.(js|ts)$')
do
	output=`git show ":$file" | node_modules/.bin/eslint --color --stdin --stdin-filename "$file"`
	N=$(($(wc -l <<< "$output") - 1))
	ERRORS=$((ERRORS + N))
	if [ $N -ne 0 ]; then
		echo "$output"
	fi
done

# Abort if found errors.
if [ $ERRORS -ne 0 ]; then
	printf "\n> At least one problem was found. Commit aborted.\n\n"
	exit 1
fi

# :)
printf "> Done sniffing, no problems found.\n\n"