const app = require("./src");
const db = require("./src/modules/common/db");
const port = 4000;

// INIT:
// db.initDBConnection();

app.listen(port, () => {
  console.log(`ExpressApp listening at http://localhost:${port}`);
});
