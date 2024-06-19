$(document).ready(() =>{
    // localStorage.clear();
    $("#gerarTabela").on('click', function (){

        var tabelaDinamica = "<table id='modelagemTabelar' class='table table-bordered nowrap mb-4 mt-1'>";

        //-------------Cabeçalho-------------//
        tabelaDinamica += "<thead><tr><th scope='col'>&nbsp;</th>";
        
            for (var i = 1; i <= $('#numVariavel').val() ; i++) {
                tabelaDinamica += "<th scope='col'>x"+ i +"</th>";
            }

        tabelaDinamica += "<th scope='col'>&lt;&gt;=</th><th scope='col'>RSH</th></tr></thead><tbody id='conteudoTabela'>";

        //-------------Tipo de problema (max-min)-------------//

        tabelaDinamica += "<tr id='tipoDeProblema'><td scope='col'>";
            tabelaDinamica += '<select id="min-max" class="form-select text-center" aria-label="Small select example">';
            tabelaDinamica += '<option selected>Tipo de problema</option>';
            tabelaDinamica += '<option value="1">Maximização</option>';
            tabelaDinamica += '<option value="2">Minimização</option>';
            tabelaDinamica += '</select>';
        tabelaDinamica += "</td>";
        
        for (var i = 1; i <= $('#numVariavel').val() ; i++) {
            tabelaDinamica += "<td scope='col'>";
                tabelaDinamica += '<input style="border: none;" type="number" class="form-control" data-id="Z-x'+ i+'" id="Z-x'+ i+'" aria-describedby="basic-addon3 basic-addon4" maxlength="8"></input>';
            tabelaDinamica += "</td>";
        }

        tabelaDinamica += "<td scope='col'></td><td scope='col'></td></tr>";

        //--------------------------MODELAGEM----------------------------//
        for (var i = 1; i <= $('#numRestricao').val() ; i++) {
            tabelaDinamica += "<tr>";
            
            //Valores das variáveis
            for(var j = 0; j <= $('#numVariavel').val() ; j++){
                tabelaDinamica +=  "<td>";
                tabelaDinamica += (j != 0 ? '<input style="border: none;" type="number" class="form-control" data-id="val' + i + j + '" id="r' + i +'x' + j + '" aria-describedby="basic-addon3 basic-addon4" maxlength="8"></input>' : 'Restrição ' + i);
                tabelaDinamica += "</td>";
            }

            //Tipo de restrição
            tabelaDinamica +=  "<td>";
                tabelaDinamica += '<select id="r'+ i + '" class="form-select text-center" aria-label="Small select example">';
                    tabelaDinamica += '<option value="1" selected>&lt;=</option>';
                    // tabelaDinamica += '<option value="2">&lt;</option>';
                    tabelaDinamica += '<option value="3">&gt;=</option>';
                    // tabelaDinamica += '<option value="4">&gt;</option>';
                    tabelaDinamica += '<option value="5">=</option>';
                tabelaDinamica += '</select>';
            tabelaDinamica +=  "</td>";

            //RSH
            tabelaDinamica +=  "<td>";
            tabelaDinamica += '<input style="border: none;" type="number" class="form-control" data-id="RSH' + i+ '" id="RSH'+ i +'" aria-describedby="basic-addon3 basic-addon4" maxlength="8"></input>';
            tabelaDinamica +=  "</td>";

            tabelaDinamica += "</tr>";
        }

        //--------------------------Limites----------------------------//
        tabelaDinamica += "<tr id='limiteSuperior'>";
        tabelaDinamica += "<td>Limites Superiores</td>"
            for(var j = 1; j <= $('#numVariavel').val() ; j++){
                tabelaDinamica +=  "<td>" +
                '<input disabled style="border: none;" type="text" class="form-control" data-id="limSuperior" id="limSuperiorX'+ j+ '" aria-describedby="basic-addon3 basic-addon4" maxlength="8" value="Inf"></input>' +
                "</td>";
            }
        tabelaDinamica += "<td></td><td></td>" +
        "</tr>";

        tabelaDinamica += "<tr id='limiteInferior'>" +
        "<td>Limites Inferiores</td>";
            for(var j = 1; j <= $('#numVariavel').val() ; j++){
                tabelaDinamica +=  "<td>" +
                '<input disabled style="border: none;" type="number" class="form-control" data-id="limInferior" id="limInferiorX'+ j+ '" aria-describedby="basic-addon3 basic-addon4" maxlength="8" value="0"></input>' +
                "</td>";
            }
        tabelaDinamica += "<td></td><td></td>" +
        "</tr>";

        tabelaDinamica += "</tbody></table>";
        $('#inputTabela').html(tabelaDinamica);

        $('.menu li a').removeClass('active');
        $('.menu li a').removeClass('disabled');
        $('.menu li').removeAttr('style');
        
        handleMenuClick();
        atualizarDisponibilidadeMetodoGrafico();
    });

    // Chamada inicial
    handleMenuClick();
    atualizarDisponibilidadeMetodoGrafico();

    $("#gerarSolucao").on('click', function () {
        var numVariaveis = parseInt($('#numVariavel').val());
        var numRestricoes = parseInt($('#numRestricao').val());
    
        var tipoProblema = $("#min-max").val() === "2" ? "min" : "max";
    
        // Verificar se todos os campos de Z estão preenchidos
        var z = [];
        var zPreenchido = true;
        for (var i = 1; i <= numVariaveis; i++) {
            var valorZ = parseFloat($("#Z-x" + i).val());
            if (isNaN(valorZ)) {
                zPreenchido = false;
                break;
            }
            z.push(valorZ);
        }
    
        // Verificar se todos os campos de restrição estão preenchidos
        var restricoesPreenchidas = true;
        var restricoes = [];
        for (var i = 1; i <= numRestricoes; i++) {
            var restricao = [];
            for (var j = 1; j <= numVariaveis; j++) {
                var valorRestricao = parseFloat($("#r" + i + "x" + j).val());
                if (isNaN(valorRestricao)) {
                    restricoesPreenchidas = false;
                    break;
                }
                restricao.push(valorRestricao);
            }
            var tipoRestricao = $("#r" + i).val();
            if (!restricoesPreenchidas) break; // Se já não estiver preenchido, sair do loop
    
            if (tipoRestricao === "1") {
                restricao.unshift("<=");
            } else if (tipoRestricao === "2") {
                restricao.unshift("<");
            } else if (tipoRestricao === "3") {
                restricao.unshift(">=");
            } else if (tipoRestricao === "4") {
                restricao.unshift(">");
            } else if (tipoRestricao === "5") {
                restricao.unshift("=");
            }
    
            var valorRSH = parseFloat($("#RSH" + i).val());
            if (isNaN(valorRSH)) {
                restricoesPreenchidas = false;
                break;
            }
            restricao.push(valorRSH);
    
            restricoes.push(restricao);
        }
    
        // Verificar se todos os campos foram preenchidos corretamente
        if (!zPreenchido || !restricoesPreenchidas) {
            alert('Por favor, preencha todos os campos corretamente antes de gerar a solução.');
            return;
        }
    
        // Objeto final no formato desejado
        var novoObjeto = {
            numVariaveis: numVariaveis,
            numRestricoes: numRestricoes,
            tipo: tipoProblema,
            z: z,
            restricoes: restricoes
        };
    
        // Verifica qual método está ativo e executa a função correspondente
        const activeElements = $('.menu li a.active');
        if (activeElements.length === 0) {
            alert('Nenhum método selecionado.\nPor favor, selecione um método para gerar a solução.');
            return;
        }
    
        debugger;
        if ((activeElements.attr('id') == "a2") && (numVariaveis === 2) && !($('#lin2').hasClass('disabled'))) {
            EnviarParaMetodoGrafico(novoObjeto);
        } else if (activeElements.attr('id') == "a3") {
            EnviarParaMetodoTabular(novoObjeto);
        } else if (activeElements.attr('id') == "a1") {
            console.log('Novo objeto:', novoObjeto);
        } else {
            alert('Método selecionado inválido!\nTente novamente');
        }
    });
    
    $('.menu li a').click(function(event) {
        handleMenuClick();
        atualizarDisponibilidadeMetodoGrafico();
    });

    // Evento de clique no método gráfico
    $('#a2').click(function(event) {
        if ($(this).parent().hasClass('disabled')) {
            event.preventDefault();
            alert('A opção Gráfico não está disponível quando há mais de 2 variáveis.');
        }
    });
  });
  

