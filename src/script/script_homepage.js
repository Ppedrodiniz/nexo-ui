const token =
    localStorage.getItem("token");

const usuario = JSON.parse(
    localStorage.getItem("usuario")
);

console.log(usuario);

const usuarioId = usuario.id;

const msg_user = document.querySelector(".msg_user");

msg_user.innerText = `Bem vindo, ${usuario.nome}`;

fetch(`http://localhost:3000/contas/${usuarioId}`, {

    headers: {

        Authorization: `Bearer ${token}`

    }

})

.then(response => response.json())

.then(data => {

    console.log(data);

saldoReal =
Number(data.conta.saldo)
.toLocaleString('pt-BR', {

style: 'currency',
currency: 'BRL'

});

    saldo.innerText = saldoReal;

})

.catch(error => {

    console.error("Erro:", error);

});
// ========================= SALDO =========================

const saldo = document.getElementById("saldo");

const mostrarSaldo =
    document.getElementById("mostrarSaldo");

let saldoReal = "";

let saldoVisivel = true;


// ========================= MOSTRAR / ESCONDER SALDO =========================

mostrarSaldo.addEventListener("click", () => {

    if(saldoVisivel){

        saldo.innerText = "R$ --,--";

        mostrarSaldo.src =
        "/src/assets/icone_olho_fechado.png";

        saldoVisivel = false;

    } else {

        saldo.innerText = saldoReal;

        mostrarSaldo.src =
        "/src/assets/icone_olho_aberto.png";

        saldoVisivel = true;
    }

});


// ========================= PEGAR DADOS DO USUÁRIO =========================




// ========================= BUSCAR SALDO NA API =========================



    
    // ========================= FORMATAR SALDO =========================




    // ========================= COLOCAR NA TELA =========================

