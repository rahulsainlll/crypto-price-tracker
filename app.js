const express = require("express");
const postgres = require("postgres");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = 3000;

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

const sql = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: "require",
  connection: {
    options: `project=${ENDPOINT_ID}`,
  },
});

async function createTable() {
  await sql`DROP TABLE IF EXISTS tickers`;
  await sql`
    CREATE TABLE IF NOT EXISTS tickers (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      last TEXT NOT NULL,
      buy TEXT NOT NULL,
      sell TEXT NOT NULL,
      volume TEXT NOT NULL,
      base_unit TEXT NOT NULL,
      quote_unit TEXT NOT NULL
    );
  `;
}

async function fetchAndStoreData() {
  try {
    const response = await axios.get("https://api.wazirx.com/api/v2/tickers");
    const tickers = response.data;
    const top10Tickers = Object.values(tickers).slice(0, 10);

    for (let ticker of top10Tickers) {
      const { name, last, buy, sell, volume, base_unit, quote_unit } = ticker;
      await sql`
        INSERT INTO tickers (name, last, buy, sell, volume, base_unit, quote_unit)
        VALUES (${name}, ${last}, ${buy}, ${sell}, ${volume}, ${base_unit}, ${quote_unit})
      `;
    }

    console.log("Data stored successfully");
  } catch (error) {
    console.error("Error fetching or storing data:", error);
  }
}

app.get("/api/tickers", async (req, res) => {
  const { base_unit = "btc", quote_unit = "inr" } = req.query;
  try {
    const result = await sql`
      SELECT * FROM tickers
      WHERE base_unit = ${base_unit} AND quote_unit = ${quote_unit}
      LIMIT 5
    `;
    const processedResult = result.map((ticker) => {
      const buyPrice = parseFloat(ticker.buy);
      const sellPrice = parseFloat(ticker.sell);
      const lastPrice = parseFloat(ticker.last);
      const avgNetPrice = (buyPrice + sellPrice) / 2;
      const difference = lastPrice - avgNetPrice;
      const savings = ((sellPrice - buyPrice) / buyPrice) * 100;

      return {
        ...ticker,
        avgNetPrice: avgNetPrice.toFixed(2),
        difference: difference.toFixed(2),
        savings: savings.toFixed(2),
      };
    });

    res.json(processedResult);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Server error");
  }
});

app.use(express.static("public"));

async function startServer() {
  await createTable();
  await fetchAndStoreData();
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer();
