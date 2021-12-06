/* Obtengo información que fui guardando en Local Storage */
const productoEnLocalStorage = JSON.parse(localStorage.getItem("carrito"))

/* Creación mediante DOM de la lista en el carrito del producto seleccionado, con jQuery */
$(document).ready(()=>{
for(let producto of productoEnLocalStorage){

            $("#carrito").prepend(
                                    `<div class="card card-carrito">
                                        <img class = "img-carrito" src="${producto.imagen}">
                                        <h2 class="card-title titulo-carrito"> ${producto.nombre}</h2>
                                        <b class="precioCarrito"> $${producto.precio}</b>
                                        <input class="cantidadCarrito" type="number" value=${producto.cantidad}>
                                        <img class = "borrar" src="../multimedia/delete.svg">
                                    </div>
                                    `
            );

    /* Selecciono todos los botones delete y agrego un evento */
    document.querySelector('.borrar').addEventListener('click', borrarProducto);

    /* Selecciono el input de cantidad y agrego un evento */
    document.querySelector('.cantidadCarrito').addEventListener('change', cambiarCantidad);

    /*Selecciono el botón de finalizar compra en HTML y agrego un evento */
    const botonFinalizarCompra = document.querySelector('.botonFinalizar');
    botonFinalizarCompra.addEventListener('click', finalizarCompra);

    badgeCarrito();
    sumarTotal(); /* Función que usaré para calcular el total de cada producto seleccionado */
}
});

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

    let index = productoEnLocalStorage.findIndex(alimento => alimento.nombre == e.target.parentNode.children[1].innerText);

    productoEnLocalStorage.splice(index, 1);

    console.log(`Eliminaste ${e.target.parentNode.children[1].innerText}`)

    /* Elimino del Local Storage el producto deseado */
    localStorage.setItem("carrito", JSON.stringify(productoEnLocalStorage));
    botonBorrar.closest('.card-carrito').remove();

    badgeCarrito(); /* Actualiza cantidad en carrito en el header */
    sumarTotal(); /* Actualiza el total*/
}

/* Creo la función para poder cambiar la cantidad del producto en el carrito y se actualice el total */
function cambiarCantidad(e) {
    const cantidad = e.target;

    const input = e.target.parentNode.children[1].textContent;

    let index = productoEnLocalStorage.findIndex(producto => " " + producto.nombre == input)

    /* El valor sea siempre mayor a 0 */
    if (input.value <= 0) {
        input.value = 1;
    }

    productoEnLocalStorage[index].cantidad = parseInt(cantidad.value);

    localStorage.setItem('carrito', JSON.stringify(productoEnLocalStorage));

    badgeCarrito(); /* Actualiza cantidad en carrito en el header */
    sumarTotal(); /* Actualiza el total */
}

/* Creo la función para pasarle al evento */
function finalizarCompra() {
    carrito.innerHTML = `<h2 class="detalleCompraTitulo">¡Gracias por tu compra!</h2>
                        <a class="btn btn-success ml-auto botonVolver" href="../secciones/tienda.html">Volver a la tienda</a>`;
    console.log(`¡Gracias por tu compra!`)

    /* Elimino todos los productos del Local Storage*/
    localStorage.clear();
}

/* Función para mostrar cantidad de productos en carrito en el header */
function badgeCarrito(producto) {
    let totalCarrito = 0;

    for (let producto of productoEnLocalStorage) {
        totalCarrito += producto.cantidad;
    }

    badge.innerHTML = `${totalCarrito}`;
}