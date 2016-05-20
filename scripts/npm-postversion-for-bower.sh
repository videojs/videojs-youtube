#!/usr/bin/env bash

cd $( cd "$( dirname "$( dirname "${BASH_SOURCE[0]}" )" )" && pwd )

VERSION="$(node -p "require('./package.json').version")"

if [ -d "./.git" ]; then
  ORIGIN=`git remote | grep "^origin$"`;

  if [ "$ORIGIN" != "" ]; then
    git reset --hard origin/master
    git push origin --tags
  fi

  echo "Finished version bump to v$VERSION!"
fi
