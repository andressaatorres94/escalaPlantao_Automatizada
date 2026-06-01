const express = require("express");
const router = express.Router();

const {
    listarFuncionarios,
    cadastrarFuncionario,
    excluirFuncionario
} = require("../controllers/funcionariosController");

router.get("/", listarFuncionarios);

router.post("/", cadastrarFuncionario);

router.delete("/:id", excluirFuncionario);

module.exports = router;