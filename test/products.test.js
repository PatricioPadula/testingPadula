import mongoose from "mongoose";
import Assert from "assert";
import {productsDao} from "../src/dao/managers/index.js"
import { productsModel } from "../src/dao/models/products.model.js";

const assert = Assert.strict;

const testDB = "mongodb+srv://patriciopadula:vXfRy3cKpn8s37YT@cluster0.m3arwr3.mongodb.net/Test?retryWrites=true&w=majority"

describe("Pruebas para manager de productos (products DAO)", function(){
    before(async function(){
        await mongoose.connect(testDB)
        console.log("base de datos de prueba conectada");
    })

    beforeEach(async function(){
        await productsModel.deleteMany({});
    });

    it("El metodo get debe retornar un arreglo de productos",async function(){
        const response = await productsDao.get();
        assert.strictEqual(response,[]);
    });

    it("El metodo save debe guardar un producto en la base de datos",async function(){
        const mockProduct = {
            name:"tele",
            price:10000,
            code:"12345hg1kj23b4tflk",
            category:"computación",
            stock:2,
        };
        const response = await productsDao.save(mockProduct);
        assert.ok(response._id);
    });

    it("El Dao puede obtener  a un producto por id", async function(){
        const mockProduct = {
            name:"Tele",
            price:10000,
            code:"12345hg1kj23b4tflk",
            category:"computación",
            stock:2,
        };
        const response = await productsDao.save(mockProduct);
        const prodId = response.id;
        const responseProd = await productsDao.getBy({id:prodId});
        assert.strictEqual(responseProd.name,"Tele");
    });
});