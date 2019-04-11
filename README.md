# Gulp builder

This project provides a tools for frontend development.

## Setup and run gulp builder

1. Go to the `gulp` folder.
2. Run `npm i` for installing tools and dependencies.
3. Run `gulp` for build project, run BrowserSync and file's watcher.

## Available commands

- `gulp watch` or `gulp` - default command for building project, running BrowserSync and file's watcher.
- `gulp css` - compile scss files in one css file.
- `gulp js` - compile js files in one js file. You can use `--min` argument for build minified version of file.
- `gulp build` - for build whole project (css, js, clear cache).

## Possibilities

- compile js and css files on fly.
- make changes in browser on fly with BrowserSync.
- automatically clear drupal cache and update page with BrowserSync when template was changed.

## Using BrowserSync

BrowserSync is a powerful time-saving tool for a frontend development.
To use BrowserSync:
1. run `gulp`
2. open your favorite browser
3. go to the address specified in the console as `External`. For example: `https://192.168.1.10:3100`.
4. Modify the scss file and and look at the magic :)

You can open several windows at same time for developing. For example "desktop with" and "mobile with".
More information on `https://www.browsersync.io` and on Google.

## Config

You can change path to folders, site's name or BrowserSync's port in the config file (config.js).