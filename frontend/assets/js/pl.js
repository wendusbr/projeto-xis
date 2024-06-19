/*
 var entrada = {
        numVariaveis: 2, 
        numRestricoes: 3, 
        tipo: 'min', 
        z:[0.4, 0.5], 
        restricoes:[['<=', 0.3, 0.1, 2.7], ['=', 0.5, 0.5, 6], ['>=', 0.6, 0.4, 6]]
    };
*/

function simplexMethod(entrada){
    var M = 1000;

    if(entrada.tipo == 'min'){
        let z = [];
        let c = [];

        // Inicializa Z com coeficientes de cada variável do problema
        entrada.z.forEach(element => {
            z.push(element);
        });

        // Configura Z e C (lado esquerdo) de acordo às restrições
        entrada.restricoes.forEach(element => {
            switch(element[0]){
                case '<=':
                    z.push(0);
                    c.push(0);
                    break;

                case '=':
                    z.push(M);
                    c.push(M);
                    break;

                case '>=':
                    z.push(0, M);
                    c.push(M);
                    break;
            }
        });

        let tabelaSimplex = [];
        let identidade = entrada.numVariaveis;
        let incremento;

        // Criando tabela de restrições
        for(let i=0; i<entrada.numRestricoes; i++){
            tabelaSimplex.push([]);

            for(let j=0; j<z.length; j++){
                if(j<entrada.numVariaveis)
                    tabelaSimplex[i].push(entrada.restricoes[i][j+1]);
                else{
                    switch(entrada.restricoes[i][0]){
                        case '<=':
                            if(identidade == j){
                                tabelaSimplex[i].push(1);
                                incremento = 1;
                            }
                            else{
                                tabelaSimplex[i].push(0);
                            }

                            break;

                        case'=':
                            if(identidade == j){
                                tabelaSimplex[i].push(1);
                                incremento = 1;
                            }
                            else{
                                tabelaSimplex[i].push(0);
                            }

                            break;
        
                        case '>=':
                            if(identidade == j){
                                tabelaSimplex[i].push(-1, 1);
                                incremento = 2;
                                j++;
                            }
                            else{
                                tabelaSimplex[i].push(0);
                            }
                            
                            break;
                    }
                }
            }

            identidade += incremento;

            tabelaSimplex[i].push(entrada.restricoes[i][entrada.restricoes[i].length-1]);
        }

        // Inicializar vetor Zj
        let zj = [];
        for(let i=0; i<tabelaSimplex[0].length; i++){
            let value = 0;
            let j = 0;

            tabelaSimplex.forEach(element => {
                value += element[i]*c[j];
                j++;
                if(j == c.length)
                    j=0;
            });

            zj.push(value);
        }

        // Inicializar vetor pesoZj
        let pesoZj = [];
        for(let i=0; i<z.length; i++)
            pesoZj.push(z[i]-zj[i]);

        let result = [z, c, tabelaSimplex, zj, pesoZj];

        simplexMin(result);
    }
}

function simplexMin(entrada){
    let z = entrada[0];
    let c = entrada[1];
    let tabelaSimplex = entrada[2];
    let zj = entrada[3];
    let pesoZj = entrada[4];

    let it = 0;
    while(1){
        console.log(z, c, tabelaSimplex, zj, pesoZj);

        writeIterationMin(it, z, c, tabelaSimplex, zj, pesoZj);
        
        // Descobrir coluna pivotal
        let minPesoZj=0, colunaPivotal;
        for(let i=0; i<z.length; i++){
            if(pesoZj[i] < minPesoZj){
                minPesoZj = pesoZj[i]
                colunaPivotal = i;
            }
        }
        if(minPesoZj === 0)
            return;
        
        // Descobrir linha pivotal
        let pesoRestricao, linhaPivotal;
        for(let i=0; i<tabelaSimplex.length; i++){
            if(tabelaSimplex[i][colunaPivotal] > 0 && tabelaSimplex[i][tabelaSimplex[i].length-1] > 0){
                if(!pesoRestricao || tabelaSimplex[i][tabelaSimplex[i].length-1]/tabelaSimplex[i][colunaPivotal] < pesoRestricao){
                    pesoRestricao = tabelaSimplex[i][tabelaSimplex[i].length-1]/tabelaSimplex[i][colunaPivotal];
                    linhaPivotal = i;
                }
            }
        }

        if(!pesoRestricao)
            return;

        let elementoPivotal = tabelaSimplex[linhaPivotal][colunaPivotal];

        // Divide toda linha pivotal pelo elemento pivotal
        if(elementoPivotal != 1){
            for(let i=0; i<tabelaSimplex[0].length; i++)
                tabelaSimplex[linhaPivotal][i] /= elementoPivotal;
        }

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

        // Variável referente à coluna pivotal entra na base
        c[linhaPivotal] = z[colunaPivotal]; 

        // Atualiza vetor Zj
        for(let i=0; i<tabelaSimplex[0].length; i++){
            let value = 0;
            let j = 0;

            tabelaSimplex.forEach(element => {
                value += element[i]*c[j];
                j++;
                if(j == c.length)
                    j=0;
            });

            zj[i] = value;
        }

        // Atualiza vetor pesoZj
        for(let i=0; i<z.length; i++)
            pesoZj[i] = (z[i]-zj[i]);

        it++;
    }
}

