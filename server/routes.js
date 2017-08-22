module.exports = function(app) {
  // App First Route
  app.use(function (req, res, next) {
    // Dont Log for OPTIONS
    if (req.method === 'OPTIONS') {
      return next(null, res);
    }
    // Local Variables
    var header = req.headers;
    var record = {entity: req.url, method: req.method, params: req.params, body: req.body};
    // Console Printing
    console.log ('------------------------------');
    console.log ('NEW Service Called at %s', Date.now('H:i:s'));
    console.log (req.method + ' ' + req.url + ' ');
    return next(null, res);
  });

  app.use('/api/users', require('./controllers/users'));
  app.use('/api/friends', require('./controllers/friends'));
  app.use('/api/groups', require('./controllers/groups'));
  app.use('/api/messages', require('./controllers/messages'));

  app.use(function (req, res, next) {
    // Check Error
    if (res.error) {
      // Set Error Code
      res.errorCode = res.error;
      res.error = true;
      // Set Error Dev Message and Error Message
      switch (res.errorCode) {
        case 401:
          res.errorDevMessage = 'INCOMPLETE_DATA';
          res.errorMessage = 'Parameter(s) missing';
          break;
        case 402:
          res.errorDevMessage = 'ERROR_FETCHING_DATA';
          res.errorMessage = 'Error in Fetching Data';
          break;
        case 403:
          res.errorDevMessage = 'RESOURCE_NOT_FOUND';
          res.errorMessage = 'Resource not Found';
          break;
        case 405:
          res.errorDevMessage = 'USER_NOT_AUTHORIZED';
          res.errorMessage = 'User Not Authorized';
          break;
        case 406:
          res.errorDevMessage = 'USER_INACTIVE';
          res.errorMessage = 'User Account is Blocked';
          break;
        case 407:
          res.errorDevMessage = 'DB_ERROR_FOUND';
          res.errorMessage = 'Error in Database Query';
          break;
        case 409:
          res.errorDevMessage = 'INCORRECT_USERNAME_OR_PASSWORD';
          res.errorMessage = 'Incorrect Username or Password';
          break;
        case 410:
          res.errorDevMessage = 'RECORD_ALREADY_EXIST';
          res.errorMessage = 'Record Exists Already';
          break;
      }
      // Prepare Output Data
      res.data = {'code': res.errorCode, 'developerMessage': res.errorDevMessage, 'message': res.errorMessage};
      return res.send({'error': res.error, 'data': res.data});
    }
    else {
      return res.send({'error': res.error, 'data': res.data});
    }
  });
};
