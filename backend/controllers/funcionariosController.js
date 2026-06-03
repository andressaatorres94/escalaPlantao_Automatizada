const fs = require("fs");
const path = require("path");

const arquivo = path.join(
    __dirname,
    "../../data/funcionarios.json"
);

function lerArquivo() {

    console.log("Lendo arquivo:", arquivo);

    try {

        if (!fs.existsSync(arquivo)) {
            return [];
        }

        const conteudo =
            fs.readFileSync(
                arquivo,
                "utf8"
            );

        if (!conteudo.trim()) {
            return [];
        }

        return JSON.parse(conteudo);

    } catch (erro) {

        console.error(
            "Erro ao ler JSON:",
            erro
        );

        return [];
    }
}

function salvarArquivo(dados) {

    fs.writeFileSync(
        arquivo,
        JSON.stringify(
            dados,
            null,
            4
        )
    );
}

function listarFuncionarios(req, res) {

    const funcionarios =
        lerArquivo();
    
    console.log("FUNCIONARIOS LIDOS:");
    console.log(funcionarios);

    res.json(funcionarios);
}

function cadastrarFuncionario(
    req,
    res
) {

    const {
        nome,
        matricula,
        ultimoPlantao,
        indisponibilidades
    } = req.body;

    const funcionarios =lerArquivo();

    const novoFuncionario = {
        id: Date.now(),
        nome,
        matricula,
        ultimoPlantao,
        totalPlantoes: 0,
        indisponibilidades: indisponibilidades || []
    };

    funcionarios.push(
        novoFuncionario
    );

    salvarArquivo(
        funcionarios
    );

    res.json({
        sucesso: true
    });
}

function excluirFuncionario(
    req,
    res
) {

    const id =
        Number(req.params.id);

    const funcionarios =
        lerArquivo();

    const atualizado =
        funcionarios.filter(
            f => f.id !== id
        );

    salvarArquivo(
        atualizado
    );

    res.json({
        sucesso: true
    });
}

module.exports = {
    listarFuncionarios,
    cadastrarFuncionario,
    excluirFuncionario
};