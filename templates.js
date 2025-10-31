export function createProjetoCard(projeto, index) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
        <img src="${projeto.imagem}" alt="${projeto.nome}">
        <h3>${projeto.nome}</h3>
        <p>${projeto.descricao}</p>
        <a href="#" class="btn-secondary" data-index="${index}">Saiba Mais</a>
    `;
    return card;
}

export function renderProjetos() {
    const grid = document.getElementById('projetos-grid');
    grid.innerHTML = '';
    const projetos = getData('projetos');
    projetos.forEach((projeto, index) => {
        grid.appendChild(createProjetoCard(projeto, index));
    });
}

export function createAtividadeItem(atividade) {
    const li = document.createElement('li');
    li.textContent = `${atividade.descricao} - ${atividade.data}`;
    return li;
}

export function renderAtividades() {
    const list = document.getElementById('lista-atividades');
    list.innerHTML = '';
    getData('atividades').forEach(atividade => {
        list.appendChild(createAtividadeItem(atividade));
    });
}