#!/usr/bin/env bash

cd $( cd "$( dirname "$( dirname "${BASH_SOURCE[0]}" )" )" && pwd )

VERSION="$(node -p "require('./package.json').version")"

if [ -d "./.git" ]; then
  ORIGIN=`git remote | grep "^origin$"`;

  # Commit package.json with a new version and push it.
  git add package.json
  git commit -m "$VERSION"

  if [ "$ORIGIN" != "" ]; then
    git push origin master
  else
    echo "No 'origin' remote was found, so pushing will be skipped!"
  fi

  # Build the plugin and force-add dist/ so that npm's commit picks that up
  # instead of the package.json change. This is what should be tagged!
  npm run build
  git add -f dist
fi