//----------------------------------------------------------ENVIO-----------------------------------------------------------


function EnviarParaMetodoTabular(dados){
  localStorage.setItem('dados', JSON.stringify(dados));
  window.location.href = 'resolution.html';
}


function EnviarParaMetodoGrafico(dados){
    localStorage.setItem('dados', JSON.stringify(dados));
    window.location.href = 'graphical.html';
}
//----------------------------------------------------------STYLE-----------------------------------------------------------

// Função para manipular cliques nos itens do menu
function handleMenuClick() {
    const activeViewClass = 'active';
    const disabledClass = 'disabled';

    $('.menu li a').click(function(event) {
        event.preventDefault();

        const clickedElementId = $(this).attr('id');
        // Verificar se o elemento clicado é "Gráfico" e se o número de variáveis é 3
        if (clickedElementId === 'a2' && $('#numVariavel').val() == 3) {
            // Desativar a opção "Gráfico" visualmente e logicamente
            $(this).parent().addClass(disabledClass);
            $("#a2").removeClass(activeViewClass);
            $('#a2').removeAttr('style');
            $(this).css({
                'background-color': '#f2f2f2',
                'color': '#bbb',
                'text-shadow': 'none',
                'font-weight': 'normal',
                'font-size': '15px'
            });

            // Remover classe ativa de todos os elementos do menu
            $('.menu li a').removeClass(activeViewClass);

            return; // Sair da função após desativar "Gráfico"
        }

        // Remover classes ativas de todos os elementos do menu
        $('.menu li a').removeClass(activeViewClass);
        $('.menu li').removeAttr('style');

        // Verificar se o elemento está desabilitado
        if (!$(this).parent().hasClass(disabledClass)) {
            $(this).addClass(activeViewClass);

            // Estilizar o elemento clicado
            const clickedElementIdWithoutHash = clickedElementId.slice(1);
            const clickedElement = $('#lin' + clickedElementIdWithoutHash);
            clickedElement.css({
                'background-color': '#920686',
                'color': 'black',
                'text-shadow': '0px 0px 5px #fff',
                'font-weight': 'bold',
                'font-size': '15px'
            });
        } else {
            // Adicionar classe disabled e estilos específicos ao elemento pai (li)
            $(this).parent().addClass(disabledClass);

            // Remover classe active do elemento clicado
            $(this).removeClass(activeViewClass);

            // Estilizar o elemento clicado quando desabilitado
            $(this).css({
                'background-color': '#f2f2f2',
                'color': '#bbb',
                'text-shadow': 'none',
                'font-weight': 'normal',
                'font-size': '15px'
            });
        }
    });
}

// Função para atualizar a disponibilidade do método gráfico
function atualizarDisponibilidadeMetodoGrafico() {
    var numVariaveis = parseInt($('#numVariavel').val());
    if (numVariaveis > 2) {
        $('#a2').parent().addClass('disabled');
    } else {
        $('#a2').parent().removeClass('disabled');
        $('#a2').removeAttr('style');
    }
}