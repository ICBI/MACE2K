# mace2k-viz-app
There are two major components to this application - a Vue.js front end and a neo4j graph database (backend). The backend can be accessed at http://hypatia.esacinc.com:7474/browser/
The username and password are hard coded in the files!

There is an external dependency with popoto.js.
The standard npm install will get the latest version. I have modified the source for it to query only two nodes at a time, otherwise the query buider generates queries that take forever do to cartesian products.
Check out the popotjs module, replace the two files called query.js and graph.js from the files in this directory, to query/query.js and graph/graph.js in the node_modules/popoto/src directory, rebuild the module and then rebuild the app to use these modified files - otherwise app will be very slow


## Project setup
```
npm install
```
See note above to see how to replace popoto files
### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```
The build directory can then be copied to any web server where it is to be hosted. May not work over https but have not tested. The deployment location is set in vue.config.js as mace2k-viz - so it has to be deployed on mace2k-viz directory on the web server
```
publicPath: process.env.NODE_ENV === 'production' ? '/mace2k-viz/' : '/'
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
