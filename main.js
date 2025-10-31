import { getData, saveData, updateStats } from './storage.js';
import { renderProjetos, renderAtividades } from './templates.js';
import { validateForm, formatCPF, formatTelefone, formatCEP } from './validation.js';

// SPA Navigation
function navigateTo(sectionId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    document.querySelectorAll('.btn-nav').forEach(link => link.classList.remove('active'));
    document.querySelector(`.btn-nav[href="#${sectionId}"]`).classList.add('active');

    if (sectionId === 'projetos') renderProjetos();
    if (sectionId === 'dashboard') renderAtividades();
    updateStats();
}

document.querySelectorAll('.btn-nav').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        navigateTo(link.getAttribute('href').slice(1));
    });
});

// Login (simulado)
document.getElementById('login-form').addEventListener('submit', e => {
    e.preventDefault();
    if (document.getElementById('username').value === 'admin' && document.getElementById('password').value === 'ong123') {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        navigateTo('inicio');
    } else {
        alert('Credenciais inválidas!');
    }
});

// Cadastro Voluntário
const cadastroForm = document.getElementById('cadastro-form');
cadastroForm.querySelector('[name="cpf"]').addEventListener('input', e => formatCPF(e.target));
cadastroForm.querySelector('[name="telefone"]').addEventListener('input', e => formatTelefone(e.target));
cadastroForm.querySelector('[name="cep"]').addEventListener('input', e => formatCEP(e.target));
cadastroForm.querySelector('[name="cep"]').addEventListener('blur', e => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(res => res.json())
            .then(data => {
                if (!data.erro) {
                    cadastroForm.querySelector('[name="endereco"]').value = data.logradouro;
                    cadastroForm.querySelector('[name="cidade"]').value = data.localidade;
                    cadastroForm.querySelector('[name="estado"]').value = data.uf;
                }
            });
    }
});
cadastroForm.addEventListener('submit', e => {
    e.preventDefault();
    if (validateForm(e.target)) {
        const formData = new FormData(e.target);
        const voluntario = Object.fromEntries(formData);
        saveData('voluntarios', voluntario);
        alert('Cadastro enviado com sucesso!');
        e.target.reset();
        navigateTo('inicio');
    }
});

// Atividades
document.getElementById('form-atividade').addEventListener('submit', e => {
    e.preventDefault();
    if (validateForm(e.target)) {
        const atividade = {
            descricao: document.getElementById('desc-atividade').value,
            data: document.getElementById('data-atividade').value
        };
        saveData('atividades', atividade);
        e.target.reset();
        renderAtividades();
    }
});

// Projetos iniciais (exemplos estáticos para seed)
if (getData('projetos').length === 0) {
    saveData('projetos', { nome: 'Alimentação Solidária', descricao: 'Distribuição de cestas básicas.', imagem: 'https://www.wfpusa.org/wp-content/uploads/2023/06/Angela_Brazil_Mastercard-e1648664491702.jpg' });
    saveData('projetos', { nome: 'Educação para Todos', descricao: 'Aulas de reforço.', imagem: 'https://www.readingrockets.org/sites/default/files/styles/card_image_mobile_1x/public/2023-04/read-for-the-record_0.jpg?itok=MkY1vC3Z' });
    saveData('projetos', { nome: 'Saúde na Comunidade', descricao: 'Atendimentos médicos gratuitos.', imagem: 'https://www.ferris.edu/news/archive/2023/april/images/ferris-state-nursing-hero.jpg' });
}

// Saiba Mais (modal)
document.addEventListener('click', e => {
    if (e.target.classList.contains('btn-secondary')) {
        e.preventDefault();
        const index = e.target.dataset.index;
        const projeto = getData('projetos')[index];
        document.getElementById('saiba-mais-titulo').textContent = projeto.nome;
        document.getElementById('saiba-mais-descricao').textContent = projeto.descricao;
        document.getElementById('modal-saiba-mais').classList.add('active');
    }
});

// Modais genéricos
document.querySelectorAll('.close').forEach(close => {
    close.addEventListener('click', () => close.parentElement.parentElement.classList.remove('active'));
});

// Doação Modal
document.querySelector('.btn-hero.primary').addEventListener('click', () => document.getElementById('modal-doacao').classList.add('active'));
document.getElementById('modal-form-doacao').addEventListener('submit', e => {
    e.preventDefault();
    if (validateForm(e.target)) {
        const doacao = { valor: parseFloat(e.target.querySelector('input').value) };
        saveData('doacoes', doacao);
        alert('Doação confirmada!');
        e.target.reset();
        document.getElementById('modal-doacao').classList.remove('active');
    }
});

// Voluntário Modal
document.querySelector('.btn-hero.secondary').addEventListener('click', () => document.getElementById('modal-voluntario').classList.add('active'));
document.getElementById('modal-form-voluntario').addEventListener('submit', e => {
    e.preventDefault();
    if (validateForm(e.target)) {
        const voluntario = {
            nome: e.target.querySelectorAll('input')[0].value,
            habilidades: e.target.querySelectorAll('input')[1].value
        };
        saveData('voluntarios', voluntario);
        alert('Inscrição confirmada!');
        e.target.reset();
        document.getElementById('modal-voluntario').classList.remove('active');
    }
});

// Inicialização
updateStats();
renderProjetos();
renderAtividades();

// Partículas (de projetos.html e cadastro.html)
function criarParticulas() {
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        document.body.appendChild(particle);
    }
}
criarParticulas();