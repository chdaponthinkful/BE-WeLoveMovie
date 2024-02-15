const knex = require("../db/connection");

// Retrieves all theaters with their associated movies.
const getAllTheaters = () => {
  return knex("theaters as t")
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .join("movies as m", "m.movie_id", "mt.movie_id")
    .select("t.*", "m.movie_id", "m.title", "m.runtime_in_minutes", "m.rating", "m.description", "m.image_url", "mt.is_showing")
    .then(data => data.reduce((acc, item) => {
      let theater = acc.find(t => t.theater_id === item.theater_id);

      if (!theater) {
        theater = {
          theater_id: item.theater_id,
          name: item.name,
          address_line_1: item.address_line_1,
          address_line_2: item.address_line_2,
          city: item.city,
          state: item.state,
          zip: item.zip,
          movies: [],
        };
        acc.push(theater);
      }

      theater.movies.push({
        movie_id: item.movie_id,
        title: item.title,
        runtime_in_minutes: item.runtime_in_minutes,
        rating: item.rating,
        description: item.description,
        image_url: item.image_url,
        is_showing: item.is_showing,
        theater_id: item.theater_id, // Consider removing if not needed as theater context is already established.
      });

      return acc;
    }, []));
};

module.exports = {
  list: getAllTheaters,
};