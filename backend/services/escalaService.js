const fs = require("fs");
const path = require("path");

const {
    buscarFeriados
} = require("./feriadosService");

function diferencaDias(data1, data2) {

    const umDia =
        1000 * 60 * 60 * 24;

    return Math.floor(
        (data1 - data2) / umDia
    );
}

//Atualizar plantao

function atualizarUltimosPlantoes(
    funcionarios,
    historico
) {

    funcionarios.forEach(funcionario => {

        let ultimoPlantaoHistorico = null;

        Object.values(historico).flat().forEach(plantao =>{
        
            if (
                plantao.matricula !==
                funcionario.matricula
            ) {
                return;
            }

            const [dia, mes, ano] =plantao.data.split("/");

            const dataISO =`${ano}-${mes}-${dia}`;

            if (
                !ultimoPlantaoHistorico ||
                dataISO >
                ultimoPlantaoHistorico
            ) {

                ultimoPlantaoHistorico =
                    dataISO;
            }
        });

        if (
            ultimoPlantaoHistorico
        ) {

            funcionario.ultimoPlantao = ultimoPlantaoHistorico;
        }
    });
}

//Gerar escala automatica

async function gerarEscalaAutomatica(mes,ano) {

    const funcionarios = JSON.parse(fs.readFileSync(
            path.join(__dirname,"../../data/funcionarios.json"),"utf8"
        )
    );

    const arquivoEscala =path.join(__dirname,"../../data/escala.json");

    let historico = {};

    if (
        fs.existsSync(arquivoEscala)
    ) {

        const conteudo =fs.readFileSync(arquivoEscala,"utf8");

        if (
            conteudo.trim()
        ) {

            historico =JSON.parse(conteudo);
        }
    }

    const chaveMes =
        `${ano}-${String(mes).padStart(2, "0")}`;

    // Se já existir escala do mês
    if (
        historico[chaveMes]
    ) {

        return historico[chaveMes];
    }

     
    
    atualizarUltimosPlantoes(funcionarios,historico);

    const feriadosApi =await buscarFeriados(ano);

    const feriadosLocais =JSON.parse(fs.readFileSync(path.join(__dirname,"../../data/feriados.json"),"utf8"));

    const escala = [];

    const ultimoDia = new Date(ano,mes,0).getDate();

    for (
        let dia = 1;
        dia <= ultimoDia;
        dia++
    ) {

        const data =new Date(ano,mes - 1,dia);

        const dataISO =`${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;

        const diaSemana =data.getDay();

        const ehFinalSemana =
            diaSemana === 0 ||
            diaSemana === 6;

        const ehFeriadoApi =feriadosApi.includes(
                dataISO
            );


        const ehFeriadoLocal =feriadosLocais.some(
                f => f.data === dataISO
            );

        const ehFeriado =
            ehFeriadoApi ||
            ehFeriadoLocal;

        if (
            !ehFinalSemana &&
            !ehFeriado
        ) {
            continue;
        }

        const elegiveis =funcionarios.filter(
            funcionario => {

                // Verifica indisponibilidade por período
                if (
                    funcionario.indisponibilidades &&
                    funcionario.indisponibilidades.length > 0
                ) {

                    const bloqueado =
                        funcionario.indisponibilidades.some(periodo => {
                                return (
                                    dataISO >= periodo.inicio &&
                                    dataISO <= periodo.fim
                                );
                            }
                        );

                    if (bloqueado) {
                        return false;
                    }
                }

                // Regra dos 7 dias
                if (
                    funcionario.ultimoPlantao
                ) {

                    const dias =diferencaDias(
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
                data:data.toLocaleDateString("pt-BR"),
                funcionario:"SEM DISPONIBILIDADE",
                matricula:"-"
            });

            continue;
        }

        elegiveis.sort(
            (a, b) => {

                if (
                    !a.ultimoPlantao &&
                    !b.ultimoPlantao
                ) {
                    return 0;
                }

                if (
                    !a.ultimoPlantao
                ) {
                    return -1;
                }

                if (
                    !b.ultimoPlantao
                ) {
                    return 1;
                }

                return (
                    new Date(
                        a.ultimoPlantao
                    ) -
                    new Date(
                        b.ultimoPlantao
                    )
                );
            }
        );

        const escolhido =elegiveis[0];

        escolhido.ultimoPlantao =dataISO;

        escolhido.totalPlantoes =
            (
                escolhido.totalPlantoes || 0
            ) + 1;

        escala.push({
            data:data.toLocaleDateString("pt-BR"),
            funcionario:escolhido.nome,
            matricula:escolhido.matricula
        });
    }

   

    historico[chaveMes] =escala;

    fs.writeFileSync(arquivoEscala,JSON.stringify(historico,null,4));

    return escala;
}


//

module.exports = {
    gerarEscalaAutomatica
};