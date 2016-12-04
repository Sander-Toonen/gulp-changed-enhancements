# Plugin for gulp-changed, provide custom comparators for CSS, JS (ES6), and Pug

Only pass through if file changed or file from which it depends.

## Using 

For JS
```js
    return gulp.src(`${src}/*.{js,jsx}`)
      .pipe($.changed(dist, {
        hasChanged: require('gulp-changed-enhancements').compareLastModifiedTimeJSDeps,
        extension: '.js'
      }))
      ....
```

For CSS
```js
    return gulp.src(`${src}/*.{css,sss}`)
      .pipe($.changed(dist, {
        hasChanged: require('gulp-changed-enhancements').compareLastModifiedTimeCSSDeps,
        extension: '.css'
      }))
      ....
```

For Pug
```js
    return gulp.src(`${src}/*.{pug}`)
      .pipe($.changed(dist, {
        hasChanged: require('gulp-changed-enhancements').compareLastModifiedTimePugDeps,
        extension: '.html'
      }))
      ....
```