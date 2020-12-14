require("dotenv").config();
const db = require("../src/modules/common/db");
const Stock = require("../src/modules/stock/schema/Stock");

async function createSampleData() {
  let stock1 = new Stock({ stockId: "SS1", name: "Stock 1" });
  let stock2 = new Stock({ stockId: "SS2", name: "Stock 2" });
  let stock3 = new Stock({ stockId: "SS3", name: "Stock 3" });
  return Stock.create([stock1, stock2, stock3]);
}

async function main() {
  try {
    await db.initDBConnection();
    await createSampleData();
  } catch (err) {
    console.error(err);
  }
}

main();
