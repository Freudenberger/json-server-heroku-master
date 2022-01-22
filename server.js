const jsonServer = require('./json-server');
const fs = require('fs');
const path = require('path');

const reloadDB = (req, res, next) => {
  console.log('reloadDB');
  try {
      if ((req.method === 'POST' && req.url.endsWith('/reloadDB')) ||
        (req.method === 'GET' && req.url.endsWith('/force/reloadDB'))) {
        const db = JSON.parse(fs.readFileSync(path.join(__dirname, 'db-base.json'), 'utf8'));
        router.db.setState(db);
        console.log('reloadDB successful');
        res.sendStatus(201);
      } else {
        console.log('Invalid method for reloadDB');
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
server.use('/api', router);

server.listen(port, () => {
    console.log(`Test Custom Data API listening on port ${port}!`)
});
