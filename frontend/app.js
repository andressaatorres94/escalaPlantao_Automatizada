const API = "http://localhost:3000/api";

function formatarData(dataISO) {

    if (!dataISO) {
        return "-";
    }

    const [ano, mes, dia] = dataISO.split("-");

    return `${dia}/${mes}/${ano}`;
}

carregarFuncionarios();

async function carregarFuncionarios() {

    try {

        const response = await fetch(`${API}/funcionarios`);

        const funcionarios = await response.json();

        const tabela = document.getElementById(
                "tabelaFuncionarios"
            );

        tabela.innerHTML = "";

        funcionarios.forEach(funcionario => {
            tabela.innerHTML += `
                <tr>

                    <td>
                        ${funcionario.nome}
                    </td>

                    <td>
                        ${funcionario.matricula}
                    </td>

                    <td>

                        <button
                            class="btn-excluir"
                            onclick="excluirFuncionario(${funcionario.id})"
                        >
                            Excluir
                        </button>

                    </td>

                </tr>
            `;
        });

    } catch (erro) {

        console.error(erro);

        alert("Erro ao carregar funcionários.");
    }
}

//Cadastro dos funcionarios

async function cadastrarFuncionario() {

    const nome = document.getElementById("nome").value;

    const matricula = document.getElementById("matricula").value;

    const ultimoPlantao = document.getElementById("ultimoPlantao").value;

    const inicioIndisponibilidade =document.getElementById("inicioIndisponibilidade").value;

    const fimIndisponibilidade =document.getElementById("fimIndisponibilidade").value;

    let indisponibilidades = [];

    if (
        inicioIndisponibilidade &&
        fimIndisponibilidade
    ) {

        indisponibilidades.push({
            inicio: inicioIndisponibilidade,
            fim: fimIndisponibilidade
        });
    }

    if (
        !nome ||
        !matricula
    ) {

        alert("Preencha nome e matrícula.");

        return;
    }

    try {

        await fetch(
            `${API}/funcionarios`,
            {
                method: "POST",

                headers: {
                    "Content-Type":"application/json"
                },

                body: JSON.stringify({
                    nome,
                    matricula,
                    ultimoPlantao,
                    indisponibilidades
                })
            }
        );

        document.getElementById("nome").value = "";
        document.getElementById("matricula").value = "";
        document.getElementById("ultimoPlantao").value = "";
        document.getElementById("inicioIndisponibilidade").value = "";
        document.getElementById("fimIndisponibilidade").value = "";

        carregarFuncionarios();

    } catch (erro) {

        console.error(erro);

        alert(
            "Erro ao cadastrar funcionário."
        );
    }
}

//Excluir funcionario
async function excluirFuncionario(
    id
) {

    const confirmar =
        confirm(
            "Deseja realmente excluir este funcionário?"
        );

    if (!confirmar) {
        return;
    }

    try {

        await fetch(
            `${API}/funcionarios/${id}`,
            {
                method: "DELETE"
            }
        );

        carregarFuncionarios();

    } catch (erro) {

        console.error(erro);

        alert("Erro ao excluir funcionário.");
    }
}

//Gerar escala de platão
async function gerarEscala() {

    const mes =document.getElementById("mes").value;

    const ano =document.getElementById("ano").value;

    if (
        !mes ||
        !ano
    ) {

        alert("Informe mês e ano.");

        return;
    }

    try {

        const response =await fetch(`${API}/escala/gerar`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        mes,
                        ano
                    })
                }
            );

        const escala = await response.json();

        renderizarEscala(escala);

    } catch (erro) {

        console.error(erro);

        alert("Erro ao gerar escala.");
    }
}

//Consultar escalas
async function consultarEscala() {

    const mes =
        document.getElementById(
            "mesConsulta"
        ).value;

    const ano =
        document.getElementById(
            "anoConsulta"
        ).value;

    if (
        !mes ||
        !ano
    ) {

        alert(
            "Informe mês e ano."
        );

        return;
    }

    try {

        const response =await fetch(`${API}/escala/${ano}/${mes}`);

        const escala =
            await response.json();

        renderizarEscala(escala);

    } catch (erro) {

        console.error(
            erro
        );

        alert(
            "Erro ao consultar escala."
        );
    }
}

//Exportar para excel a escala
function exportarExcel() {

    window.open(
        `${API}/exportar/excel`,
        "_blank"
    );
}

function renderizarEscala(escala) {

    const tabela = document.getElementById("tabelaEscala");

    tabela.innerHTML = "";

    if (
        !escala ||
        escala.length === 0
    ) {

        tabela.innerHTML = `
            <tr>
                <td colspan="3">
                    Nenhuma escala gerada.
                </td>
            </tr>
        `;

        return;
    }

    escala.forEach(item => {
        tabela.innerHTML += `
            <tr>

                <td>
                    ${item.data}
                </td>

                <td>
                    ${item.funcionario}
                </td>

                <td>
                    ${item.matricula}
                </td>

            </tr>
        `;
    });
}