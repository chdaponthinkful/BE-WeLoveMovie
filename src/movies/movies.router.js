const express = require("express");
const router = express.Router(); 
const controller = require("./movies.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router.route("/").get(controller.list).all(methodNotAllowed);

router.route("/:movieId")
  .get(controller.read)
  .all(methodNotAllowed); 

["/reviews", "/theaters"].forEach(path => {
  router.route(`/:movieId${path}`)
    .get(controller[`read${path.charAt(1).toUpperCase() + path.slice(2)}ByMovieId`]) 
    .all(methodNotAllowed);
});

module.exports = router;