document.addEventListener("DOMContentLoaded", function() {
    // Recuperando os dados do localStorage
    const dadosString = localStorage.getItem('dados');
    const dados = JSON.parse(dadosString);

    gerarTabelaHTML(dados);

    // Preparando estruturas de dados para Plotly
    const traces = [];
    const shapes = [];

    // Iterando sobre as restrições para criar os traces (linhas no gráfico)
    dados.restricoes.forEach(function(restricao, index) {
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
        for (let x = 0; x <= 5 * rhs; x += 0.1) {
            const y = (rhs - coeficientes[0] * x) / coeficientes[1];
            trace.x.push(x);
            trace.y.push(y);
        }

        traces.push(trace);

        // Adicionar shapes para áreas sombreadas
        const shape = {
            type: 'path',
            path: getPath(coeficientes, rhs), // Função para obter o caminho do shape
            fillcolor: 'rgba(0, 0, 255, 0.2)', // Cor e opacidade da área sombreada
            line: {
                width: 0 // Sem linha de contorno do shape
            }
        };

        shapes.push(shape);
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
            range: [0, 5 * Math.max(...dados.restricoes.map(r => r[r.length - 1]))], // Ajustar limite do eixo x
            dtick: 10, // Incremento de 10 no eixo x
            zeroline: false, // Remover linha do zero
            ticksuffix: '', // Remover o sinal de menos dos ticks negativos
            showline: true, // Mostrar linha do eixo x
            showgrid: true // Mostrar grid do eixo x
        },
        yaxis: {
            title: 'X2',
            range: [0, 5 * Math.max(...dados.restricoes.map(r => r[r.length - 1]))], // Ajustar limite do eixo y
            dtick: 10, // Incremento de 10 no eixo y
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

    // Plotar o gráfico usando Plotly
    Plotly.newPlot('myPlot', traces, layout);

    // Função para encontrar interseção entre duas restrições
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

    // Função para obter cor aleatória
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Função para obter o caminho do shape da área sombreada
    function getPath(coeficientes, rhs) {
        const xMax = 5 * rhs;
        let path = `M 0,0`;

        if (coeficientes[1] !== 0) {
            const yMin = (rhs - coeficientes[0] * 0) / coeficientes[1];
            path += ` L 0,${yMin}`;
        }

        for (let x = 0; x <= xMax; x += 0.1) {
            const y = (rhs - coeficientes[0] * x) / coeficientes[1];
            path += ` L ${x},${y}`;
        }

        path += ` L ${xMax},0 Z`;

        return path;
    }
});

