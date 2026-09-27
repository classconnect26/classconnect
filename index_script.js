const alunoId = localStorage.getItem('alunoId');
const professorId = localStorage.getItem('professorId');
const escolaId = localStorage.getItem('escolaId');
if (alunoId !== null) {
    window.location.href = 'menu_aluno.html';
}

if (professorId !== null) {
    window.location.href = 'menu_professor.html';
}

if (escolaId !== null) {
    window.location.href = 'menu_escola.html';
}