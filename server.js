const express = require("express");

const db = require("./data/dbConfig.js");

const server = express();

server.use(express.json());

server.get("/api/cars", (req, res) => {
  db.select("*")
    .from("cars")
    .then(cars => {
      res.status(200).json(cars);
    })
    .catch(err => {
      res.status(500).json({ message: "Error retrieving cars data" });
    });
});

server.post("/api/cars", validateBody, validateCarKeys, (req, res) => {
  const body = req.body;

  db.insert(body)
    .into("cars")
    .then(car => {
      res.status(201).json(car);
    })
    .catch(err => {
      res.status(500).json({ message: "Error adding new car to server." });
    });
});

server.get("/api/cars/:id", validateID, (req, res) => {
  const id = req.params.id;

  db.select("*")
    .from("cars")
    .where({ id })
    .then(car => {
      res.status(200).json(car);
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: `Error retrieving car with ID of "${id}"` });
    });
});

// I AM THE KEEPER
// OF THE MIDDLEWARE
// STATE YOUR BUSINESS

function validateID(req, res, next) {
  const id = req.params.id;

  db.select("*")
    .from("cars")
    .where({ id })
    .then(car => {
      car[0]
        ? next()
        : res.status(404).json({ message: `Car with ID of "${id}" not found` });
    });
}

function validateBody(req, res, next) {
  const body = req.body;

  Object.keys(body).length > 0
    ? next()
    : res.status(400).json({ message: "Request missing body" });
}

function validateCarKeys(req, res, next) {
  const body = req.body;

  // this may get messy, I'd like to check one key at a time
  // and then tell them which key specifically they are missing

  //keys required: vin, make, model, mileage
  body.vin // checks if vin key is present, if true, checks next key, if false, returns status 400
    ? body.make // second check. If true, checks next key, else returns status 400
      ? body.model // third check, checks next, or 400
        ? body.mileage // fourth check, checks to make sure it's a number or 400
          ? typeof body.mileage === "number" // checks to make sure mileage is a number
            ? next()
            : res
                .status(400)
                .json({ message: "Mileage key needs to be a number" })
          : res.status(400).json({
              message:
                "Request body missing key of 'mileage'. Key is required & is an integer"
            }) // closes mileage check
        : res.status(400).json({
            message: "Request body missing key of 'model'. Key is required"
          }) // closes model check
      : res.status(400).json({
          message: "Request body missing key of 'make'. Key is required"
        }) // closes make check
    : res.status(400).json({
        message: "Request body missing key of 'vin'. Key is required & unique"
      }); // closes vin check
}

module.exports = server;
