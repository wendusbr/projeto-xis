document.addEventListener("DOMContentLoaded", function() {
    // Recuperando os dados do localStorage
    const dadosString = localStorage.getItem('dados');
    const dados = JSON.parse(dadosString);

    gerarTabelaHTML(dados);

    // Preparando estruturas de dados para Plotly
    const traces = [];
    const shapes = [];

    dados.restricoes.forEach(function(restricao, index) {
        const tipo = restricao[0]; // Tipo da restrição: <=, >= ou =
        const coeficientes = restricao.slice(1, -1); // Coeficientes da restrição
        const rhs = restricao[restricao.length - 1]; // Lado direito da restrição

        // Criar pontos para plotagem da restrição
        const trace = {
            type: 'scatter',
            mode: 'lines',
            name: `Restrição ${index + 1}`,
            line: {
                color: getRandomColor(), // Cor aleatória para cada restrição
                width: 2
            },
            x: [],
            y: []
        };

        // Gerar pontos da restrição
        const xMax = 15; // Ajustar para a escala desejada
        const yMax = 15;

        // Adicionando ponto em X1 = 0, X2 variável
        if (Math.abs(coeficientes[0]) < 0.0001) {
            for (let y = 0; y <= yMax; y += 0.1) {
                let x = rhs / coeficientes[1];
                if (x >= 0) {
                    trace.x.push(x);
                    trace.y.push(y);
                }
            }
        } else if (Math.abs(coeficientes[1]) < 0.0001) {
            // Adicionando ponto em X2 = 0, X1 variável
            for (let x = 0; x <= xMax; x += 0.1) {
                let y = rhs / coeficientes[0];
                if (y >= 0) {
                    trace.x.push(x);
                    trace.y.push(y);
                }
            }
        } else {
            // Gerar pontos para coeficientes normais de X1 e X2
            for (let x = 0; x <= xMax; x += 0.1) {
                let y = (rhs - coeficientes[0] * x) / coeficientes[1];
                if (y >= 0) { // Garantir que y seja maior ou igual a 0
                    trace.x.push(x);
                    trace.y.push(y);
                }
            }
        }

        traces.push(trace);

        // Adicionar shapes para áreas sombreadas apenas para <= e >=
        if (tipo === '<=') {
            const shape = {
                type: 'path',
                path: getPath(coeficientes, rhs, tipo), // Função para obter o caminho do shape
                fillcolor: 'rgba(0, 0, 255, 0.2)', // Cor e opacidade da área sombreada
                line: {
                    width: 1 // Sem linha de contorno do shape
                }
            };

            shapes.push(shape);
        } else if (tipo === '>=') {
            const shape = {
                type: 'path',
                path: getPath(coeficientes, rhs, tipo), // Função para obter o caminho do shape
                fillcolor: 'rgba(255, 0, 0, 0.2)', // Cor e opacidade da área sombreada
                line: {
                    width: 1 // Sem linha de contorno do shape
                }
            };

            shapes.push(shape);
        }
    });

    // Adicionar interseções entre as restrições se houver mais de duas
    if (dados.restricoes.length > 1) {
        for (let i = 0; i < dados.restricoes.length - 1; i++) {
            for (let j = i + 1; j < dados.restricoes.length; j++) {
                const intersecao = encontrarIntersecao(dados.restricoes[i], dados.restricoes[j]);
                if (intersecao && intersecao.x >= 0 && intersecao.y >= 0) {
                    traces.push({
                        type: 'scatter',
                        mode: 'markers',
                        name: `Interseção ${i + 1}-${j + 1}`,
                        marker: {
                            symbol: 'circle',
                            size: 10,
                            color: 'black'
                        },
                        x: [intersecao.x],
                        y: [intersecao.y]
                    });
                }
            }
        }
    }

    // Configurar layout do gráfico
    const layout = {
        xaxis: {
            title: 'X1',
            range: [0, 15], // Ajustar limite do eixo x
            dtick: 1, // Incremento de 1 no eixo x
            zeroline: false, // Remover linha do zero
            ticksuffix: '', // Remover o sinal de menos dos ticks negativos
            showline: true, // Mostrar linha do eixo x
            showgrid: true // Mostrar grid do eixo x
        },
        yaxis: {
            title: 'X2',
            range: [0, 15], // Ajustar limite do eixo y
            dtick: 1, // Incremento de 1 no eixo y
            zeroline: false, // Remover linha do zero
            ticksuffix: '', // Remover o sinal de menos dos ticks negativos
            showline: true, // Mostrar linha do eixo y
            showgrid: true // Mostrar grid do eixo y
        },
        showlegend: true, // Exibir legenda
        margin: { t: 50, b: 50, l: 50, r: 50 }, // Margens do gráfico
        hovermode: 'closest', // Modo de hover mais próximo
        shapes: shapes // Adicionar os shapes ao layout
    };

    Plotly.newPlot('myPlot', traces, layout);

    function encontrarIntersecao(restricao1, restricao2) {
        const coeficientes1 = restricao1.slice(1, -1);
        const rhs1 = restricao1[restricao1.length - 1];
        const coeficientes2 = restricao2.slice(1, -1);
        const rhs2 = restricao2[restricao2.length - 1];

        const denom = coeficientes1[0] * coeficientes2[1] - coeficientes1[1] * coeficientes2[0];
        if (denom === 0) return null;

        const x = (rhs1 * coeficientes2[1] - rhs2 * coeficientes1[1]) / denom;
        const y = (rhs2 * coeficientes1[0] - rhs1 * coeficientes2[0]) / denom;

        return { x: x, y: y };
    }

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function getPath(coeficientes, rhs, tipo) {
        const xMax = 15; // Limite de x para visualização
        const yMax = 15;

        if (tipo === '<=') {
            let path = `M 0,0`;
            for (let x = 0; x <= xMax; x += 0.1) {
                let y;
                if (coeficientes[1] !== 0) {
                    y = (rhs - coeficientes[0] * x) / coeficientes[1];
                    if (y >= 0) { // Garantir que y seja maior ou igual a 0
                        path += ` L ${x},${y}`;
                    }
                } else {
                    y = rhs / coeficientes[0]; // Para coeficiente x2 = 0, calculamos y no eixo x1
                    if (y >= 0) { // Garantir que y seja maior ou igual a 0
                        path += ` L ${x},${y}`;
                    }
                }
            }
            return path + ` L ${xMax},0 Z`;
        } else if (tipo === '>=') {
            let path = `M 0,${yMax}`;
            for (let x = 0; x <= xMax; x += 0.1) {
                let y;
                if (coeficientes[1] !== 0) {
                    y = (rhs - coeficientes[0] * x) / coeficientes[1];
                    if (y >= 0) { // Garantir que y seja maior ou igual a 0
                        path += ` L ${x},${y}`;
                    }
                } else {
                    y = yMax; // Para coeficiente x2 = 0, continuamos na altura máxima definida
                    path += ` L ${x},${y}`;
                }
            }
            return path + ` L ${xMax},${yMax} Z`;
        } else {
            // Se tipo === '=', retorna apenas a linha, sem área sombreada
            let path = `M 0,0`;
            for (let x = 0; x <= xMax; x += 0.1) {
                let y;
                if (coeficientes[1] !== 0) {
                    y = (rhs - coeficientes[0] * x) / coeficientes[1];
                    if (y >= 0) { // Garantir que y seja maior ou igual a 0
                        path += ` L ${x},${y}`;
                    }
                } else {
                    y = rhs / coeficientes[0]; // Para coeficiente x2 = 0, calculamos y no eixo x1
                    if (y >= 0) { // Garantir que y seja maior ou igual a 0
                        path += ` L ${x},${y}`;
                    }
                }
            }
            return path;
        }
    }
});

$('#btnVoltar').on('click', function(){
    window.location = 'dashboard.html';
});