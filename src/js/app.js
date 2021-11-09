let pagina = 1;

document.addEventListener('DOMContentLoaded', function () {
    iniciarApp();
});

function iniciarApp() {
    mostrarServicios();

    // Resalta div segun el tab al q se presiona
    mostrarSeccion();
    
    // oculta o muestra segun tab q presiona
    cambiarSeccion();

    //paginacion anterior y siguiente
    paginaSiguiente();
    paginaAnterior();
 }

function mostrarSeccion() {
    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    //resalta tab actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
}

function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabs button');

    enlaces.forEach(enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();

            pagina = parseInt(e.target.dataset.paso);

            //eliminar mostrar-seccion de la seccion anterior
            document.querySelector('.mostrar-seccion').classList.remove('mostrar-seccion');
            
            //agrega mostrar seccion donde dimos click
            const seccion = document.querySelector(`#paso-${pagina}`);
            seccion.classList.add('mostrar-seccion');

            //eliminar clase tab
            document.querySelector('.tabs .actual').classList.remove('actual');
            //agregar clase tab
            const tab = document.querySelector(`[data-paso="${pagina}"]`);
            tab.classList.add('actual');

        });
    });
}

async function mostrarServicios() {
    try {
        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();
        
        const { servicios } = db;
        
        //generar html
        servicios.forEach( servicio => {
            const { id, nombre, precio } = servicio;
            
            //Dom scripting
            //generar nombre servicio
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');

            //generar precio
            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio');

            //generar div contendedor servicio
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;

            //selecciona un div para la cita
            servicioDiv.onclick = seleccionarServicio;

            //Inyectar precio y nombre al div de servicio
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            // iyectar en el html
            document.querySelector('#servicios').appendChild(servicioDiv);

        });
    } catch (error) {
        console.log(error)
    }
}

function seleccionarServicio(e) {
    let elemento;
    // Forzar q el elemento al cual le damos click sea el div
    if (e.target.tagName === 'P'){
        elemento = e.target.parentElement;
    }else {
        elemento = e.target;
    }
    if (elemento.classList.contains('seleccionado')) {
        elemento.classList.remove('seleccionado');
    } else {
        elemento.classList.add('seleccionado');
    }
    
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++;
        console.log(pagina);
    })
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;
        console.log(pagina);
    });
}