const jsonServer = require('./json-server');
const fs = require('fs');
const path = require('path');

const reloadDB = (req, res, next) => {
  try {
      if ((req.method === 'POST' && req.url.endsWith('/reloadDB')) ||
        (req.method === 'GET' && req.url.endsWith('/force/reloadDB'))) {
        const db = JSON.parse(fs.readFileSync(path.join(__dirname, 'db-base.json'), 'utf8'));
        router.db.setState(db);
        console.log('reloadDB successful');
        res.sendStatus(201);
      } else {
        next();
      }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
const dbRoute = (req, res, next) => {
  try {
      if (req.method === 'GET' && req.url.endsWith('/db')) {
        const dbData = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8'));
        res.json(dbData);
        req.body = dbData
      } else {
        next();
      }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3000;

server.use(middlewares);
server.use(reloadDB);
server.use(dbRoute);
server.use('/api', router);

server.listen(port, () => {
    console.log(`Test Custom Data API listening on port ${port}!`)
});
