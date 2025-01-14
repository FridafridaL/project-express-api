import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start

console.log(avocadoSalesData.length);

const port = process.env.PORT || 8080;
const app = express();

const listEndpoints = require("express-list-endpoints");

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});

// Get all avocado data
app.get("/avocadoData", (req, res) => {
  res.json(avocadoSalesData);
  res.status(501).send("Not Implemented");
});

// Get avocado data by price
app.get("/price/:price", (req, res) => {
  const price = req.params.price;
  console.log({ price });
  const showRegion = req.query.region;
  //filter gives back multiple "answers" when filtering through the array
  let averagePrice = avocadoSalesData.filter(
    (item) => item.averagePrice === +price
  );

  if (showRegion) {
    averagePrice = averagePrice.filter(
      (item) =>
        item.region.toLocaleLowerCase() === showRegion.toLocaleLowerCase()
    );
  }
  //error return if price in endpoint don't match
  if (averagePrice.length === 0) {
    res.status(404).send("Sorry, no avocados matched this");
  } else {
    res.json(averagePrice);
  }
});

//destrucured endpoint, find will give you back only one data from the array
app.get("/avocadoData/:avocadoId", (req, res) => {
  const { avocadoId } = req.params;
  const avocado = avocadoSalesData.find((avocado) => avocado.id === +avocadoId);
  console.log("avocadoID:", avocadoId, typeof avocadoId);

  if (avocado) {
    res.json(avocado);
  } else {
    res.status(404).send("Sorry, this avocado was not found");
  }
});

// Get avocado data by total volume
app.get("/totalVolume/:volume", (req, res) => {
  const volume = parseFloat(req.params.volume); // parseFloat because it's a number, could be used instead of + on volume in line 77 aswell
  console.log({ volume });

  // filter based on the total volume
  const avocadosWithVolume = avocadoSalesData.filter(
    (item) => item.totalVolume === volume
  );

  if (avocadosWithVolume.length === 0) {
    res
      .status(404)
      .send("Sorry, no avocados found with the specified total volume");
  } else {
    res.json(avocadosWithVolume);
  }
});

// Get the top-selling region
app.get("/topSellingRegion", (req, res) => {
  const regions = [
    ...new Set(avocadoSalesData.map((avocado) => avocado.region)),
  ];
  let topSellingRegion = "";
  let maxTotalBagsSold = 0;

  regions.forEach((region) => {
    const totalBagsSoldInRegion = avocadoSalesData
      .filter((avocado) => avocado.region === region)
      .reduce((sum, avocado) => sum + avocado.totalBagsSold, 0);

    if (totalBagsSoldInRegion > maxTotalBagsSold) {
      maxTotalBagsSold = totalBagsSoldInRegion;
      topSellingRegion = region;
    }
  });

  res.json({ topSellingRegion });
});

// Get the average price of avocados in a specific region
app.get("/averagePrice/:region", (req, res) => {
  const region = req.params.region.toLowerCase();
  const avocadosInRegion = avocadoSalesData.filter(
    (avocado) => avocado.region.toLowerCase() === region
  );

  if (avocadosInRegion.length === 0) {
    res.status(404).send("Sorry, no avocados found for this region");
  } else {
    const averagePrice =
      avocadosInRegion.reduce((sum, avocado) => sum + avocado.averagePrice, 0) /
      avocadosInRegion.length;
    res.json({ averagePrice });
  }
});

// Get the total number of avocados sold
app.get("/totalAvocadoCount", (req, res) => {
  const totalAvocadoCount = avocadoSalesData.reduce(
    (sum, avocado) => sum + avocado.totalBagsSold,
    0
  );
  res.json({ totalAvocadoCount });
});

//dummys/empty endpoints
app.get("/totalSmallBagsSold", (req, res) => {
  res.status(501).send("Not Implemented");
});

app.get("/totalLargeBagsSold", (req, res) => {
  res.status(501).send("Not Implemented");
});

app.get("/totalXlargeBagsSold", (req, res) => {
  res.status(501).send("Not Implemented");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
