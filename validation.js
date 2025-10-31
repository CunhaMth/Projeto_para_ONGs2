export function validateForm(form) {
    const required = form.querySelectorAll('[required]');
    let valid = true;
    required.forEach(field => {
        if (!field.value.trim()) {
            valid = false;
            field.style.borderColor = 'var(--danger)';
        } else {
            field.style.borderColor = 'var(--border)';
        }
    });
    return valid;
}

export function formatCPF(input) {
    let v = input.value.replace(/\D/g, '');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    input.value = v;
}

export function formatTelefone(input) {
    let v = input.value.replace(/\D/g, '');
    v = v.replace(/^(\d{2})(\d)/, '($1) $2');
    v = v.replace(/(\d{5})(\d)/, '$1-$2');
    input.value = v;
}

export function formatCEP(input) {
    let v = input.value.replace(/\D/g, '');
    v = v.replace(/^(\d{5})(\d)/, '$1-$2');
    input.value = v;
}