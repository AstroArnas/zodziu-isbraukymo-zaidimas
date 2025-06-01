import { lentele, zodziai } from '../programa/zaidimai/zaidimas1.js';
import { sprendimas } from '../programa/sprendimai/sprendimas1.js';

const lenteleDiv = document.getElementById('zaidimo-lentele');
const zodziuDiv = document.getElementById('zodziu-sarasas');
const mygtukas = document.getElementById('mygtukas');

// zodziu atvaizdavimas
zodziai.forEach(z => {
  const el = document.createElement('span');
  el.textContent = z;
  el.id = 'zodis-' + z;
  zodziuDiv.appendChild(el);
});

// lenteles atvaizdavimas
lenteleDiv.style.gridTemplateColumns = `repeat(${lentele[0].length}, 30px)`;

let pazymeti = [];
let spausta = false;
const rastiZodziai = new Set();

function koordinates(i, j) {
  return i * lentele[0].length + j;
}

function pazymetiLangelius(kelias) {
  kelias.forEach(([i, j]) => {
    const idx = koordinates(i, j);
    lenteleDiv.children[idx].classList.add('pazymeta');
  });
}

function pazymetiKaipRasta(kelias) {
  kelias.forEach(([i, j]) => {
    const idx = koordinates(i, j);
    const cell = lenteleDiv.children[idx];
    cell.classList.remove('pazymeta');
    cell.classList.add('rastas');
  });
}

function pazymetiKaipPilka(kelias) {
  kelias.forEach(([i, j]) => {
    const idx = koordinates(i, j);
    const cell = lenteleDiv.children[idx];
    cell.classList.remove('pazymeta');
    cell.classList.add('nerastas');
  });
}

function sukurtiLangeli(i, j, raide) {
  const div = document.createElement('div');
  div.textContent = raide;

  div.addEventListener('mousedown', () => {
    spausta = true;
    pazymeti = [[i, j]];
    const idx = koordinates(i, j);
    lenteleDiv.children[idx].classList.add('aktyvus');
  });

  div.addEventListener('mouseover', () => {
    if (spausta) {
      const paskutinis = pazymeti[pazymeti.length - 1];
      if (!paskutinis || paskutinis[0] !== i || paskutinis[1] !== j) {
        pazymeti.push([i, j]);
  
        const idx = koordinates(i, j);
        lenteleDiv.children[idx].classList.add('aktyvus');
      }
    }
  });

  div.addEventListener('mouseup', () => {
    spausta = false;
    const zodis = pazymeti.map(([i, j]) => lentele[i][j]).join('');
  
    if (zodziai.includes(zodis)) {
      document.getElementById('zodis-' + zodis).classList.add('rastas');
      pazymetiLangelius(pazymeti);
      rastiZodziai.add(zodis);
    }
  
    pazymeti.forEach(([i, j]) => {
      const idx = koordinates(i, j);
      lenteleDiv.children[idx].classList.remove('aktyvus');
    });
  
    pazymeti = [];
  });

  document.body.addEventListener('mouseup', () => {
    spausta = false;
    pazymeti.forEach(([i, j]) => {
      const idx = koordinates(i, j);
      lenteleDiv.children[idx].classList.remove('aktyvus');
    });
    pazymeti = [];
  });

  return div;
}

lentele.forEach((eil, i) => {
  eil.split('').forEach((raide, j) => {
    lenteleDiv.appendChild(sukurtiLangeli(i, j, raide));
  });
});

document.body.addEventListener('mouseup', () => (spausta = false));


const kryptys = {
  desine: [0, 1],
  kaire: [0, -1],
  zemyn: [1, 0],
  aukstyn: [-1, 0],
};

function validusKelias(kelias) {
  return kelias.every(([i, j]) =>
    i >= 0 && i < lentele.length &&
    j >= 0 && j < lentele[0].length
  );
}

function gautiKelioKoordinates(pradzia, kryptis, ilgis) {
  const i = pradzia[0] - 1;
  const j = pradzia[1] - 1;
  const [di, dj] = kryptys[kryptis];
  const kelias = [];

  for (let k = 0; k < ilgis; k++) {
    kelias.push([i + k * di, j + k * dj]);
  }

  return kelias;
}

mygtukas.addEventListener('click', () => {
  const atsakymai = sprendimas();
  atsakymai.forEach(({ zodis, coords, kryptis }) => {
    const kelias = gautiKelioKoordinates(coords, kryptis, zodis.length);
    if (validusKelias(kelias)) {
      if (rastiZodziai.has(zodis)) {
        pazymetiKaipRasta(kelias);
        document.getElementById('zodis-' + zodis).classList.add('rastas');
      } else {
        pazymetiKaipPilka(kelias);
        document.getElementById('zodis-' + zodis).classList.add('nerastas');
      }
    }
  });
});