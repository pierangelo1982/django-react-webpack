# Django + REACT with Webpack

create virtualenv
` > virtualenv -p python3 env`

active virtualenv
` > source env/bin/activate`
create a requirements.txt and add this packages:
```
Django
django-webpack-loader
freeze
djangorestframework
markdown
django-filter
mysqlclient
pillow
django-image-cropping
django-filer
django-tinymce
```

install requirements
` > pip3 install requirements.txt`

### create database with docker:

mysql
```
docker run --name gtgroup-mysql \
    -e MYSQL_ROOT_PASSWORD=alnitek82 \
    -p 3306:3306 \
    -d mysql:5.7

```

phpmyadmin
```
docker run --name gtgroup-phpmyadmin -d --link gtgroup-mysql:db -p 8081:80 phpmyadmin/phpmyadmin
```

## REACT
create frontend:
`> npx create-react-app frontend`
```
npm install --save-dev webpack webpack-bundle-tracker
```

install webpack bundle tracker:
```
npm install "webpack-bundle-tracker@<1" --save
```
create a file names webpack.config.js
`> touch webpack.config.js`

and add this code:
```
var path = require('path');
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');
var ExtractText = require('extract-text-webpack-plugin');

module.exports = {
  entry:  path.join(__dirname, 'src/index'),
  output: {
    path: path.join(__dirname, 'dist'),
    //filename: '[name]-[hash].js'
    filename: '[name].js'
  },
  plugins: [
    new BundleTracker({
      path: __dirname,
      filename: 'webpack-stats.json'
    }),
    new ExtractText({
        filename: '[name]-[hash].css'
    }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader'],
      },
      {
        //test: /\.(png|svg|jpg|gif|jpe?g)$/,
        test: /\.(png|svg|jpg|gif|jpe?g)$/,
        use: [
          {
            options: {
              name: "[name].[ext]",
              outputPath: "img/"
            },
            loader: "file-loader"
          }
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "fonts/"
            }
          }
        ]
      }
    ],
  },
}
```
install npm packages
```
npm install --save-dev babel-cli babel-core babel-loader babel-preset-env babel-preset-es2015 babel-preset-react babel-register
```

and also this packages:
```
$ npm install --save-dev css-loader style-loader sass-loader node-sass extract-text-webpack-plugin
```

create a file names .babelrc:
`touch .babelrc`

and add this code:
```
{
  "presets": ["@babel/preset-env","@babel/preset-react"]
}
```

in packages.json add this in scripts:
```
...
"scripts": {
  ...
  "start": "./node_modules/.bin/webpack --config webpack.config.js",
  "watch": "npm run start -- --watch"
},
...
```
### Django webpack
create a folder named templates

in settings.py add this codes:

add webpack in installed app:
```
INSTALLED_APPS = [
    ...
    'webpack_loader',
    ...
]
```
add the path to the templates folders:
```
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, "templates"), ],
        'APP_DIRS': True,
        'OPTIONS': {
            ...
        },
    },
]

```

set the staticfiles and webpack loader:
```
STATIC_URL = '/static/'

STATICFILES_DIRS = (os.path.join(BASE_DIR, 'frontend'),)

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

MEDIA_URL = '/media/'

### webpack 
WEBPACK_LOADER = {
    'DEFAULT': {
            'CACHE': DEBUG,
            'BUNDLE_DIR_NAME': 'dist/',
            'STATS_FILE': os.path.join(BASE_DIR, 'frontend/webpack-stats.json'),
            'POLL_INTERVAL': 0.1,
            'TIMEOUT': None,
            'IGNORE': [r'.+\.hot-update.js', r'.+\.map'],
            'LOADER_CLASS': 'webpack_loader.loader.WebpackLoader',
        }
}
```

now in templates folder create a file named index.html

and add this code:
```
{% load render_bundle from webpack_loader %}
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Example</title>
        <!-- Webpack rendered CSS -->
        {% render_bundle 'main' 'css' %}
    </head>
    <body>
        <div id="react-app"></div>
            {% render_bundle 'main' 'js' %}
        </body>
</html>
```

in urls.py 

set this:
```
from django.contrib import admin
from django.urls import path
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', TemplateView.as_view(template_name='index.html')),    
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns += staticfiles_urlpatterns()
```

### start application:
compile the react file:
```
npm start watch
```

and now you can run python:
```
python manage.py run server
```