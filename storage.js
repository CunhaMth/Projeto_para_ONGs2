export function getData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

export function saveData(key, item) {
    const data = getData(key);
    data.push(item);
    localStorage.setItem(key, JSON.stringify(data));
    updateStats();
}

export function updateStats() {
    document.getElementById('stat-projetos').textContent = getData('projetos').length;
    const doacoes = getData('doacoes').reduce((sum, d) => sum + d.valor, 0);
    document.getElementById('stat-doacoes').textContent = `R$${doacoes.toFixed(2)}`;
    document.getElementById('stat-voluntarios').textContent = getData('voluntarios').length;
}