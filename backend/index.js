/**
 * This module will star the express server
 */

// import the webapp
const webapp = require('./server');

const port = 8080;
// start the web server
webapp.listen(port, () => {
  console.log('Server running on port ', port); // should be kept in eslint
});