function writeIterationMin(it, z, c, tabelaSimplex, zj, pesoZj){
    var table = `
        <h1>It ${it}</h1>
        <table class="table mb-5">
    `;

        table += '<tr><td>LE</td>';
        z.forEach(element => {
            table += `<td>${element}</td>`
        });
        table += '<td>LD</td></tr>'

        for(let i=0; i<tabelaSimplex.length; i++){
            table += '<tr>';
            table += `<td>${c[i]}</td>`;

            tabelaSimplex[i].forEach(element => {
                table += `<td>${element}</td>`
            });

            table += '</tr>';

        }

        table += '<tr><td>Zj</td>'
        zj.forEach(element => {
            table += `<td>${element}</td>`
        });
        table += '</tr>';

        table += '<tr><td>pesoZj</td>'
        pesoZj.forEach(element => {
            table += `<td>${element}</td>`
        });
        table += '</tr>';

        table += '</table>';
        document.body.innerHTML += table; // Adapte como quiser
}

// function simplexMaxTable(entrada){
//     const numVariaveis = entrada[0].length-1;
//     const numRestricoes = entrada.length-1;
//     let identidade = 1;
    
//     let tabelaSimplex = [];
//     const linhas = entrada.length;
//     const colunas = numVariaveis + numRestricoes + 2; // 2 => coluna Z e LD

//     for(let i=0; i<linhas; i++){
//         tabelaSimplex.push([]); // Inicializa linha

//         for(let j=0; j<colunas; j++){
//             // Se primeira coluna (Z)
//              if(j==0){
//                 tabelaSimplex[i][j] = i==0 ? 1 : 0;
//              }
//              // Se colunas de variáveis
//              else if(j<entrada[0].length){
//                 tabelaSimplex[i][j] = i==0 ? -entrada[i][j-1] : entrada[i][j-1];
//              }
//              // Se colunas de variáveis auxiliares
//              else if(j<colunas-1){
//                 if(i==0){
//                     tabelaSimplex[i][j] = 0;
//                 }
//                 else{
//                     if(i==identidade && j==numVariaveis+identidade){
//                         tabelaSimplex[i][j] = 1;
//                         identidade++;
//                     }
//                     else
//                         tabelaSimplex[i][j] = 0;
//                 }
//              }
//              // Se lado direto (LD)
//              else{
//                 tabelaSimplex[i][j] = entrada[i][entrada[0].length-1];
//              }
//         }
//     }

//     return tabelaSimplex;
// }

// function simplexMax(entrada){
//     const numVariaveis = entrada[0].length-1;
//     const numRestricoes = entrada.length-1;

//     let tabelaSimplex = simplexMaxTable(entrada);
    
//     let result = [];
//     let it = 0;
//     while(1){
//         console.log(tabelaSimplex);
//         let html = gerarTabelaIteracao(it, tabelaSimplex);
//         it++;

//         document.body.innerHTML += html;

//         // Descobrir coluna pivotal
//         let pesoZ=0, colunaPivotal;
//         for(let i=1; i<=numVariaveis; i++){
//             if(tabelaSimplex[0][i] < pesoZ){
//                 pesoZ = tabelaSimplex[0][i];
//                 colunaPivotal = i;
//             }
//         }

//         if(pesoZ === 0)
//             break;

//         // Descobrir linha pivotal
//         let pesoRestricao, linhaPivotal;
//         for(let i=1; i<=numRestricoes; i++){
//             // Não se divide entre números negativos
//             if(tabelaSimplex[i][tabelaSimplex[0].length-1] > 0 && tabelaSimplex[i][colunaPivotal] > 0){
//                 if(!pesoRestricao || tabelaSimplex[i][tabelaSimplex[0].length-1]/tabelaSimplex[i][colunaPivotal] < pesoRestricao){
//                     pesoRestricao = tabelaSimplex[i][tabelaSimplex[0].length-1]/tabelaSimplex[i][colunaPivotal];
//                     linhaPivotal = i;
//                 }
//             }
//         }

