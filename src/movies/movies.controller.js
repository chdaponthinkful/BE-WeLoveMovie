// Importing services and middleware directly.
const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// Verifies if a movie is available by its ID.
async function verifyMovieAvailability(req, res, next) {
  const { movieId } = req.params; // Destructuring for cleaner code.
  const movie = await moviesService.read(movieId);

  if (movie) {
    res.locals.movie = movie;
    return next(); // Explicitly using return to ensure middleware stops here on success.
  } else {
    return next({ status: 404, message: `No movie found with ID: ${movieId}.` });
  }
}

// Lists movies based on query parameter "is_showing".
const list = async (req, res) => {
  const data = await moviesService.list(req.query.is_showing);
  res.json({ data });
};

// Reads movie data stored in res.locals by previous middleware.
const read = async (req, res) => {
  res.json({ data: res.locals.movie });
};

// Reads theaters associated with a movie by its ID.
const readTheatersByMovieId = async (req, res) => {
  const data = await moviesService.listTheatersByMovieId(Number(req.params.movieId)); // Using Number() for clarity.
  res.json({ data });
};

// Reads reviews associated with a movie by its ID.
const readReviewsByMovieId = async (req, res) => {
  const data = await moviesService.listReviewsByMovieId(Number(req.params.movieId)); // Using Number() for clarity.
  res.json({ data });
};

// Exporting middleware and route handlers with asyncErrorBoundary where applicable.
module.exports = {
  list: asyncErrorBoundary(list),
  read: [verifyMovieAvailability, read],
  readTheatersByMovieId: [verifyMovieAvailability, asyncErrorBoundary(readTheatersByMovieId)],
  readReviewsByMovieId: [verifyMovieAvailability, asyncErrorBoundary(readReviewsByMovieId)],
};