let currentScreen = "inicio";
let showBalance = true;
let isEditing = false;
let userData = { ...appData.usuario };
let cotacoes = { ...appData.cotacoes };
let selectedLoan = null;
let cotacoesLoading = true;
let cotacoesError = false;

// Buscar cotações reais da API
async function fetchCotacoes() {
  try {
    cotacoesLoading = true;
    cotacoesError = false;

    // Buscar Dólar
    const responseDolar = await fetch(
      "https://economia.awesomeapi.com.br/json/last/USD-BRL",
    );
    const dataDolar = await responseDolar.json();

    // Buscar Euro
    const responseEuro = await fetch(
      "https://economia.awesomeapi.com.br/json/last/EUR-BRL",
    );
    const dataEuro = await responseEuro.json();

    // Atualizar cotações
    if (dataDolar.USDBRL) {
      cotacoes.dolar.compra = parseFloat(dataDolar.USDBRL.bid);
      cotacoes.dolar.venda = parseFloat(dataDolar.USDBRL.ask);
      cotacoes.dolar.variacao = parseFloat(dataDolar.USDBRL.pctChange);
    }

    if (dataEuro.EURBRL) {
      cotacoes.euro.compra = parseFloat(dataEuro.EURBRL.bid);
      cotacoes.euro.venda = parseFloat(dataEuro.EURBRL.ask);
      cotacoes.euro.variacao = parseFloat(dataEuro.EURBRL.pctChange);
    }

    cotacoesLoading = false;

    // Atualizar tela se estiver em cotações
    if (currentScreen === "cotacoes") {
      render();
    }
  } catch (error) {
    console.error("Erro ao buscar cotações:", error);
    cotacoesLoading = false;
    cotacoesError = true;

    if (currentScreen === "cotacoes") {
      render();
    }
  }
}

// Buscar cotações ao iniciar
fetchCotacoes();

// Atualizar cotações a cada 30 segundos
setInterval(() => {
  fetchCotacoes();
}, 30000);

function navigate(screen) {
  currentScreen = screen;
  render();
}

function toggleBalance() {
  showBalance = !showBalance;
  renderInicio();
}

function toggleEdit() {
  isEditing = !isEditing;
  renderPerfil();
}

function saveProfile() {
  const nome = document.getElementById("input-nome").value;
  const endereco = document.getElementById("input-endereco").value;
  const rendaMensal = parseFloat(document.getElementById("input-renda").value);

  userData.nome = nome;
  userData.endereco = endereco;
  userData.rendaMensal = rendaMensal;

  isEditing = false;
  renderPerfil();
}

function toggleLoan(loanId) {
  selectedLoan = selectedLoan === loanId ? null : loanId;
  renderEmprestimo();
}

function renderInicio() {
  const primeiroNome = userData.nome.split(" ")[0];

  return `
    <div class="screen">
      <div class="header-gradient">
        <div class="user-welcome">
          <div class="user-avatar-small">👤</div>
          <p class="user-welcome-text">Bem vindo ${primeiroNome}!</p>
        </div>

        <div class="balance-card">
          <div class="balance-header">
            <span class="balance-label">💰 Saldo em Conta</span>
            <button class="header-action" onclick="toggleBalance()">
              ${showBalance ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
          <p class="balance-amount">
            ${showBalance ? `R$ ${userData.saldo.toFixed(2)}` : "R$ •••••"}
          </p>
        </div>

        <button class="cards-button" onclick="navigate('cartoes')">
          <span>💳</span>
          <span style="color: #374151;">Meus Cartões</span>
        </button>
      </div>

      <div class="shortcuts-container">
        <div class="shortcuts-grid">
          <div class="shortcut-item" onclick="navigate('boleto')">
            <div class="shortcut-icon">📊</div>
            <span class="shortcut-label">Boleto</span>
          </div>
          <div class="shortcut-item" onclick="navigate('extrato')">
            <div class="shortcut-icon">📄</div>
            <span class="shortcut-label">Extrato</span>
          </div>
          <div class="shortcut-item" onclick="navigate('emprestimo')">
            <div class="shortcut-icon">💵</div>
            <span class="shortcut-label">Empréstimo</span>
          </div>
          <div class="shortcut-item" onclick="navigate('cotacoes')">
            <div class="shortcut-icon">📈</div>
            <span class="shortcut-label">Cotações</span>
          </div>
        </div>
      </div>

      <div class="bottom-nav">
        <div class="nav-indicator"></div>
        <button class="nav-button" onclick="navigate('perfil')">👤</button>
        <button class="nav-button">📄</button>
      </div>
    </div>
  `;
}

