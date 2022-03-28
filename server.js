const jsonServer = require('./json-server');
const fs = require('fs');
const path = require('path');

let updatedSchema = false;

const customRoutes = (req, res, next) => {
  try {
    if (!updatedSchema) {
      try {
        console.log(req.headers)
        const host = req.headers.host;
        const referer = req.headers.referer;
        const schema = JSON.parse(fs.readFileSync(path.join(__dirname, 'public/tools/schema/openapi_rest_demo.json'), 'utf8'));
        if (referer !== undefined) {
          const newAddr = `${referer.split(':')[0]}://${host}/api`;
          if (newAddr !== schema['servers'][0]['url']) {
            schema['servers'][0]['url'] = newAddr;
            fs.writeFileSync(path.join(__dirname, 'public/tools/schema/openapi_rest_demo.json'), JSON.stringify(schema, null, 2));
          }
          updatedSchema = true;
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (req.method === 'GET' && req.url.endsWith('/restoreDB')) {
      const db = JSON.parse(fs.readFileSync(path.join(__dirname, 'db-base.json'), 'utf8'));
      router.db.setState(db);
      console.log('restoreDB successful');
      res.status(201).send({ message: "Database successfully restored" });
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
    res.status(500).send(formatErrorResponse("Fatal error. Please contact administrator."));
  }
};

const mandatory_non_empty_fields_user = ['firstname', 'lastname', 'email', 'avatar']
const all_fields_user = ['firstname', 'lastname', 'email', 'avatar', "password"]
const mandatory_non_empty_fields_article = ['user_id', 'title', 'body', 'date']
const all_fields_article = ['user_id', 'title', 'body', 'date', 'image']
const mandatory_non_empty_fields_comment = ['user_id', 'article_id', 'body', 'date']
const all_fields_comment = ['user_id', 'article_id', 'body', 'date']
const all_fields_plugin = ["name", "status", "version"]
const plugin_statuses = ["on", "off", "obsolete"]

function is_plugin_status_valid(body) {
  if (plugin_statuses.findIndex(body[element]) === -1) {
    return false
  }
  return true
}

function are_mandatory_fields_valid(body, mandatory_non_empty_fields) {
  for (let index = 0; index < mandatory_non_empty_fields.length; index++) {
    const element = mandatory_non_empty_fields[index];
    if (body[element] === undefined || body[element] === "" || body[element]?.length === 0) {
      return false;
    }
  }
  return true;
}

function are_all_fields_valid(body, all_possible_fields, max_field_length = 10000) {
  const keys = Object.keys(body);
  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    if (!all_possible_fields.includes(key)) {
      return false
    }
    const element = body[keys];
    if (element?.toString().length > max_field_length) {
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

function formatErrorResponse(message, details = undefined, id = undefined) {
  return { error: { message: message, details: details }, id }
}

const validations = (req, res, next) => {
  try {
    if ((req.url.endsWith('/api/users') || req.url.endsWith('/api/comments') || req.url.endsWith('/api/articles')) && req.body?.length > 0) {
      try {
        JSON.parse(req.body)
      } catch (error) {
        console.log(error);
        res.status(400).send(formatErrorResponse("Bad request - malformed JSON"));
        return
      }
    }

    const urlEnds = req.url.replace(/\/\/+/g, '/')

    if (req.method === 'POST' && urlEnds.endsWith('/api/users')) {
      // validate mandatory fields:
      if (!are_mandatory_fields_valid(req.body, mandatory_non_empty_fields_user)) {
        res.status(422).send(formatErrorResponse("One of mandatory field is missing", mandatory_non_empty_fields_user));
        return
      }
      // validate email:
      if (!validateEmail(req.body['email'])) {
        res.status(422).send(formatErrorResponse("Invalid email"));
        return
      }
      // validate all fields:
      if (!are_all_fields_valid(req.body, all_fields_user)) {
        res.status(422).send(formatErrorResponse("One of field is invalid (empty, invalid or too long) or there are some additional fields", all_fields_user));
        return
      }
      const dbData = fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8');
      console.log(req.body['email'], dbData.includes(req.body['email']))
      if (dbData.includes(req.body['email'])) {
        res.status(409).send(formatErrorResponse("Email not unique"));
        return
      }
    }
    if (req.method === 'PUT' && urlEnds.includes('/api/users/')) {
      const urlParts = urlEnds.split('/')
      const userId = urlParts[urlParts.length - 1]
      console.log(userId)
      // validate mandatory fields:
      if (!are_mandatory_fields_valid(req.body, mandatory_non_empty_fields_user)) {
        res.status(422).send(formatErrorResponse("One of mandatory field is missing", mandatory_non_empty_fields_user));
        return
      }
      // validate all fields:
      if (!are_all_fields_valid(req.body, all_fields_user)) {
        res.status(422).send(formatErrorResponse("One of field is invalid (empty, invalid or too long) or there are some additional fields", all_fields_user));
        return
      }
      const dbData = fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8');
      const dbDataJson = JSON.parse(dbData)
      const foundMail = dbDataJson['users'].find(user => {
        if (user['id']?.toString() !== userId?.toString() && user['email'] === req.body['email']) {
          return user
        }
      })
      if (foundMail !== undefined) {
        res.status(409).send(formatErrorResponse("Email not unique"));
        return
      }
    }
    if (req.method === 'PATCH' && urlEnds.includes('/api/users')) {
      // validate all fields:
      if (!are_all_fields_valid(req.body, all_fields_user)) {
        res.status(422).send(formatErrorResponse("One of field is invalid (empty, invalid or too long) or there are some additional fields", all_fields_user));
        return
      }
    }
    if (req.method === 'POST' && urlEnds.endsWith('/api/comments')) {
      if (!are_mandatory_fields_valid(req.body, mandatory_non_empty_fields_comment)) {
        res.status(422).send(formatErrorResponse("One of mandatory field is missing", mandatory_non_empty_fields_comment));
        return
      }
      // validate all fields:
      if (!are_all_fields_valid(req.body, all_fields_comment)) {
        res.status(422).send(formatErrorResponse("One of field is invalid (empty, invalid or too long) or there are some additional fields", all_fields_comment));
        return
      }
    }
    if (req.method !== 'GET' && urlEnds.endsWith('/api/plugins')) {
      console.log(req.headers)
      const authorization = req.headers['Authorization']
      if (authorization !== 'Basic dXNlcjpwYXNz') { // user:pass
        res.status(403).send(formatErrorResponse("Invalid authorization"));
        return
      }
      // validate fields:
      if (!are_all_fields_valid(req.body, all_fields_plugin)) {
        res.status(422).send(formatErrorResponse("One of field is invalid (empty, invalid or too long) or there are some additional fields", all_fields_plugin));
        return
      }
      if (!is_plugin_status_valid(req.body)) {
        res.status(422).send(formatErrorResponse("Plugin status is invalid", plugin_statuses));
        return
      }
    }
    if (req.method === 'GET' && urlEnds.endsWith('/api/plugins')) {
      console.log(req.headers)
      const authorization = req.headers['Authorization']
      if (authorization !== 'Bearer SecretToken') {
        res.status(403).send(formatErrorResponse("Invalid token"));
        return
      }
    }
    if (req.method === 'POST' && urlEnds.endsWith('/api/articles')) {
      if (!are_mandatory_fields_valid(req.body, mandatory_non_empty_fields_article)) {
        res.status(422).send(formatErrorResponse("One of mandatory field is missing", mandatory_non_empty_fields_article));
        return
      }
      // validate all fields:
      if (!are_all_fields_valid(req.body, all_fields_article)) {
        res.status(422).send(formatErrorResponse("One of field is invalid (empty, invalid or too long) or there are some additional fields", all_fields_article));
        return
      }
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send(formatErrorResponse("Fatal error. Please contact administrator."));
  }
}

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3000;

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(customRoutes);
server.use(validations);
server.use('/api', router);

server.listen(port, () => {
  console.log(`Test Custom Data API listening on port ${port}!`)
  // const schema = JSON.parse(fs.readFileSync(path.join(__dirname, 'public/tools/schema/openapi_rest_demo.json'), 'utf8'));
  // schema['servers'][0]['url'] = pathToSchema
  // fs.writeFileSync(path.join(__dirname, 'public/tools/schema/openapi_rest_demo.json'), JSON.stringify(schema))
});

