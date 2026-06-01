const API = "http://localhost:3000/api";

carregarFuncionarios();

async function carregarFuncionarios() {

    try {

        const response =
            await fetch(
                `${API}/funcionarios`
            );

        const funcionarios =
            await response.json();

        const tabela =
            document.getElementById(
                "tabelaFuncionarios"
            );

        tabela.innerHTML = "";

        funcionarios.forEach(
            funcionario => {

                tabela.innerHTML += `
                    <tr>

                        <td>
                            ${funcionario.nome}
                        </td>

                        <td>
                            ${funcionario.matricula}
                        </td>

                        <td>
                            ${
                                funcionario.ultimoPlantao
                                    ? new Date(
                                        funcionario.ultimoPlantao
                                      ).toLocaleDateString(
                                        "pt-BR"
                                      )
                                    : "-"
                            }
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
            }
        );

    } catch (erro) {

        console.error(erro);

        alert(
            "Erro ao carregar funcionários."
        );
    }
}

async function cadastrarFuncionario() {

    const nome =
        document.getElementById(
            "nome"
        ).value;

    const matricula =
        document.getElementById(
            "matricula"
        ).value;

    const ultimoPlantao =
        document.getElementById(
            "ultimoPlantao"
        ).value;

    if (
        !nome ||
        !matricula
    ) {

        alert(
            "Preencha nome e matrícula."
        );

        return;
    }

    try {

        await fetch(
            `${API}/funcionarios`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    nome,
                    matricula,
                    ultimoPlantao
                })
            }
        );

        document.getElementById(
            "nome"
        ).value = "";

        document.getElementById(
            "matricula"
        ).value = "";

        document.getElementById(
            "ultimoPlantao"
        ).value = "";

        carregarFuncionarios();

    } catch (erro) {

        console.error(erro);

        alert(
            "Erro ao cadastrar funcionário."
        );
    }
}

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

        alert(
            "Erro ao excluir funcionário."
        );
    }
}

async function gerarEscala() {

    const mes =
        document.getElementById(
            "mes"
        ).value;

    const ano =
        document.getElementById(
            "ano"
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

        const response =
            await fetch(
                `${API}/escala/gerar`,
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

        const escala =
            await response.json();

        renderizarEscala(
            escala
        );

    } catch (erro) {

        console.error(erro);

        alert(
            "Erro ao gerar escala."
        );
    }
}

function renderizarEscala(
    escala
) {

    const tabela =
        document.getElementById(
            "tabelaEscala"
        );

    tabela.innerHTML = "";

    escala.forEach(
        item => {

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

                    <td>
                        ${item.tipo || "-"}
                    </td>

                </tr>
            `;
        }
    );
}