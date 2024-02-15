const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const theatersService = require("./theaters.service");

// Lists all theaters with their associated movies.
async function list(req, res) {
  const data = await theatersService.list();
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
};