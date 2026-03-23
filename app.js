document.addEventListener("DOMContentLoaded", () => {

    // ===== FIREBASE =====
    const firebaseConfig = {
        apiKey: "AIzaSyCFIWJ-rt3T5_mYIA3LOQ3VeiSpEaj11Hs",
        authDomain: "lolla-casting-6ee1f.firebaseapp.com",
        projectId: "lolla-casting-6ee1f",
        storageBucket: "lolla-casting-6ee1f.appspot.com",
        messagingSenderId: "667541474611",
        appId: "1:667541474611:web:9d6a5a7439e97176088246"
    };

    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    const storage = firebase.storage();

    // ===== ELEMENTOS =====
    const home = document.getElementById("home");
    const formScreen = document.getElementById("formScreen");
    const previewScreen = document.getElementById("previewScreen");

    const startBtn = document.getElementById("startBtn");
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

    // ===== MÁSCARAS =====

    // só letras (nome e cidade)
    const onlyLetters = (v) => v.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");

    // só números
    const onlyNumbers = (v) => v.replace(/\D/g, "");

    // NOME
    nome.addEventListener("input", () => {
        nome.value = onlyLetters(nome.value);
    });

    // CIDADE
    cidade.addEventListener("input", () => {
        cidade.value = onlyLetters(cidade.value);
    });

    // IDADE (máx 2 dígitos)
    idade.addEventListener("input", () => {
        idade.value = onlyNumbers(idade.value).slice(0, 2);
    });

    // ALTURA (ex: 1.75)
    altura.addEventListener("input", () => {
        let v = altura.value.replace(/[^0-9.]/g, "");

        // impede mais de um ponto
        const parts = v.split(".");
        if (parts.length > 2) {
            v = parts[0] + "." + parts[1];
        }

        altura.value = v;
    });

    // EMAIL (limita caracteres inválidos)
    email.addEventListener("input", () => {
        email.value = email.value.replace(/[^a-zA-Z0-9@._-]/g, "");
    });

    // TELEFONE (formato brasileiro)
    telefone.addEventListener("input", () => {
        let v = onlyNumbers(telefone.value).slice(0, 11);

        if (v.length > 10) {
            // celular (11 dígitos)
            v = v.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
        } else {
            // fixo (10 dígitos)
            v = v.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
        }

        telefone.value = v;
    });

    // ===== NAVEGAÇÃO =====
    startBtn.onclick = () => {
        home.classList.remove("active");
        formScreen.classList.add("active");
    };

    editarBtn.onclick = () => {
        previewScreen.classList.remove("active");
        formScreen.classList.add("active");
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

    // ===== ENVIO SEM STORAGE (BASE64) =====
    confirmarBtn.onclick = async () => {

        if (fotos.files.length === 0) {
            alert("Envie pelo menos uma imagem!");
            return;
        }

        status.textContent = "Enviando...";

        try {
            const id = Date.now().toString();
            const imagensBase64 = [];

            // converter imagens para base64
            for (let file of fotos.files) {
                const base64 = await toBase64(file);
                imagensBase64.push(base64);
            }

            // salvar no Firestore
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

            status.textContent = "Enviado com sucesso";

        } catch (error) {
            console.error(error);
            status.textContent = "Erro ao enviar";
        }
    };

    const adminBtn = document.getElementById("adminBtn");

    adminBtn.addEventListener("click", () => {
        window.location.href = "admin.html";
    });

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').then(reg => {
    reg.update();
  });
}

});

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
