const jsonServer = require("./json-server");
const { validations } = require("./validators");
const fs = require("fs");

let updatedSchema = false;

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const path = require("path");
const { pluginStatuses, formatErrorResponse } = require("./consts");
const { logDebug } = require("./loggerApi");
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3000;

const customRoutes = (req, res, next) => {
  try {
    if (!updatedSchema) {
      try {
        const host = req.headers.host;
        const referer = req.headers.referer;
        const schema = JSON.parse(
          fs.readFileSync(
            path.join(__dirname, "public/tools/schema/openapi_rest_demo.json"),
            "utf8"
          )
        );
        if (referer !== undefined) {
          const newAddr = `${referer.split(":")[0]}://${host}/api`;
          if (newAddr !== schema["servers"][0]["url"]) {
            schema["servers"][0]["url"] = newAddr;
            fs.writeFileSync(
              path.join(
                __dirname,
                "public/tools/schema/openapi_rest_demo.json"
              ),
              JSON.stringify(schema, null, 2)
            );
          }
          updatedSchema = true;
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (req.method === "GET" && req.url.endsWith("/restoreDB")) {
      const db = JSON.parse(
        fs.readFileSync(path.join(__dirname, "db-base.json"), "utf8")
      );
      router.db.setState(db);
      logDebug("restoreDB successful");
      res.status(201).send({ message: "Database successfully restored" });
    } else if (req.method === "GET" && req.url.endsWith("/db")) {
      const dbData = JSON.parse(
        fs.readFileSync(path.join(__dirname, "db.json"), "utf8")
      );
      res.json(dbData);
      req.body = dbData;
    } else if (req.method === "GET" && req.url.endsWith("/userpics")) {
      const files = fs.readdirSync(path.join(__dirname, "/public/data/users"));
      res.json(files);
      req.body = files;
    } else if (req.method === "GET" && req.url.endsWith("/allimages")) {
      const files = fs.readdirSync(
        path.join(__dirname, "/public/data/images/256")
      );
      res.json(files);
      req.body = files;
    } else if (req.method === "GET" && req.url.endsWith("/pluginstatuses")) {
      res.json(pluginStatuses);
      req.body = pluginStatuses;
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send(formatErrorResponse("Fatal error. Please contact administrator."));
  }
};

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(customRoutes);
server.use(validations);
server.use("/api", router);

server.listen(port, () => {
  logDebug(`Test Custom Data API listening on port ${port}!`);
});
