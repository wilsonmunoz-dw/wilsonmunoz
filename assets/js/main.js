// ===== Nav: fondo al hacer scroll =====
const nav = document.getElementById('nav');
const alScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
alScroll();
window.addEventListener('scroll', alScroll, { passive: true });

// ===== Menú mobile =====
const toggle = document.getElementById('toggle');
const menu = document.getElementById('menu');
const cerrarMenu = () => {
    menu.classList.remove('abierto');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
};
toggle.addEventListener('click', () => {
    const abierto = menu.classList.toggle('abierto');
    toggle.setAttribute('aria-expanded', abierto);
    document.body.style.overflow = abierto ? 'hidden' : '';
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', cerrarMenu));

// ===== Revelado al entrar en pantalla =====
const elementos = document.querySelectorAll('.revelar');
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('visible');
                observer.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    elementos.forEach(el => observer.observe(el));
} else {
    elementos.forEach(el => el.classList.add('visible'));
}

// ===== Capturas de página completa: scroll suave al hacer hover =====
document.querySelectorAll('.navegador__pantalla').forEach(pantalla => {
    const img = pantalla.querySelector('img');
    if (!img) return;
    const ajustar = () => pantalla.style.setProperty('--alto-visible', pantalla.clientHeight + 'px');
    img.complete ? ajustar() : img.addEventListener('load', ajustar);
    window.addEventListener('resize', ajustar);
});


// ===== Año actual en el footer =====
const anio = document.getElementById('anio');
if (anio) anio.textContent = new Date().getFullYear();

// ===== Formulario de contacto (Formspree) =====
const form = document.getElementById('formulario');
const aviso = document.getElementById('aviso');

function mostrarAviso(tipo, texto) {
    aviso.hidden = false;
    aviso.className = 'aviso aviso--' + tipo;
    aviso.textContent = texto;
}

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!form.checkValidity()) { form.reportValidity(); return; }

        const boton = form.querySelector('button[type="submit"]');
        const textoBoton = boton.innerHTML;
        boton.disabled = true;
        boton.textContent = 'Enviando…';

        try {
            const res = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });
            if (!res.ok) throw new Error();
            const nombre = form.nombre.value.trim();
            form.reset();
            mostrarAviso('ok', '¡Gracias, ' + nombre + '! Recibí tu mensaje y te respondo pronto.');
        } catch {
            mostrarAviso('error', 'No se pudo enviar el mensaje. Probá de nuevo o escribime por WhatsApp.');
        } finally {
            boton.disabled = false;
            boton.innerHTML = textoBoton;
        }
    });
}
