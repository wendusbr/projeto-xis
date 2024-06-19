document.addEventListener("DOMContentLoaded", function() {
    // Recuperando os dados do localStorage
    const dadosString = localStorage.getItem('dados');
    const dados = JSON.parse(dadosString);
    
    gerarTabelaHTML(dados); // Location: pl.js
    simplexMethod(dados); // Location: pl.js

    $('#btnVoltar').on('click', function(){
        window.location = 'dashboard.html';
    });
});