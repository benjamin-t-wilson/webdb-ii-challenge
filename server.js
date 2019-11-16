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

// I AM THE KEEPER
// OF THE MIDDLEWARE
// STATE YOUR BUSINESS

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
        ? body.mileage // fourth check, runs next middleware or 400
          ? next()
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
