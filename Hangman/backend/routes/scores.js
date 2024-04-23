const express = require("express");
const scoreRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

//guess letters
scoreRoutes.route("/guess/:id").post(async function (req, res) {
  // body has guessed letter as "guess"
  try {
    const db_connect = await dbo.getDb();
    const myquery = { _id: new ObjectId(req.params.id) };
    const start = await db_connect.collection("HighScore").findOne(myquery);
    const incr = start.guesses;

    let indexes = [];
    for (let i = 0; i < start.length; i++){
      if(req.body.guess.toLowerCase() == start.word[i]){
        indexes.push(i);
      }
    }
    if (indexes.length === 0){
      indexes.push(-1);
    }

    const newvalues = {
      $set: {
        name: start.name,
        word: start.word,
        length: start.length,
        guesses: incr + 1,
      },
    };
    let result = await db_connect.collection("HighScore").updateOne(myquery, newvalues);
    result = { ...result, indexes: indexes };
    res.json(result);
    // returns array with the positions in the word that the letter appears as "indexes". -1 if none
  } catch (err) {
    throw err;
  }
});

// create new player
scoreRoutes.route("/score/new").post(async function (req, res) {
  //body contains the new players name as "name"
  try {
    const db_connect = await dbo.getDb();
    const rando = await db_connect.collection("Dictionary").aggregate([{ $sample: { size: 1 } }]).toArray().then(data => data);
    const myobj = {
      name: req.body.name,
      word: rando[0].word,
      length: rando[0].length,
      guesses: 0,
    };
    let result = await db_connect.collection("HighScore").insertOne(myobj);
    console.log("1 new player added");
    result = { ...result, length: rando[0].length };
    //returns new record id and length of the word
    res.json(result);
  } catch (err) {
    throw err;
  }
});

scoreRoutes.route("/word/:id").get(async function (req, res) {
  try {
    const db_connect = await dbo.getDb();
    const myquery = { _id: new ObjectId(req.params.id) };
    const result = await db_connect.collection("HighScore").findOne(myquery);
    const r = {
      word: result.word,
    }
    res.json(r);
  } catch (err) {
    throw err;
  }
});

scoreRoutes.route("/HighScores/:length").get(async function (req, res) {
  try {
    const db_connect = await dbo.getDb();
    const myquery = { length: parseInt(req.params.length) };
    console.log(myquery)
    const result = await db_connect.collection("HighScore").find(myquery).toArray();
    console.log(result);
    res.json(result);
  } catch (err) {
    throw err;
  }
});

//
//
//    generic APIs
//
//

// This section will help you get a list of all the scores.
scoreRoutes.route("/score").get(async function (req, res) {
  try {
    const db_connect = await dbo.getDb();
    const result = await db_connect.collection("HighScore").find({}).toArray();
    res.json(result);
  } catch (err) {
    throw err;
  }
});

// This section will help you get a single score by id
scoreRoutes.route("/score/:id").get(async function (req, res) {
  try {
    const db_connect = await dbo.getDb();
    const myquery = { _id: new ObjectId(req.params.id) };
    const result = await db_connect.collection("HighScore").findOne(myquery);
    const r = {
      length: result.length,
      guesses: result.guesses
    }
    res.json(r);
  } catch (err) {
    throw err;
  }
});

// This section will help you create a new score.
scoreRoutes.route("/score/add").post(async function (req, res) {
  try {
    const db_connect = await dbo.getDb();
    const myobj = {
      name: req.body.name,
      number: req.body.number,
      guesses: req.body.guesses,
    };
    const result = await db_connect.collection("HighScore").insertOne(myobj);
    console.log("1 document added");
    res.json(result);
  } catch (err) {
    throw err;
  }
});
 
// This section will help you update a score by id.
scoreRoutes.route("/update/:id").post(async function (req, res) {
  try {
    const db_connect = await dbo.getDb();
    const myquery = { _id: new ObjectId(req.params.id) };
    const newvalues = {
      $set: {
        name: req.body.name,
        number: req.body.number,
        guesses: req.body.guesses,
      },
    };
    const result = await db_connect.collection("HighScore").updateOne(myquery, newvalues);
    console.log("1 document updated");
    res.json(result);
  } catch (err) {
    throw err;
  }
});
 
// This section will help you delete a score
scoreRoutes.route("/:id").delete(async function (req, res) {
  try {
    const db_connect = await dbo.getDb();
    const myquery = { _id: new ObjectId(req.params.id) };
    const result = await db_connect.collection("HighScore").deleteOne(myquery);
    console.log("1 document deleted");
    res.json(result);
  } catch (err) {
    throw err;
  }
});

module.exports = scoreRoutes;