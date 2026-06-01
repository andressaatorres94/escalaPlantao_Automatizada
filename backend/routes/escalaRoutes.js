const express = require("express");
const router = express.Router();

const {
    gerarEscala
} = require("../controllers/escalaController");

router.post(
    "/gerar",
    gerarEscala
);

module.exports = router;