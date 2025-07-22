const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults({ readOnly: true });

// Lista de origens permitidas
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://cbloldle.vercel.app"
];

// Middleware para configurar CORS (antes do router)
server.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

server.use(middlewares);

// Reescreve rotas
server.use(
  jsonServer.rewriter({
    "/*": "/$1",
  })
);

// Rotas do JSON Server
server.use(router);

// Força CORS também **depois do router**
server.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

server.listen(3000, () => {
  console.log("JSON Server is running");
});

module.exports = server;
