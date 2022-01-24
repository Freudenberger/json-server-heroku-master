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

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3000;

server.use(middlewares);
server.use(customRoutes);
server.use('/api', router);

server.listen(port, () => {
    console.log(`Test Custom Data API listening on port ${port}!`)
});
