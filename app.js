document.addEventListener("DOMContentLoaded", () => {

  // ===== FIREBASE =====
  const firebaseConfig = {
    apiKey: "AIzaSyCFIWJ-rt3T5_mYIA3LOQ3VeiSpEaj11Hs",
    authDomain: "lolla-casting-6ee1f.firebaseapp.com",
    projectId: "lolla-casting-6ee1f",
  };

  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  // ===== ELEMENTOS =====
  const home = document.getElementById("home");
  const formScreen = document.getElementById("formScreen");
  const previewScreen = document.getElementById("previewScreen");

  const startBtn = document.getElementById("startBtn");
  const adminBtn = document.getElementById("adminBtn");
  const editarBtn = document.getElementById("editar");
  const confirmarBtn = document.getElementById("confirmar");

  const form = document.getElementById("form");
  const fotos = document.getElementById("fotos");

  const nome = document.getElementById("nome");
  const idade = document.getElementById("idade");
  const altura = document.getElementById("altura");
  const email = document.getElementById("email");
  const telefone = document.getElementById("telefone");
  const cidade = document.getElementById("cidade");

  const preview = document.getElementById("preview");
  const dados = document.getElementById("dados");
  const imagens = document.getElementById("imagens");
  const status = document.getElementById("status");

  // ===== NAVEGAÇÃO =====
  startBtn.onclick = () => {
    home.classList.remove("active");
    formScreen.classList.add("active");
  };

  adminBtn.onclick = () => {
    window.location.href = "admin.html";
  };

  editarBtn.onclick = () => {
    previewScreen.classList.remove("active");
    formScreen.classList.add("active");
  };

  // ===== MÁSCARAS =====
  const onlyNumbers = v => v.replace(/\D/g, "");
  const onlyLetters = v => v.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");

  nome.oninput = () => nome.value = onlyLetters(nome.value);
  cidade.oninput = () => cidade.value = onlyLetters(cidade.value);
  idade.oninput = () => idade.value = onlyNumbers(idade.value).slice(0, 2);

  telefone.oninput = () => {
    let v = onlyNumbers(telefone.value).slice(0, 11);
    if (v.length > 10) {
      v = v.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else {
      v = v.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
    telefone.value = v;
  };

  // ===== PREVIEW =====
  fotos.onchange = () => {
    preview.innerHTML = "";
    [...fotos.files].forEach(f => {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(f);
      preview.appendChild(img);
    });
  };

  // ===== FORM → PREVIEW =====
  form.onsubmit = e => {
    e.preventDefault();

    dados.innerHTML = `
      <p><b>Nome:</b> ${nome.value}</p>
      <p><b>Idade:</b> ${idade.value}</p>
      <p><b>Altura:</b> ${altura.value}</p>
      <p><b>Email:</b> ${email.value}</p>
      <p><b>Telefone:</b> ${telefone.value}</p>
      <p><b>Cidade:</b> ${cidade.value}</p>
    `;

    imagens.innerHTML = "";
    [...fotos.files].forEach(f => {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(f);
      imagens.appendChild(img);
    });

    formScreen.classList.remove("active");
    previewScreen.classList.add("active");
  };

  // ===== FUNÇÃO BASE64 =====
  function toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  // ===== ENVIO FINAL (FUNCIONA EM PWA) =====
  confirmarBtn.onclick = async () => {

    console.log("clicou enviar");

    if (fotos.files.length === 0) {
      alert("Envie pelo menos uma imagem!");
      return;
    }

    status.textContent = "Enviando...";

    try {
      const id = Date.now().toString();
      const imagensBase64 = [];

      for (let file of fotos.files) {
        const base64 = await toBase64(file);
        imagensBase64.push(base64);
      }

      await db.collection("modelos").doc(id).set({
        nome: nome.value,
        idade: idade.value,
        altura: altura.value,
        email: email.value,
        telefone: telefone.value,
        cidade: cidade.value,
        fotos: imagensBase64,
        criadoEm: new Date()
      });

      console.log("ENVIADO");

      status.textContent = "Casting enviado com sucesso";

      // reset
      form.reset();
      preview.innerHTML = "";
      imagens.innerHTML = "";

    } catch (error) {
      console.error("ERRO:", error);
      alert(error.message);
      status.textContent = "Erro ao enviar";
    }
  };

});
