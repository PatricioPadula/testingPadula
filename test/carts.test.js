import mongoose from "mongoose";
import Assert from "assert";
import {cartsDao} from "../src/dao/managers/index.js"
import { cartsModel } from "../src/dao/models/carts.model.js";

const assert = Assert.strict;

const testDB = "mongodb+srv://patriciopadula:vXfRy3cKpn8s37YT@cluster0.m3arwr3.mongodb.net/Test?retryWrites=true&w=majority"

describe("Pruebas para manager de carritos (carts DAO)", function(){
    before(async function(){
        await mongoose.connect(testDB)
        console.log("base de datos de prueba conectada");
    })

    beforeEach(async function(){
        await cartsModel.deleteMany({});
    });

    it("El metodo get debe retornar un arreglo de carritos",async function(){
        const response = await cartsDao.get();
        assert.strictEqual(response,[]);
    });

    it("Al agregar un nuevo carrito, éste debe crearse con un arreglo de productos vacío por defecto.", async function(){
        const mockCart = {
        };
        const response = await cartsDao.save(mockCart);
        console.log(response);
        assert.deepStrictEqual(response.products,[]);
    });
});