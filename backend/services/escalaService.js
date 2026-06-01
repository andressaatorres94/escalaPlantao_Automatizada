const fs = require("fs");
const path = require("path");

const {
    buscarFeriadosNacionais
} = require("./feriadosService");

function lerJson(caminho) {

    if (!fs.existsSync(caminho)) {
        return [];
    }

    const conteudo =
        fs.readFileSync(
            caminho,
            "utf8"
        );

    if (!conteudo.trim()) {
        return [];
    }

    return JSON.parse(conteudo);
}

function diferencaDias(
    data1,
    data2
) {

    const umDia =
        1000 * 60 * 60 * 24;

    return Math.floor(
        Math.abs(data1 - data2)
        / umDia
    );
}

async function gerarEscalaAutomatica(
    mes,
    ano
) {

    const funcionarios =
        lerJson(
            path.join(
                __dirname,
                "../../data/funcionarios.json"
            )
        );

    const indisponibilidades =
        lerJson(
            path.join(
                __dirname,
                "../../data/indisponibilidades.json"
            )
        );

    const feriadosLocais =
        lerJson(
            path.join(
                __dirname,
                "../../data/feriados.json"
            )
        );

    const feriadosNacionais =
        await buscarFeriadosNacionais(
            ano
        );

    const feriadosExtras =
        feriadosLocais.map(
            item => item.data
        );

    const todosFeriados = [
        ...feriadosNacionais,
        ...feriadosExtras
    ];

    const escala = [];

    const ultimoDia =
        new Date(
            ano,
            mes,
            0
        ).getDate();

    for (
        let dia = 1;
        dia <= ultimoDia;
        dia++
    ) {

        const data =
            new Date(
                ano,
                mes - 1,
                dia
            );

        const dataISO =
            data
                .toISOString()
                .split("T")[0];

        const diaSemana =
            data.getDay();

        const ehFimSemana =
            diaSemana === 0 ||
            diaSemana === 6;

        const ehFeriado =
            todosFeriados.includes(
                dataISO
            );

        if (
            !ehFimSemana &&
            !ehFeriado
        ) {
            continue;
        }

        const elegiveis =
            funcionarios.filter(
                funcionario => {

                    const bloqueio =
                        indisponibilidades.find(
                            item =>
                                item.matricula ===
                                funcionario.matricula
                        );

                    if (
                        bloqueio &&
                        bloqueio.datas &&
                        bloqueio.datas.includes(
                            dataISO
                        )
                    ) {
                        return false;
                    }

                    if (
                        funcionario.ultimoPlantao
                    ) {

                        const dias =
                            diferencaDias(
                                data,
                                new Date(
                                    funcionario.ultimoPlantao
                                )
                            );

                        if (
                            dias < 7
                        ) {
                            return false;
                        }
                    }

                    return true;
                }
            );

        if (
            elegiveis.length === 0
        ) {

            escala.push({
                data:
                    data.toLocaleDateString(
                        "pt-BR"
                    ),
                funcionario:
                    "SEM PLANTONISTA",
                matricula:
                    "-",
                tipo:
                    ehFeriado
                        ? "Feriado"
                        : "Fim de Semana"
            });

            continue;
        }

        elegiveis.sort(
            (a, b) =>
                (a.totalPlantoes || 0)
                -
                (b.totalPlantoes || 0)
        );

        const escolhido =
            elegiveis[0];

        escolhido.totalPlantoes =
            (escolhido.totalPlantoes || 0)
            + 1;

        escolhido.ultimoPlantao =
            dataISO;

        escala.push({
            data:
                data.toLocaleDateString(
                    "pt-BR"
                ),
            funcionario:
                escolhido.nome,
            matricula:
                escolhido.matricula,
            tipo:
                ehFeriado
                    ? "Feriado"
                    : "Fim de Semana"
        });
    }

    fs.writeFileSync(
        path.join(
            __dirname,
            "../../data/escala.json"
        ),
        JSON.stringify(
            escala,
            null,
            4
        )
    );

    fs.writeFileSync(
        path.join(
            __dirname,
            "../../data/funcionarios.json"
        ),
        JSON.stringify(
            funcionarios,
            null,
            4
        )
    );

    return escala;
}

module.exports = {
    gerarEscalaAutomatica
};