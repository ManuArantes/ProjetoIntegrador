const textoMinhaHistoria = document.getElementById("textoMinhaHistoria");
const listaRelatosFamiliares = document.getElementById("listaRelatosFamiliares");

const relatosFamiliares = [
  "Relato 1: Lorem ipsum dolor sit amet...",
  "Relato 2: Aenean vel nibh ut tortor...",
  "Relato 3: Vestibulum ante ipsum primis..."
];

let indexAtual = 0;

function adicionarRelato() {
  if (indexAtual < relatosFamiliares.length) {
    const novoItem = document.createElement("li");
    novoItem.textContent = relatosFamiliares[indexAtual];
    listaRelatosFamiliares.appendChild(novoItem);
    indexAtual++;
  }
}

function removerUltimoRelato() {
  if (listaRelatosFamiliares.lastChild) {
    listaRelatosFamiliares.removeChild(listaRelatosFamiliares.lastChild);
    indexAtual--;
  }
}

function mostrarHistoria() {
  const btn = document.querySelector('section.bloco button[onclick="mostrarHistoria()"]');
  let conteudo = document.getElementById("conteudoHistoria");

  if (!conteudo) {

    const section = btn.parentElement;
    conteudo = document.createElement("div");
    conteudo.id = "conteudoHistoria";
    conteudo.style.marginTop = "15px";

    conteudo.innerHTML = `
      <p style="color:#4a148c; font-weight:bold;">
        Olá, meu nome é Emanuelly Arantes de Oliveira, tenho 17 anos e sou portadora de Miastenia Congênita. Criei este site para conscientizar as pessoas sobre essa síndrome que faz parte da minha vida. A Miastenia Congênita é uma doença neuromuscular rara que causa fraqueza e fadiga nos músculos do corpo devido a problemas na comunicação entre os nervos e os músculos. Depois de muitos anos enfrentando desafios e aprendendo a lidar com a situação, encontrei formas de conviver melhor com a síndrome e quero compartilhar essa experiência para ajudar outras pessoas que passam pelo mesmo. Meu objetivo é informar, apoiar e fortalecer a comunidade em torno dessa condição.
      </p>
      <img src="images/minha-foto.jpeg" alt="Foto de Emanuelly Arantes de Oliveira" class="foto-historia" />

    `;

    section.appendChild(conteudo);
    btn.textContent = "Esconder Minha História";
  } else {
    if (conteudo.style.display === "none" || conteudo.style.display === "") {
      conteudo.style.display = "block";
      btn.textContent = "Esconder Minha História";
    } else {
      conteudo.style.display = "none";
      btn.textContent = "Mostrar Minha História";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const inputBusca = document.getElementById("inputBusca");
  const listaArtigos = document.getElementById("lista-artigos");
  if (!inputBusca || !listaArtigos) return;

  const artigos = listaArtigos.querySelectorAll(".artigo-item");

  inputBusca.addEventListener("input", () => {
    const filtro = inputBusca.value.toLowerCase();

    artigos.forEach((artigo) => {
      const textoArtigo = artigo.textContent.toLowerCase();
      artigo.style.display = textoArtigo.includes(filtro) ? "block" : "none";
    });
  });
});
