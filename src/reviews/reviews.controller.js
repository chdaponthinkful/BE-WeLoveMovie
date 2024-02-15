const reviewsService = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// Checks if the review exists in the database.
const checkReviewExist = async (req, res, next) => {
  const reviewId = Number(req.params.reviewId); // Coerces reviewId to a number for consistency.
  const foundReview = await reviewsService.read(reviewId);

  if (foundReview) {
    res.locals.review = foundReview; // Stores the found review in the response locals.
    return next(); // Proceeds to the next middleware.
  } else {
    return next({
      status: 404,
      message: `Review cannot be found for id: ${reviewId}`,
    });
  }
};

// Deletes a review based on its ID.
const destroy = async (req, res) => { // Removed unnecessary 'next' parameter.
  await reviewsService.destroy(Number(req.params.reviewId)); // Ensures reviewId is a number.
  res.sendStatus(204); // Sends a No Content status.
};

// Updates a review with provided details.
const update = async (req, res) => { // Removed unnecessary 'next' parameter.
  const originalReview = res.locals.review;
  const reviewUpdates = req.body.data;

  const revisedReview = { ...originalReview, ...reviewUpdates };

  await reviewsService.update(revisedReview); // Updates the review.
  const updatedReviewDetails = await reviewsService.read(revisedReview.review_id); // Fetches updated details.
  updatedReviewDetails.critic = await reviewsService.getCriticById(revisedReview.critic_id); // Attaches critic details.

  res.json({ data: updatedReviewDetails }); // Responds with the updated review details.
};

module.exports = {
  update: [asyncErrorBoundary(checkReviewExist), asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(checkReviewExist), asyncErrorBoundary(destroy)], // Ensures proper error handling.
};