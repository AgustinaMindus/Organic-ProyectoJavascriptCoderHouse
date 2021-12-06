/* Objeto clase que modela la información del producto */
class Producto {

    // constructor
    constructor(id, nombre, precio, descripcion, imagen){
        this.id = id;
        this.nombre = nombre,
        this.precio = parseFloat(precio),
        this.descripcion = descripcion,
        this.imagen = imagen;
        this.cantidad = 1;
    }

}