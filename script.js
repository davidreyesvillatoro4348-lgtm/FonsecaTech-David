// FonsecaTech: carrito de demostración (sin servidor)
const ENVIO = 3.5, ENVIO_GRATIS = 50, IVA = 0.13;
const $ = (id) => document.getElementById(id);
const usd = (n) => '$' + n.toFixed(2);
let carrito = {};
try { carrito = JSON.parse(localStorage.getItem('ft-carrito')) || {}; } catch (e) { carrito = {}; }

function guardar() { try { localStorage.setItem('ft-carrito', JSON.stringify(carrito)); } catch (e) {} }

function pintar() {
  const items = Object.values(carrito);
  const cant = items.reduce((s, i) => s + i.qty, 0);
  const sub = items.reduce((s, i) => s + i.qty * i.price, 0);
  const envio = sub === 0 ? 0 : (sub >= ENVIO_GRATIS ? 0 : ENVIO);
  const iva = (sub + envio) * IVA; // el IVA también se aplica al envío
  $('contador').textContent = cant;
  $('lineas').innerHTML = items.length ? items.map((i) =>
    `<div class="linea"><div>${i.name}<br><small>${usd(i.price)} c/u</small></div>
     <div class="qty"><button data-m="${i.id}">−</button><span>${i.qty}</span><button data-p="${i.id}">+</button></div>
     <strong>${usd(i.qty * i.price)}</strong></div>`).join('')
    : '<p class="vacio">Tu carrito está vacío.</p>';
  $('t-sub').textContent = usd(sub);
  $('t-env').textContent = sub && envio === 0 ? 'Gratis' : usd(envio);
  $('t-iva').textContent = usd(iva);
  $('t-tot').textContent = usd(sub + envio + iva);
}

function abrir(v) {
  $('carrito').classList.toggle('abierto', v);
  $('fondo').hidden = !v;
}

document.querySelectorAll('.add').forEach((b) => b.addEventListener('click', () => {
  const { id, name, price } = b.dataset;
  carrito[id] = carrito[id] || { id, name, price: parseFloat(price), qty: 0 };
  carrito[id].qty++;
  guardar(); pintar(); abrir(true);
}));

$('lineas').addEventListener('click', (e) => {
  const p = e.target.dataset.p, m = e.target.dataset.m;
  if (p) carrito[p].qty++;
  if (m && --carrito[m].qty <= 0) delete carrito[m];
  guardar(); pintar();
});

$('abrir-carrito').addEventListener('click', () => abrir(true));
$('cerrar-carrito').addEventListener('click', () => abrir(false));
$('fondo').addEventListener('click', () => abrir(false));
$('pagar').addEventListener('click', () => {
  if (!Object.keys(carrito).length) return alert('Agrega productos al carrito primero.');
  alert('Esta es una tienda de demostración. ¡Gracias por tu compra!');
  carrito = {}; guardar(); pintar(); abrir(false);
});
pintar();
