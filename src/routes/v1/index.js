const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const permissionRoute = require("./permission.route")
const sidemenuRoute = require('./sidemenu.route')
const lmdRoute = require('./lmd.route');
const srspRoute = require('./srsp.route');
const kadamRoute = require('./kadam.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/permission',
    route: permissionRoute
  },
  {
    path: '/sidemenu',
    route: sidemenuRoute
  },
  {
    path: '/lmd',
    route: lmdRoute
  },
  {
    path: '/srsp',
    route: srspRoute
  },
  {
    path: '/kadam',
    route: kadamRoute
  }
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
