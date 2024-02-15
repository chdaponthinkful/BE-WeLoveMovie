const knex = require("../db/connection");
const formatCriticData = require("../utils/formatCritics");

// Updates a review and returns the updated record.
const update = (newReview) => knex("reviews")
  .where({ review_id: newReview.review_id })
  .update(newReview, "*")
  .then(rows => rows[0]); // Simplified to directly return the first item of the result.

// Retrieves a review by its ID.
const read = (reviewId) => knex("reviews")
  .select("*")
  .where({ review_id: reviewId })
  .first(); // Directly returns the first matching review.

// Fetches a critic's details by their ID.
const getCriticById = (criticId) => knex("critics")
  .select("*")
  .where({ critic_id: criticId })
  .first(); // Directly returns the first matching critic.

// Deletes a review by its ID.
const destroy = (reviewId) => knex("reviews")
  .where({ review_id: reviewId })
  .del(); // Deletes the specified review.

module.exports = {
  update,
  read,
  getCriticById,
  destroy,
};