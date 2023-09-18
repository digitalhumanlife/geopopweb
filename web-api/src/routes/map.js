const express = require('express');

const { getPolygonContainPoint, getSupportedPolygons } = require('../services/map');

const app = express();

app.get('/supported-polygons', (req, res) => {
  const result = getSupportedPolygons([req.query.lat, req.query.lng]);
  res.json({
    success: result !== null,
    data: result,
  });
});

app.get('/polygon-contain-point', (req, res) => {
  const result = getPolygonContainPoint([req.query.lat, req.query.lng]);
  res.json({
    success: result !== null,
    data: result,
  });
});

module.exports = app;