function renderPerfil() {
  return `
    <div class="screen">
      <div class="header-gradient">
        <div class="header-top">
          <button class="header-back" onclick="navigate('inicio')">←</button>
          <h1 class="header-title">Meu Perfil</h1>
          <button class="header-action" onclick="${isEditing ? "saveProfile()" : "toggleEdit()"}">
            ${isEditing ? "💾" : "✏️"}
          </button>
        </div>

        <div class="profile-avatar-container">
          <div class="profile-avatar">
            <div class="profile-avatar-circle">👤</div>
            ${isEditing ? '<button class="profile-camera-btn">📷</button>' : ""}
          </div>
        </div>
      </div>

      <div class="profile-section">
        <div class="form-group">
          <label class="form-label">Nome Completo</label>
          <input
            type="text"
            class="form-input"
            id="input-nome"
            value="${userData.nome}"
            ${!isEditing ? "disabled" : ""}
          />
        </div>

        <div class="form-group">
          <label class="form-label">Endereço</label>
          <textarea
            class="form-textarea"
            id="input-endereco"
            ${!isEditing ? "disabled" : ""}
          >${userData.endereco}</textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Renda Mensal</label>
          <input
            type="number"
            class="form-input"
            id="input-renda"
            value="${userData.rendaMensal}"
            ${!isEditing ? "disabled" : ""}
          />
        </div>

        <div class="account-info-card">
          <p class="account-info-title">Dados da Conta</p>
          <p class="account-info-item">Agência: ${userData.agencia}</p>
          <p class="account-info-item">Conta: ${userData.conta}</p>
          <p class="account-info-item">CPF: ${userData.cpf}</p>
        </div>
      </div>
    </div>
  `;
}

function renderCotacoes() {
  const now = new Date();
  const horaAtual = now.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `
    <div class="screen">
      <div class="header-gradient">
        <div class="header-top">
          <button class="header-back" onclick="navigate('inicio')">←</button>
          <h1 class="header-title">Cotações</h1>
          <button class="header-action" onclick="fetchCotacoes()" ${cotacoesLoading ? "disabled" : ""}>
            🔄
          </button>
        </div>

        <p class="updated-text">Atualizado às ${horaAtual}</p>
      </div>

      <div class="profile-section">
        ${
          cotacoesError
            ? `
          <div class="info-box" style="background: #fee2e2; border-color: #fca5a5;">
            <p style="color: #991b1b;">❌ Erro ao carregar cotações. Verifique sua conexão com a internet.</p>
          </div>
        `
            : ""
        }
        
        ${
          cotacoesLoading
            ? `
          <div class="info-box">
            <p style="text-align: center;">⏳ Carregando cotações em tempo real...</p>
          </div>
        `
            : ""
        }
        
        <div class="cotacao-card">
          <div class="cotacao-header">
            <div class="cotacao-info">
              <div class="cotacao-icon dolar">💵</div>
              <div>
                <h3 class="cotacao-name">Dólar Americano</h3>
                <p class="cotacao-symbol">USD/BRL</p>
              </div>
            </div>
            <div class="cotacao-variacao ${cotacoes.dolar.variacao >= 0 ? "positive" : "negative"}">
              <span>${cotacoes.dolar.variacao >= 0 ? "📈" : "📉"}</span>
              <span>${Math.abs(cotacoes.dolar.variacao).toFixed(2)}%</span>
            </div>
          </div>
          <div class="cotacao-values">
            <div class="cotacao-value-box">
              <p class="cotacao-value-label">Compra</p>
              <p class="cotacao-value-amount">R$ ${cotacoes.dolar.compra.toFixed(2)}</p>
            </div>
            <div class="cotacao-value-box">
              <p class="cotacao-value-label">Venda</p>
              <p class="cotacao-value-amount">R$ ${cotacoes.dolar.venda.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div class="cotacao-card">
          <div class="cotacao-header">
            <div class="cotacao-info">
              <div class="cotacao-icon euro">💶</div>
              <div>
                <h3 class="cotacao-name">Euro</h3>
                <p class="cotacao-symbol">EUR/BRL</p>
              </div>
            </div>
            <div class="cotacao-variacao ${cotacoes.euro.variacao >= 0 ? "positive" : "negative"}">
              <span>${cotacoes.euro.variacao >= 0 ? "📈" : "📉"}</span>
              <span>${Math.abs(cotacoes.euro.variacao).toFixed(2)}%</span>
            </div>
          </div>
          <div class="cotacao-values">
            <div class="cotacao-value-box">
              <p class="cotacao-value-label">Compra</p>
              <p class="cotacao-value-amount">R$ ${cotacoes.euro.compra.toFixed(2)}</p>
            </div>
            <div class="cotacao-value-box">
              <p class="cotacao-value-label">Venda</p>
              <p class="cotacao-value-amount">R$ ${cotacoes.euro.venda.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div class="info-box">
          <p>💡 As cotações são atualizadas em tempo real e podem variar conforme o mercado.</p>
        </div>
      </div>
    </div>
  `;
}

