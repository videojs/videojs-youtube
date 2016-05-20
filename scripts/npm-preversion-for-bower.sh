#!/usr/bin/env bash

cd $( cd "$( dirname "$( dirname "${BASH_SOURCE[0]}" )" )" && pwd )

if [ -d "./.git" ]; then
  BRANCH=`git rev-parse --abbrev-ref HEAD`

  if [ "$BRANCH" != "master" ]; then
    echo "The current branch should be 'master'; please checkout 'master' before versioning."
    exit 1
  else
    npm test
  fi
else
  echo "This plugin project is not a Git repository; skipping versioning scripts."
  exit 1
fi
