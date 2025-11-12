// js/login.js
document.getElementById("form-login")?.addEventListener("submit", function(e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  
  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
  const usuario = usuarios.find(u => u.email === email && u.senha === senha);
  
  if (usuario) {
    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
    window.location.href = "perfil.html";
  } else {
    alert("E-mail ou senha incorretos");
  }
});

document.getElementById("mostrar-cadastro")?.addEventListener("click", () => {
  document.getElementById("form-login").style.display = "none";
  document.getElementById("form-cadastro").style.display = "block";
});

document.getElementById("form-cadastro")?.addEventListener("submit", function(e) {
  e.preventDefault();
  const novoUsuario = {
    nome: document.getElementById("nome").value,
    apelido: document.getElementById("apelido").value,
    email: document.getElementById("email-cadastro").value,
    senha: document.getElementById("senha-cadastro").value,
    frase: document.getElementById("frase").value || "Amo livros e café",
    livros: { lendo: [], quero: [], preferidos: [], lidos: [] }
  };
  
  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
  usuarios.push(novoUsuario);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  localStorage.setItem("usuarioLogado", JSON.stringify(novoUsuario));
  alert("Conta criada com sucesso! Bem-vinda, " + novoUsuario.apelido + "!");
  window.location.href = "perfil.html";
});