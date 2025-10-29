// Dados
let atividades = JSON.parse(localStorage.getItem('atividades')) || [];
let projetos = JSON.parse(localStorage.getItem('projetos')) || [];
let voluntarios = JSON.parse(localStorage.getItem('voluntarios')) || [];
let totalDoacoes = parseFloat(localStorage.getItem('totalDoacoes')) || 0;
let logado = false;

// Elementos
const loginScreen = document.getElementById('login-screen');
const mainApp = document.getElementById('main-app');
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
const logoutBtn = document.getElementById('logout-btn');

// Navegação
function mostrarPagina(id) {
    pages.forEach(p => p.classList.remove('active'));
    navLinks.forEach(l => l.classList.remove('active'));
    document.querySelectorAll(`.nav-link`).forEach(link => {
        if (link.getAttribute('href') === `#${id}`) link.classList.add('active');
    });
    const page = document.getElementById(id);
    if (page) page.classList.add('active');
    atualizarEstatisticas();
}

// Login
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    if (user === 'admin' && pass === 'ong123') {
        logado = true;
        loginScreen.classList.remove('active');
        mainApp.classList.add('active');
        mostrarPagina('home');
        carregarDados();
    } else {
        alert('Credenciais inválidas. Tente: admin / ong123');
    }
});

// Logout
logoutBtn.addEventListener('click', () => {
    logado = false;
    mainApp.classList.remove('active');
    loginScreen.classList.add('active');
    document.getElementById('login-form').reset();
});

// Navegação
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const id = link.getAttribute('href').substring(1);
        if (logado) {
            mostrarPagina(id);
        }
    });
});

// Modais
function abrirModalDoacao() {
    const modal = document.getElementById('modal-doacao');
    modal.classList.add('active');
    document.getElementById('modal-form-doacao').onsubmit = (e) => {
        e.preventDefault();
        const valor = parseFloat(e.target[0].value);
        if (valor > 0) {
            totalDoacoes += valor;
            salvar('totalDoacoes', totalDoacoes);
            atualizarEstatisticas();
            alert(`Doação de R$${valor.toFixed(2)} recebida com sucesso!`);
            fecharModal('modal-doacao');
        }
    };
}

function abrirModalVoluntario() {
    const modal = document.getElementById('modal-voluntario');
    modal.classList.add('active');
    document.getElementById('modal-form-voluntario').onsubmit = (e) => {
        e.preventDefault();
        const nome = e.target[0].value;
        const habilidades = e.target[1].value;
        voluntarios.push({ nome, habilidades });
        salvar('voluntarios', voluntarios);
        atualizarListaVoluntarios();
        atualizarEstatisticas();
        alert('Inscrição realizada com sucesso!');
        fecharModal('modal-voluntario');
    };
}

function fecharModal(id) {
    document.getElementById(id).classList.remove('active');
}

// Salvar
function salvar(chave, dados) {
    localStorage.setItem(chave, JSON.stringify(dados));
}

// Atualizar Listas
function atualizarListaAtividades() {
    const lista = document.getElementById('lista-atividades');
    lista.innerHTML = '';
    atividades.forEach((a, i) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${a.descricao} <small>(${a.data})</small></span>
                        <button onclick="removerAtividade(${i})"><i class="fas fa-trash"></i></button>`;
        lista.appendChild(li);
    });
}

function atualizarListaProjetos() {
    const container = document.getElementById('lista-projetos');
    container.innerHTML = '';
    projetos.forEach((p, i) => {
        const card = document.createElement('div');
        card.className = 'projeto-card';
        card.innerHTML = `<h3>${p.nome}</h3><p>${p.descricao.substring(0, 100)}...</p> <!-- Resumo curto -->
                          <button class="btn-saiba-mais" onclick="saibaMaisProjeto(${i})"><i class="fas fa-info-circle"></i> Saiba Mais</button>
                          <button onclick="removerProjeto(${i})"><i class="fas fa-trash"></i></button>`;
        container.appendChild(card);
    });
}

window.saibaMaisProjeto = (i) => {
    const modal = document.getElementById('modal-saiba-mais');
    document.getElementById('saiba-mais-titulo').textContent = projetos[i].nome;
    document.getElementById('saiba-mais-descricao').textContent = projetos[i].descricao;
    modal.classList.add('active');
};

function atualizarListaVoluntarios() {
    const lista = document.getElementById('lista-voluntarios');
    lista.innerHTML = '';
    voluntarios.forEach((v, i) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${v.nome} - ${v.habilidades}</span>
                        <button onclick="removerVoluntario(${i})"><i class="fas fa-trash"></i></button>`;
        lista.appendChild(li);
    });
}

