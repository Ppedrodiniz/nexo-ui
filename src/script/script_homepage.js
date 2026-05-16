fetch("https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,BRL-USD")
.then(response => response.json())
.then(data => {

    // DÓLAR
    const usd = data.USDBRL;

    document.getElementById("usdValor").innerText =
        `R$ ${Number(usd.bid).toFixed(2)}`;

    const usdVariacao =
        document.getElementById("usdVariacao");

    if(Number(usd.pctChange) >= 0){
        usdVariacao.innerText = "↑";
        usdVariacao.classList.add("alta");
    } else{
        usdVariacao.innerText = "↓";
        usdVariacao.classList.add("baixa");
    }

    // EURO
    const eur = data.EURBRL;

    document.getElementById("eurValor").innerText =
        `R$ ${Number(eur.bid).toFixed(2)}`;

    const eurVariacao =
        document.getElementById("eurVariacao");

    if(Number(eur.pctChange) >= 0){
        eurVariacao.innerText = "↑";
        eurVariacao.classList.add("alta");
    } else{
        eurVariacao.innerText = "↓";
        eurVariacao.classList.add("baixa");
    }

    // REAL
    const brl = data.BRLUSD;

    document.getElementById("brlValor").innerText =
        `US$ ${Number(brl.bid).toFixed(2)}`;

    const brlVariacao =
        document.getElementById("brlVariacao");

    if(Number(brl.pctChange) >= 0){
        brlVariacao.innerText = "↑";
        brlVariacao.classList.add("alta");
    } else{
        brlVariacao.innerText = "↓";
        brlVariacao.classList.add("baixa");
    }

})
.catch(error => {
    console.error(error);
});