function simplexMaxTable(entrada){
    const numVariaveis = entrada[0].length-1;
    const numRestricoes = entrada.length-1;
    let identidade = 1;
    
    let tabelaSimplex = [];
    const linhas = entrada.length;
    const colunas = numVariaveis + numRestricoes + 2; // 2 => coluna Z e LD

    for(let i=0; i<linhas; i++){
        tabelaSimplex.push([]); // Inicializa linha

        for(let j=0; j<colunas; j++){
            // Se primeira coluna (Z)
             if(j==0){
                tabelaSimplex[i][j] = i==0 ? 1 : 0;
             }
             // Se colunas de variáveis
             else if(j<entrada[0].length){
                tabelaSimplex[i][j] = i==0 ? -entrada[i][j-1] : entrada[i][j-1];
             }
             // Se colunas de variáveis auxiliares
             else if(j<colunas-1){
                if(i==0){
                    tabelaSimplex[i][j] = 0;
                }
                else{
                    if(i==identidade && j==numVariaveis+identidade){
                        tabelaSimplex[i][j] = 1;
                        identidade++;
                    }
                    else
                        tabelaSimplex[i][j] = 0;
                }
             }
             // Se lado direto (LD)
             else{
                tabelaSimplex[i][j] = entrada[i][entrada[0].length-1];
             }
        }
    }

    return tabelaSimplex;
}

function simplexMax(entrada, numVariaveis, numRestricoes){
    // var entrada = [[50, 80, 0], [1, 2, 120], [1, 1, 90]];
    // var entrada2 = [[8, 25, 0],[2,5,120], [0,3,60],[4,5,200]];
    // var entrada3 = [[3,5,0],[1,0,4],[0,2,12],[3,2,18]] ;

    let tabelaSimplex = simplexMaxTable(entrada);
    
    while(1){
        // Descobrir coluna pivotal
        let pesoZ=0, colunaPivotal;
        for(let i=1; i<=numVariaveis; i++){
            if(tabelaSimplex[0][i] < pesoZ){
                pesoZ = tabelaSimplex[0][i];
                colunaPivotal = i;
            }
        }

        if(pesoZ == 0)
            return;

        // Descobrir linha pivotal
        let pesoRestricao, linhaPivotal;
        for(let i=1; i<=numRestricoes; i++){
            // Não se divide entre números negativos
            if(tabelaSimplex[i][tabelaSimplex[0].length-1] > 0 && tabelaSimplex[i][colunaPivotal] > 0){
                if(!pesoRestricao || tabelaSimplex[i][tabelaSimplex[0].length-1]/tabelaSimplex[i][colunaPivotal] < pesoRestricao){
                    pesoRestricao = tabelaSimplex[i][tabelaSimplex[0].length-1]/tabelaSimplex[i][colunaPivotal];
                    linhaPivotal = i;
                }
            }
        }

        let elementoPivotal = tabelaSimplex[linhaPivotal][colunaPivotal];

        // Divide toda linha pivotal pelo elemento pivotal
        if(elementoPivotal != 1){
            for(let i=0; i<tabelaSimplex[0].length; i++)
                tabelaSimplex[linhaPivotal][i] /= elementoPivotal;
        }

        document.getElementById('modelagem-passos').innerHTML += gerarTabelaIteracao(1, tabelaSimplex);

        // Escalonamento
        let coeficiente;
        for(let i=0; i<tabelaSimplex.length; i++){
            if(i != linhaPivotal){
                coeficiente = tabelaSimplex[i][colunaPivotal];
                for(let j=0; j<tabelaSimplex[0].length; j++){
                    tabelaSimplex[i][j] += -coeficiente*tabelaSimplex[linhaPivotal][j];
                }
            }
        }

        document.getElementById('modelagem-passos').innerHTML += gerarTabelaIteracao(2, tabelaSimplex);
        console.log(tabelaSimplex);
    }
}
simplexMax(exemploEntrada , 2, 2);
// var entrada = [[3,8,0], [1,4,3.5], [1,2,2.5]]
// [3 8 0]
// [1 4 3.5]
// [1 2 2.5]
function simplexMinTable(entrada){
    const numVariaveis = entrada[0].length-1;
    const numRestricoes = entrada.length-1;
    const linhas = numVariaveis;
    const colunas = numVariaveis + numRestricoes*2 + 1;

    let M = 100;

    // Montagem da linha Z
    let Z = [];
    for(let i=0; i<colunas; i++){
        if(i < entrada[0].length-1)
            Z[i] = entrada[0][i];
        else{
            Z[i] = 0; // variável auxiliar
            i++;
            Z[i] = M; // variável artificial
        }
    }

    // Montagem matricial das equações referentes às restrições
    let identidade = 0;
    let tabelaSimplex = [];
    for(let i=0; i<linhas; i++){
        tabelaSimplex.push([]); // Inicializa linha

        for(let j=0; j<colunas; j++){
            if(j < entrada[0].length-1)
                tabelaSimplex[i][j] = entrada[i+1][j];
            else if(j < colunas-1){
                if(i==identidade && j==numVariaveis+identidade*2){
                    tabelaSimplex[i][j] = -1;
                    j++;
                    tabelaSimplex[i][j] = 1;
                    identidade++;
                }
                else
                    tabelaSimplex[i][j] = 0;
            }
            else
                tabelaSimplex[i][j] = entrada[i+1][entrada[0].length-1];
        }
    }

    // Vetor de coeficentes das variáveis na base
    let coefientes = [];
    for(let i=0; i<numRestricoes; i++)
        coefientes[i] = M;

    let result = [Z, tabelaSimplex, coefientes];

    return result;
}

function simplexMin(entrada){
    let result = simplexMinTable(entrada);

    let Z = result[0];
    let tabelaSimplex = result[1];
    let coeficentes = result[2];

    console.log(Z, tabelaSimplex, coeficentes);
}

function gerarTabelaIteracao(iteracao, tabelaSimplex) {
    let html = `<h4>Iteração ${iteracao}</h4>`;
    html += '<table class="table table-bordered">';
    html += '<thead><tr>';

    // Cabeçalho das variáveis não-básicas
    html += '<th scope="col">Ignore</th>';
    for (let i = 1; i < tabelaSimplex[0].length - 1; i++) {
        if (i <= tabelaSimplex[0].length - 2 - (tabelaSimplex.length - 1)) {
            html += `<th scope="col">x${i}</th>`;
        } else {
            html += `<th scope="col">s${i - (tabelaSimplex[0].length - 2 - (tabelaSimplex.length - 1))}</th>`;
        }
    }

    // Cabeçalho da última coluna (RSH)
    html += '<th scope="col">RSH</th>';
    html += '</tr></thead>';
    html += '<tbody>';

    // Conteúdo das linhas
    for (let i = 0; i < tabelaSimplex.length; i++) {
        html += '<tr>';
        for (let j = 0; j < tabelaSimplex[i].length; j++) {
            html += `<td>${tabelaSimplex[i][j]}</td>`;
        }
        html += '</tr>';
    }

    html += '</tbody></table><br>';

    return html;
}