function atualizarEstatisticas() {
    document.getElementById('stat-projetos').textContent = projetos.length;
    document.getElementById('stat-doacoes').textContent = `R$${totalDoacoes.toFixed(2)}`;
    document.getElementById('stat-voluntarios').textContent = voluntarios.length;
    document.getElementById('total-doacoes').textContent = `R$${totalDoacoes.toFixed(2)}`;
}

// Função para criar partículas na aba de projetos
function criarParticulas() {
    const secao = document.getElementById('projetos');
    if (!secao) return;
    for (let i = 0; i < 20; i++) { // 20 partículas para efeito sutil
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particle.style.animationDuration = `${5 + Math.random() * 5}s`; // Velocidade variada
        secao.appendChild(particle);
    }
}

// Atualizar Lista Projetos (adicionar --index para delay sequencial)
function atualizarListaProjetos() {
    const container = document.getElementById('lista-projetos');
    container.innerHTML = '';
    projetos.forEach((p, i) => {
        const card = document.createElement('div');
        card.className = 'projeto-card';
        card.style.setProperty('--index', i); // Para delay na animação
        card.innerHTML = `<h3>${p.nome}</h3><p>${p.descricao.substring(0, 100)}...</p>
                        <button class="btn-saiba-mais" onclick="saibaMaisProjeto(${i})"><i class="fas fa-info-circle"></i> Saiba Mais</button>
                        <button onclick="removerProjeto(${i})"><i class="fas fa-trash"></i></button>`;
        container.appendChild(card);
    });
}

// Chamar partículas ao navegar para projetos
function mostrarPagina(id) {
    if (id === 'projetos') {
        criarParticulas(); // Adiciona partículas ao carregar a aba
    }
}

// Remoções
window.removerAtividade = (i) => { atividades.splice(i,1); salvar('atividades', atividades); atualizarListaAtividades(); };
window.removerProjeto = (i) => { projetos.splice(i,1); salvar('projetos', projetos); atualizarListaProjetos(); atualizarEstatisticas(); };
window.removerVoluntario = (i) => { voluntarios.splice(i,1); salvar('voluntarios', voluntarios); atualizarListaVoluntarios(); atualizarEstatisticas(); };

// Forms
document.getElementById('form-atividade').onsubmit = (e) => {
    e.preventDefault();
    const desc = document.getElementById('desc-atividade').value;
    const data = document.getElementById('data-atividade').value;
    atividades.push({ descricao: desc, data });
    salvar('atividades', atividades);
    atualizarListaAtividades();
    e.target.reset();
};

document.getElementById('form-projeto').onsubmit = (e) => {
    e.preventDefault();
    const nome = document.getElementById('nome-projeto').value;
    const desc = document.getElementById('desc-projeto').value;
    projetos.push({ nome, descricao: desc });
    salvar('projetos', projetos);
    atualizarListaProjetos();
    atualizarEstatisticas();
    e.target.reset();
};

document.getElementById('form-doacao').onsubmit = (e) => {
    e.preventDefault();
    const valor = parseFloat(document.getElementById('valor-doacao').value);
    if (valor > 0) {
        totalDoacoes += valor;
        salvar('totalDoacoes', totalDoacoes);
        atualizarEstatisticas();
        alert(`Doação de R$${valor.toFixed(2)} registrada!`);
        e.target.reset();
    }
};

document.getElementById('form-voluntario').onsubmit = (e) => {
    e.preventDefault();
    const nome = document.getElementById('nome-voluntario').value;
    const habilidades = document.getElementById('habilidades-voluntario').value;
    voluntarios.push({ nome, habilidades });
    salvar('voluntarios', voluntarios);
    atualizarListaVoluntarios();
    atualizarEstatisticas();
    e.target.reset();
};

// Inicialização
function carregarDados() {
    atualizarListaAtividades();
    atualizarListaProjetos();
    atualizarListaVoluntarios();
    atualizarEstatisticas();
}

// Fechar modal com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
    }
});