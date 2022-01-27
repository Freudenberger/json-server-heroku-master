const jsonServer = require('./json-server');
const fs = require('fs');
const path = require('path');

const customRoutes = (req, res, next) => {
  try {
    if (req.method === 'GET' && req.url.endsWith('/reloadDB')) {
      const db = JSON.parse(fs.readFileSync(path.join(__dirname, 'db-base.json'), 'utf8'));
      router.db.setState(db);
      console.log('reloadDB successful');
      res.sendStatus(201);
    } else if (req.method === 'GET' && req.url.endsWith('/db')) {
      const dbData = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8'));
      res.json(dbData);
      req.body = dbData
      } else if (req.method === 'GET' && req.url.endsWith('/userpics')) {
        const files = fs.readdirSync(path.join(__dirname, '/public/data/users'));
        res.json(files);
        req.body = files
      } else if (req.method === 'GET' && req.url.endsWith('/allimages')) {
        const files = fs.readdirSync(path.join(__dirname, '/public/data/images/256'));
        res.json(files);
        req.body = files
      } else {
        next();
      }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const mandatory_non_empty_fields_user = ['firstname', 'lastname', 'email', 'avatar']
const mandatory_non_empty_fields_article = ['user_id', 'title', 'body', 'date']
const mandatory_non_empty_fields_comment = ['user_id', 'article_id', 'body', 'date']

function is_valid(body, mandatory_non_empty_fields) {
  for (let index = 0; index < mandatory_non_empty_fields.length; index++) {
    const element = mandatory_non_empty_fields[index];
    if (body[element] === undefined || body[element] === "" || body[element]?.length === 0) {
      return false;
    }
  }
  return true;
}

const validateEmail = (email) => {
  return email.match(
    /^\S+@\S+\.\S+$/
  );
};

function formatErrorResponse(message, details = undefined) {
  return {error: {message: message, details: details}}
}

const validations = (req, res, next) => {
  try {
    if (req.method === 'POST' && req.url.endsWith('/api/users')) {
      // validate fields:
      if (!is_valid(req.body, mandatory_non_empty_fields_user)) {
        res.status(422).send(formatErrorResponse("One of mandatory field is invalid", mandatory_non_empty_fields_user));
        return
      }
      // validate email:
      if (!validateEmail(req.body['email'])) {
        res.status(422).send(formatErrorResponse("Invalid email"));
        return
      }
      const dbData = fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8');
      if (dbData.includes(req.body['email'])) {
        res.status(409).send(formatErrorResponse("Email not unique"));
        return
      }
    }
    if (req.method === 'POST' && req.url.endsWith('/api/comments')) {
      if (!is_valid(req.body, mandatory_non_empty_fields_comment)) {
        res.status(422).send(formatErrorResponse("One of mandatory field is invalid", mandatory_non_empty_fields_comment));
        return
      }
    }
    if (req.method === 'POST' && req.url.endsWith('/api/articles')) {
      if (!is_valid(req.body, mandatory_non_empty_fields_article)) {
        res.status(422).send(formatErrorResponse("One of mandatory field is invalid", mandatory_non_empty_fields_article));
        return
      }
    }
    next();
  } catch (error) {
    console.log(error);
    res.json(formatErrorResponse("Fatal error. Please contact administrator."));
    res.sendStatus(500);
  }
}

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3000;

server.use(middlewares);
server.use(customRoutes);
server.use(jsonServer.bodyParser);
server.use(validations);
server.use('/api', router);

server.listen(port, () => {
  console.log(`Test Custom Data API listening on port ${port}!`)
});
