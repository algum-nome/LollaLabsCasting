// ===== FIREBASE =====
const firebaseConfig = {
    apiKey: "AIzaSyCFIWJ-rt3T5_mYIA3LOQ3VeiSpEaj11Hs",
    authDomain: "lolla-casting-6ee1f.firebaseapp.com",
    projectId: "lolla-casting-6ee1f",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const lista = document.getElementById("lista");

// ===== BUSCAR DADOS =====
db.collection("modelos")
    .orderBy("criadoEm", "desc")
    .onSnapshot(snapshot => {

        lista.innerHTML = "";

        snapshot.forEach(doc => {
            const data = doc.data();

            const div = document.createElement("div");
            div.className = "card";
            div.style.marginTop = "20px";

            div.innerHTML = `
  <div class="admin-info">
    <h2>${data.nome}</h2>
    <p><b>Idade:</b> ${data.idade}</p>
    <p><b>Altura:</b> ${data.altura}</p>
    <p><b>Email:</b> ${data.email}</p>
    <p><b>Telefone:</b> ${data.telefone}</p>
    <p><b>Cidade:</b> ${data.cidade}</p>
  </div>
  <div class="galeria"></div>
`;

            const galeria = div.querySelector(".galeria");

            // imagens base64
            if (data.fotos) {
                data.fotos.forEach(foto => {
                    const img = document.createElement("img");
                    img.src = foto;
                    img.style.width = "100px";
                    img.style.margin = "5px";
                    img.style.borderRadius = "8px";
                    galeria.appendChild(img);
                });
            }

            lista.appendChild(div);
        });

    });