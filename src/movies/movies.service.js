const knex = require("../db/connection");
const formatCriticData = require("../utils/formatCritics");

// Decides whether to list all movies or only those that are showing.
const list = (isShowing) => isShowing === "true" ? listOnlyShowing() : listAll();

// Retrieves all movies.
const listAll = () => knex("movies").select("*");

// Retrieves only movies that are currently showing in theaters.
const listOnlyShowing = () => knex("movies as m")
  .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
  .select("m.movie_id", "m.title", "m.runtime_in_minutes", "m.rating", "m.description", "m.image_url") // Added table alias prefix for consistency.
  .where({"mt.is_showing": true})
  .groupBy("m.movie_id");

// Reads details of a single movie by its ID.
const read = (movieId) => knex("movies")
  .select("*")
  .where({ movie_id: movieId })
  .first();

// Lists all theaters where the movie is currently showing.
const listTheatersByMovieId = (movieId) => knex("theaters as t")
  .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
  .where({ "mt.movie_id": movieId })
  .select("*");

// Lists all reviews for a movie, including critic details, and formats the critic data.
const listReviewsByMovieId = (movieId) => knex("reviews as r")
  .join("critics as c", "r.critic_id", "c.critic_id")
  .where({ "r.movie_id": movieId })
  .select(
    "r.*",
    "c.critic_id as critic.critic_id",
    "c.preferred_name as critic.preferred_name",
    "c.surname as critic.surname",
    "c.organization_name as critic.organization_name"
  )
  .then(reviews => reviews.map(formatCriticData)); // Explicitly mapping the formatting function for clarity.

module.exports = {
  list,
  read,
  listTheatersByMovieId,
  listReviewsByMovieId,
};