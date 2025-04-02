const express = require("express");
const router = express.Router();
const Genre = require("../models/genre");

router.get("/", (req, res) => {
  res.render("genres/index", {
    title: "BookedIn || Genres",
    genres: Genre.all,
  });
});

router.get("/form", (req, res) => {
  res.render("genres/form", {
    title: "BookedIn || Genres",
    genre: {},
  });
});

router.post("/upsert", (req, res) => {
  Genre.upsert(req.body);
  res.redirect(303, "/genres");
});

router.get("/edit", (req, res) => {
  let genreIndex = parseInt(req.query.id);
  let genre = Genre.get(genreIndex);
  genre.id = genreIndex;
  
  res.render("genres/form", {
    title: "BookedIn || Genres",
    genre,
    genreIndex,
  });
});

router.get("/show/:id", (req, res) => {
  const genre = Genre.get(req.params.id);
  
  var templateVars = {
    title: "BookedIn || Genre Details",
    genre: genre,
  };
  
  res.render("genres/show", templateVars);
});

module.exports = router;
