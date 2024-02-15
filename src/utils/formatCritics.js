const lodash = require("lodash");

const formatCritics = (data) => {
  if (!data) return data;

  const mapData = (item) => 
    Object.entries(item).reduce((accumulator, [key, value]) => {
      return lodash.set(accumulator, key, value);
    }, {});

  return Array.isArray(data) ? data.map(mapData) : mapData(data);
};

module.exports = formatCritics;