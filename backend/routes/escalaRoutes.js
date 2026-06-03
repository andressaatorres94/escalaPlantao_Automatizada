const express = require("express");
const router = express.Router();

const {
    gerarEscala,
    buscarEscalaMes
} = require("../controllers/escalaController");

router.post(
    "/gerar",
    gerarEscala
);

router.get(
    "/:ano/:mes",
    buscarEscalaMes
);


module.exports = router;