const saldo = document.getElementById("saldo");
const mostrarSaldo = document.getElementById("mostrarSaldo");
const saldoReal = "R$ 1.000,00"
let saldoVisivel = true;

mostrarSaldo.addEventListener("click",() => {
    if(saldoVisivel){
        saldo.innerText = "--,--";
        mostrarSaldo.src = "/src/assets/icone_olho_fechado.png";
        saldoVisivel = false;
    }

    else{
        saldo.innerText = saldoReal;
        mostrarSaldo.src = "/src/assets/icone_olho_aberto.png";
        saldoVisivel = true;
    }
})