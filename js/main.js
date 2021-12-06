/****CARRITO****/

let nombre = 0;
let precio = 0;

/* Inicializo la pagina teniendo en cuenta si hay o no productos en el local Storage */
let arrayCarrito;

let arrayLocalStorage = JSON.parse(localStorage.getItem("carrito"));

if (arrayLocalStorage) {
    /* Información obtenida del Local Storage */
    arrayCarrito = arrayLocalStorage;
} else {
    /* Array en donde se guardan los productos agregados al carrito */
    arrayCarrito = [];
}

/* Array productos */
let productos = [];


/****INICIO AJAX****/

/* Lectura de los productos desde datos_productos.json con ajax */
$.ajax('../js/datos_productos.json').done(function (data) {
        productos = data;
        let productos2 = productos.map((value) => new Producto(value.id, value.nombre, value.precio, value.descripcion, value.imagen));
        productos = productos2;


/****TIENDA****/

/* Creo una función, recorro cada array de objetos y creo mediante DOM cada producto dentro de un id */
const listaProductos = document.getElementById("listaProductos");
const agregarProductos = () => {
    for (const producto of productos) {

        let contenedorProductos = document.createElement("div");

        contenedorProductos.innerHTML = `<div class="card card-tienda">
                                            <p id="parrafo-fav${producto.id}" class="parrafo-fav">Agregado a favoritos</p>
                                            <img class = "img-tienda" src="${producto.imagen}">
                                            <h2 class="card-title titulo-tienda"> ${producto.nombre}</h2>
                                            <b class="precio"> $${producto.precio} ${producto.descripcion}</b>
                                            <img class="favoritos" src="../multimedia/favoritos.svg">
                                        </div>
                                        `;

        const agregarBoton = document.createElement("div"); /* Agrego un boton dentro de un div */
        agregarBoton.innerHTML = `<button class="btn boton" id="boton${producto.id}">Agregar al carrito</button>`;

        listaProductos.appendChild(contenedorProductos);
        contenedorProductos.appendChild(agregarBoton);
        badgeCarrito(producto); /* Actualiza cantidad en carrito en el header */

        /* Creo un evento click con jQuery */
        $(`#boton${producto.id}`).click(function () {
            agregarCarrito(producto)
            $(".contenedor-carrito").css('right', 50);
            console.log(`Agregaste al carrito: ${producto.nombre}`)
            badgeCarrito(producto);
        });

    }
}

agregarProductos(); /* Nombro a la funcion para que la tome */

/* Creo un evento click con jQuery y le agrego animaciones */
$(".favoritos").click(function (e) {

    let id = e.target.parentNode.children[0].id;

    $(`#${id}`).css("color", "green")
        .fadeIn(2000)
        .fadeOut(2000);
})


    const listaCarrito = document.getElementById('carrito');
    const contenedorCarrito = document.createElement("div");

/* Creo la función con el parametro del producto clickeado para pasarle al evento */
const agregarCarrito = (producto) => {
    let index = arrayCarrito.findIndex(alimento => alimento.nombre == producto.nombre);

    if (index == -1) {

        arrayCarrito.push(producto);

        sumarTotal(); /* Función que usaré para calcular el total de cada producto seleccionado */

    } else {
        arrayCarrito[index].cantidad++ /* Se actualiza la cantidad en el carrito según la selección de un mismo producto, tantas veces como sea necesario*/
    }

    /* Almaceno en Local Storage los productos agregados al Array del carrito */
    localStorage.setItem("carrito", JSON.stringify(arrayCarrito));
    console.log(arrayCarrito);

    rellenarCarrito(arrayCarrito); /* Función que usaré para mostrar cada producto seleccionado */

    sumarTotal(); /* Función que usaré para calcular el total de cada producto seleccionado */
}


/* Función para crear mediante DOM cada producto agregado, permite que no se duplique el div, sino que lo sume al mismo item y cambie la cantidad deseada*/
function rellenarCarrito(arrayCarrito){

    contenedorCarrito.innerHTML = "";
    for(let producto of arrayCarrito) {

    contenedorCarrito.innerHTML += `<div class="card card-carrito">
                                    <img class = "img-carrito" src="${producto.imagen}">
                                    <h2 class="card-title titulo-carrito"> ${producto.nombre}</h2>
                                    <b class="precioCarrito"> $${producto.precio}</b>
                                    <input class="cantidadCarrito" type="number" value="${producto.cantidad}">
                                    <img class="borrar" src="../multimedia/delete.svg">
                                </div>
                                `;

    listaCarrito.insertAdjacentElement("afterbegin", contenedorCarrito);
    }

    verificarHtml();
}

let botonBorrar;
let botonCantidad;

/* Función para "activar" los botones mientras exista contenido en el html */
function verificarHtml(){

    botonBorrar =  document.querySelectorAll('.borrar');
    botonCantidad = document.querySelectorAll('.cantidadCarrito')

    if(contenedorCarrito.innerHTML != ""){
        botonBorrar.forEach(boton => {
            boton.addEventListener("click", borrarProducto);
        });
        botonCantidad.forEach(boton => {
            boton.addEventListener("change", cambiarCantidad)
        })
    }
}

/* Creo una función para calcular el total de los productos que se agregan al carrito */
function sumarTotal() {
    let total = 0;
    let precioTotal = document.querySelector('.precioTotal');

    const productoAgregado = document.querySelectorAll('.card-carrito');

    /* Busco qué producto se agrego al carrito para tomar su precio y cantidad */
    productoAgregado.forEach((producto) => {
        const precioCarritoProducto = producto.querySelector('.precioCarrito');
        const precioCarrito = parseFloat(precioCarritoProducto.textContent.replace('$', ''));

        const cantidadCarritoProducto = producto.querySelector('.cantidadCarrito');
        const cantidadCarrito = parseFloat(cantidadCarritoProducto.value);

        /* Calculo el total acumulado en el carrito */
        total = total + precioCarrito * cantidadCarrito;

    });

    /* Agrego ese calculo al html */
    precioTotal.innerHTML = `$${total}`;
}

/* Creo la función para borrar productos en el carrito y se actualice el total */
function borrarProducto(e) {
    const botonBorrar = e.target;

    let index = arrayCarrito.findIndex(alimento => alimento.nombre == e.target.parentNode.children[1].innerText);

    arrayCarrito.splice(index, 1);

    console.log(`Eliminaste ${e.target.parentNode.children[1].innerText}`)

    /* Elimino del Local Storage el producto deseado */
    localStorage.setItem("carrito", JSON.stringify(arrayCarrito));
    botonBorrar.closest('.card-carrito').remove();

    badgeCarrito(); /* Actuliza cantidad en carrito en el header */
    sumarTotal(); /* Actualiza el total */
}

/* Creo la función para poder cambiar la cantidad del producto en el carrito y se actualice el total */
function cambiarCantidad(e) {
    const cantidad = e.target;

    const input = e.target.parentNode.children[1].textContent;

    let index = arrayCarrito.findIndex(producto => " " + producto.nombre == input)

    /* El valor sea siempre mayor a 0 */
    if (input.value <= 0) {
        input.value = 1;
    }

    arrayCarrito[index].cantidad = parseInt(cantidad.value);

    localStorage.setItem('carrito', JSON.stringify(arrayCarrito));

    badgeCarrito(); /* Actualiza cantidad en carrito en el header */
    sumarTotal(); /* Actualiza el total */
}

/* Función para mostrar cantidad de productos en carrito en el header */
function badgeCarrito(producto) {
    let totalCarrito = 0;

    for (let producto of arrayCarrito) {
        totalCarrito += producto.cantidad;
    }

    badge.innerHTML = `${totalCarrito}`;
}

});

/****FIN TIENDA****/

/****FIN AJAX****/

/****FIN CARRITO****/