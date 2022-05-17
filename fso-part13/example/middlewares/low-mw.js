require("colors");

const s = (v) => JSON.stringify(v, null, 2);
const l = console.log;
const logMw = (req, _, next) => {
  l(
    `@@@${req.method.bgGreen} @${req.path} @query: ${
      s(req.query).magenta
    } @params: ${s(req.params).magenta} @body:${s(req.body).magenta} `
  );
  next();
};

module.exports = logMw;