//         if(!pesoRestricao)
//             break;

//         let elementoPivotal = tabelaSimplex[linhaPivotal][colunaPivotal];

//         // Divide toda linha pivotal pelo elemento pivotal
//         if(elementoPivotal != 1){
//             for(let i=0; i<tabelaSimplex[0].length; i++)
//                 tabelaSimplex[linhaPivotal][i] /= elementoPivotal;
//         }

//         // Escalonamento
//         let coeficiente;
//         for(let i=0; i<tabelaSimplex.length; i++){
//             if(i != linhaPivotal){
//                 coeficiente = tabelaSimplex[i][colunaPivotal];
//                 for(let j=0; j<tabelaSimplex[0].length; j++){
//                     tabelaSimplex[i][j] += -coeficiente*tabelaSimplex[linhaPivotal][j];
//                 }
//             }
//         }
//     }
// }

// function simplexMinTable(entrada){
//     const numVariaveis = entrada[0].length-1;
//     const numRestricoes = entrada.length-1;
//     const linhas = numVariaveis;
//     const colunas = numVariaveis + numRestricoes*2 + 1;

//     let M = 100;

//     // Montagem da linha Z
//     let z = [];
//     for(let i=0; i<colunas-1; i++){
//         if(i < entrada[0].length-1)
//             z.push(entrada[0][i]);
//         else{
//             z.push(0); // variável auxiliar
//             i++;
//             z.push(M); // variável artificial
//         }
//     }

//     // Montagem matricial das equações referentes às restrições
//     let identidade = 0;
//     let tabelaSimplex = [];
//     for(let i=0; i<linhas; i++){
//         tabelaSimplex.push([]); // Inicializa linha

//         for(let j=0; j<colunas; j++){
//             if(j < entrada[0].length-1)
//                 tabelaSimplex[i][j] = entrada[i+1][j];
//             else if(j < colunas-1){
//                 if(i==identidade && j==numVariaveis+identidade*2){
//                     tabelaSimplex[i][j] = -1;
//                     j++;
//                     tabelaSimplex[i][j] = 1;
//                     identidade++;
//                 }
//                 else
//                     tabelaSimplex[i][j] = 0;
//             }
//             else
//                 tabelaSimplex[i][j] = entrada[i+1][entrada[0].length-1];
//         }
//     }

//     // Vetor de coeficentes das variáveis na base
//     let c = [];
//     for(let i=0; i<numRestricoes; i++)
//         c.push(M);

//     // Vetor Zj
//     let zj = [];
//     for(let i=0; i<tabelaSimplex[0].length; i++){
//         let value = 0;
//         let j = 0;

//         tabelaSimplex.forEach(element => {
//             value += element[i]*c[j];
//             j++;
//             if(j == c.length)
//                 j=0;
//         });

//         zj.push(value);
//     }

//     // Vetor pesoZj
//     let pesoZj = [];
//     for(let i=0; i<z.length; i++)
//         pesoZj.push(z[i]-zj[i]);
    
//     let result = [z, tabelaSimplex, c, zj, pesoZj];

//     return result;
// }

// function gerarTabelaIteracao(iteracao, tabelaSimplex) {
//     let html = `<h4>Iteração ${iteracao}</h4>`;
//     html += '<table class="table table-bordered">';
//     html += '<thead><tr>';

//     // Cabeçalho das variáveis não-básicas
//     html += '<th scope="col">Z</th>';
//     for (let i = 1; i < tabelaSimplex[0].length - 1; i++) {
//         if (i <= tabelaSimplex[0].length - 2 - (tabelaSimplex.length - 1)) {
//             html += `<th scope="col">x${i}</th>`;
//         } else {
//             html += `<th scope="col">s${i - (tabelaSimplex[0].length - 2 - (tabelaSimplex.length - 1))}</th>`;
//         }
//     }

//     // Cabeçalho da última coluna (RSH)
//     html += '<th scope="col">RSH</th>';
//     html += '</tr></thead>';
//     html += '<tbody>';

//     // Conteúdo das linhas
//     for (let i = 0; i < tabelaSimplex.length; i++) {
//         html += '<tr>';
//         for (let j = 0; j < tabelaSimplex[i].length; j++) {
//             html += `<td>${tabelaSimplex[i][j]}</td>`;
//         }
//         html += '</tr>';
//     }

//     html += '</tbody></table><br>';

//     return html;
// }