function gerarTabelaHTML(arrayDados) {
    // Número de variáveis X
    var numVariaveis = arrayDados[0].length - 1;

    // Construir a expressão de maximização Z
    var Z = "MAXIMIZAR: Z = ";
    for (var i = 0; i < numVariaveis; i++) {
        Z += arrayDados[0][i] + " X<span class='subindice'>" + (i + 1) + "</span>";
        if (i < numVariaveis - 1) {
            Z += " + ";
        }
    }

    // Construir as restrições
    var restricoes = "<p>sujeito a</p>";
    for (var i = 1; i < arrayDados.length; i++) {
        var restricao = "";
        for (var j = 0; j < numVariaveis; j++) {
            restricao += arrayDados[i][j] + " X<span class='subindice'>" + (j + 1) + "</span> ";
            if (j < numVariaveis - 1) {
                restricao += "+ ";
            }
        }
        restricoes += "<p>" + restricao + "≤ " + arrayDados[i][numVariaveis] + "</p>";
    }

    // Montar o HTML da tabela
    var variaveisX = "";
    for (var i = 1; i <= numVariaveis; i++) {
        variaveisX += "X<span class='subindice'>" + i + "</span>";
        if (i < numVariaveis) {
            variaveisX += ", ";
        }
    }

    var tabelaHTML = `<table class="no-borde centro">
                        <tbody>
                            <tr>
                                <td>
                                    <span class="title" id="title">${Z}</span>
                                </td>
                            </tr>
                            <tr>
                                <td>${restricoes}</td>
                            </tr>
                            <tr>
                                <td>${variaveisX} ≥ 0</td>
                            </tr>
                        </tbody>
                    </table>`;

    // Retornar o HTML da tabela
    document.getElementById('modelagem-feita').innerHTML = tabelaHTML;
}

// Chamando a função com o exemplo de entrada
gerarTabelaHTML(exemploEntrada);
