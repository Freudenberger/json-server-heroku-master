const jsonServer = require('./json-server');
const { customRoutes, validations } = require('./validators');


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
});

