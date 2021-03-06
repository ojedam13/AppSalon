let pagina = 1;

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

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

    //comprueba la pag actual para ocultar o mostrar la paginacion
    botonesPaginador();

    // muestra el resumen de la cita (o msj de error)
    mostrarResumen();

    // almacena nombre de la cita en el obj
    nombreCita();

     // almacena la fecha de la cita en el obj
    fechaCita();

    //desahibilta dias pasados
    deshabilitarFechaAnterior();
}

function mostrarSeccion() {

      //eliminar mostrar-seccion de la seccion anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if (seccionAnterior) {
        seccionAnterior.classList.remove('mostrar-seccion');
    }
    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    //eliminar clase tab
    const tabAnterior = document.querySelector('.tabs .actual');
    if (tabAnterior) {
        tabAnterior.classList.remove('actual');
    }
    //resalta tab actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
}

function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabs button');

    enlaces.forEach( enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();

            pagina = parseInt(e.target.dataset.paso);

            //llamar la funcion de mostrar seccion
            mostrarSeccion();
            botonesPaginador();
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

        const id = parseInt(elemento.dataset.idServicio);
        eliminarServicio(id);
    } else {
        elemento.classList.add('seleccionado');

        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent ,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }
        
        agregarServicio(servicioObj);
    }
}

function eliminarServicio(id) {
    const { servicios } = cita;
    cita.servicios = servicios.filter(servicio => servicio.id !== id);
    console.log(cita);
}

function agregarServicio(servicioObj) {
    const { servicios } = cita;
    cita.servicios = [...servicios, servicioObj];
     console.log(cita);
}
    
function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++;
        console.log(pagina);

        botonesPaginador();
    })
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;
        console.log(pagina);
         botonesPaginador();
    });
}

function botonesPaginador() {
    const paginaAnterior = document.querySelector('#anterior');
    const paginaSiguiente = document.querySelector('#siguiente');

    if (pagina === 1) {
        paginaAnterior.classList.add('ocultar');
    } else if (pagina === 3) {
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    //cambia seccion q se muestra por la pagina
    mostrarSeccion();
}

function mostrarResumen() {
    //destructuring
    const { nombre, fecha, hora, servicios } = cita;
    
    // seleccionar el resumen
    const resumenDiv = document.querySelector('.contenido-resumen');
    //validacion de objeto
    if (Object.values(cita).includes('')) {
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos de servicios, hora, fecha o nombre';
        noServicios.classList.add('invalidar-cita');

        //agregar a resumen Div
        resumenDiv.appendChild(noServicios);
    }
}

function nombreCita() {
    const nombreInput = document.querySelector('#nombre');

    nombreInput.addEventListener('input', e => {
        const nombreTexto = e.target.value.trim();

        // validacion de q nombreTexto debe tener algo
        if (nombreTexto === '' || nombreTexto.length < 3) {
            mostrarAlerta('Nombre no valido', 'error');
        } else {
            const alerta = document.querySelector('.alerta');
            if (alerta) {
                alerta.remove();
            }
            cita.nombre = nombreTexto;
        }
    });
}

function mostrarAlerta(mensaje, tipo) {
    // si hay una alerta previa, enonces no crear otra
    const alertaPrevia = document.querySelector('.alerta');
    if (alertaPrevia) {
        return;
    }

    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');


    if (tipo === 'error') {
        alerta.classList.add('error');
    }

    //inserta en el html
    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);

    //eliminar la alerta desp de 3 seg
    setTimeout(() => {
        alerta.remove();
    }, 2000);

}

function fechaCita(); {
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e => {
       
        const dia = new Date(e.target.value).getUTCDate();
        
        if ([0].includes(dia)) {
            e.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('Domingo no son permitidos', 'error');
        } else {
            cita.fecha = fechaInput.value;
        }
    })
}

function deshabilitarFechaAnterior() {
    const inputFecha = document.querySelector('#fecha');

    const fechaAhora = new Date();
    const year = fechaAhora.getFullYear();
    const mes = fechaAhora.getMonth() + 1;
    const dia = fechaAhora.getDate() + 1;

    //formato deseado: AAAA-MM-DD
    const fechaDeshabilitar = `${year}-${mes}-${dia}`;
    inputFecha.min = fechaDeshabilitar;
}