function renderEmprestimo() {
  const limiteDisponivel = userData.rendaMensal * 0.3;

  return `
    <div class="screen">
      <div class="header-gradient">
        <div class="header-top">
          <button class="header-back" onclick="navigate('inicio')">←</button>
          <h1 class="header-title">Empréstimos</h1>
          <div style="width: 40px;"></div>
        </div>

        <div class="emprestimo-limit">
          <p class="emprestimo-limit-label">Limite disponível baseado na sua renda</p>
          <p class="emprestimo-limit-amount">R$ ${limiteDisponivel.toFixed(2)}</p>
        </div>
      </div>

      <div class="profile-section">
        ${appData.emprestimos
          .map(
            (emp) => `
          <div class="loan-card" onclick="toggleLoan(${emp.id})">
            <div class="loan-header ${emp.tipo}">
              <div class="loan-header-left">
                <span class="loan-icon">${emp.icone}</span>
                <div>
                  <h3 class="loan-name">${emp.nome}</h3>
                  <p class="loan-approval">Aprovação: ${emp.aprovacao}</p>
                </div>
              </div>
              <span style="color: white;">${selectedLoan === emp.id ? "▼" : "▶"}</span>
            </div>

            <div class="loan-body">
              <div class="loan-info-row">
                <div class="loan-info-label">
                  <span>💵</span>
                  <span>Valor disponível</span>
                </div>
                <p class="loan-info-value">R$ ${emp.valor.toLocaleString("pt-BR")}</p>
              </div>

              <div class="loan-info-row">
                <div class="loan-info-label">
                  <span>📅</span>
                  <span>Parcelas</span>
                </div>
                <p class="loan-info-value">${emp.parcelas}x</p>
              </div>

              <div class="loan-info-row">
                <div class="loan-info-label">
                  <span>%</span>
                  <span>Taxa mensal</span>
                </div>
                <p class="loan-info-value">${emp.taxa}% a.m.</p>
              </div>

              ${
                selectedLoan === emp.id
                  ? `
                <div class="loan-details">
                  <div class="loan-installment-box">
                    <p class="loan-installment-label">Valor da parcela</p>
                    <p class="loan-installment-value">R$ ${emp.parcelaValor.toFixed(2)}</p>
                  </div>

                  <button class="loan-button ${emp.tipo}">
                    Solicitar Empréstimo
                  </button>

                  <p class="loan-disclaimer">* Sujeito a análise de crédito</p>
                </div>
              `
                  : ""
              }
            </div>
          </div>
        `,
          )
          .join("")}

        <div class="info-box">
          <p>💡 Os valores são calculados com base na sua renda mensal de R$ ${userData.rendaMensal.toFixed(2)}. As taxas e condições podem variar conforme análise de crédito.</p>
        </div>
      </div>
    </div>
  `;
}

function render() {
  const app = document.getElementById("app");
  let content = "";

  switch (currentScreen) {
    case "inicio":
      content = renderInicio();
      break;
    case "perfil":
      content = renderPerfil();
      break;
    case "cotacoes":
      content = renderCotacoes();
      break;
    case "emprestimo":
      content = renderEmprestimo();
      break;
    default:
      content = renderInicio();
  }

  app.innerHTML = content;
}

// Inicializar app
document.addEventListener("DOMContentLoaded", () => {
  render();
});
