const {
    gerarEscalaAutomatica
} = require("../services/escalaService");

async function gerarEscala(req,res) {

    try {

        const {mes,ano} = req.body;

        const escala = await gerarEscalaAutomatica(
                Number(mes),
                Number(ano)
        );

        res.json(escala);

    } catch (erro) {

        console.log(erro);

        res.status(500).json({
            erro:
                "Erro ao gerar escala"
        });
    }
}

const fs = require("fs");
const path = require("path");

function buscarEscalaMes(req,res) {

    const {
        ano,
        mes
    } = req.params;

    const arquivo =path.join(__dirname,"../../data/escala.json");

    if (
        !fs.existsSync(
            arquivo
        )
    ) {

        return res.json([]);
    }

    const historico =JSON.parse(fs.readFileSync(arquivo,"utf8"));

    const chave =`${ano}-${mes}`;

    res.json(historico[chave] || []);
}

module.exports = {
    gerarEscala,
    buscarEscalaMes
};
