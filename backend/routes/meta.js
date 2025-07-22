// routes/meta.js
const express = require("express");
const router = express.Router();
const { getMetaData } = require("../controllers/metaController");

router.get("/meta", getMetaData);

module.exports = router;
