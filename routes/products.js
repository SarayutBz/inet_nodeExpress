var express = require('express');
var router = express.Router();
const productModel = require('../models/products')
const mongoose = require("mongoose")
const MiddleWareToken = require('../middleware/TokenMIddlewareUser')

// ? Get All product
router.get('/api/v1/products',MiddleWareToken, async (req, res) => {
    try {
        let products = await productModel.find({})
        if (products.length === 0) {
            return res.status(201).send({
                status: 201,
                message: "เรียกดูสินค้าทั้งหมด สำเร็จ",
                data: null,
            })
        }
        return res.status(201).send({
            status: 201,
            message: "เรียกดูสินค้าทั้งหมด สำเร็จ",
            data: products,
        });
    } catch (error) {
        console.log(error)
        res.status(400).json({
            status: 400,
            message: "เกิดข้อผิดพลาด กรุณาลอง ใหม่อีกครั้ง",
        })
    }
})

// ? Get Product by ID
router.get("/api/v1/products/:id",MiddleWareToken, async (req, res, next) => {
    try {
        let idProduct = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(idProduct)) {
            return res.status(400).send({
                message: "id Invalid",
                success: false,
                error: ["id is not a ObjectId"],
            }
            )
        }
        let products2 = await productModel.findById(idProduct)
        return res.status(200).send({
            data: products2,
            message: "ค้นหาสินค้าด้วย id สำเร็จ",
            status: 200,
        })
    } catch (error) {
        console.log("error : ", error)
        return res.status(500).send({
            message: "server error",
            status: 500
        })
    }
})

// ? Add Product
router.post('/api/v1/products',MiddleWareToken, async (req, res) => {
    let { name, price, stockProduct } = req.body
    try {
        if (!name || !price || !stockProduct) {
            return res.status(400).json({
                status: 400,
                message: "กรุณากรอกข้อมูลให้ครบทุกช่อง",
                data: []
            })
        }
        let newProduct = new productModel({
            name: name,
            price: price,
            stockProduct: stockProduct,
        });
        let productNew = await newProduct.save();
        return res.status(201).send({
            status: 201,
            message: "การเพิ่มสินค้า สำเร็จ",
            data: [productNew],
        });
    } catch (error) {
        console.log(error)
        res.status(400).json({
            status: 400,
            message: "เกิดข้อผิดพลาด กรุณาเพิ่มสินค้า ใหม่อีกครั้ง",
            data: []
        })

    }
})

// ? Edit Product
router.put('/api/v1/products/:id',MiddleWareToken, async (req, res) => {
    let { name, price, stockProduct } = req.body
    if (!name || !price || !stockProduct) {
        return res.status(400).json({
            status: 400,
            message: "กรุณากรอกข้อมูลให้ครบทุกช่อง",
            data: []
        })
    }
    try {
        let idProduct = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(idProduct)) {
            return res.status(400).send({
                message: "id ไม่ถูกต้อง",
                status: false,
                error: ["id is not a ObjectId"],
            }
            )
        }
        await productModel.updateOne(
            { _id: new mongoose.Types.ObjectId(idProduct) },
            { $set: req.body }
        )

        let products2 = await productModel.findById(idProduct)
        return res.status(201).send({
            data: products2,
            message: "แก้ไขข้อมูลสำเร็จ ",
            status: 201,
        })
    } catch (error) {
        console.log("error : ", error)
        return res.status(500).send({
            message: "server เกิดข้อผิดพลาด",
            status: 500
        })
    }
})

// ? Delete Product
router.delete("/api/v1/products/:id",MiddleWareToken, async (req, res) => {
    try {
        let idProduct = req.params.id;
        if (!idProduct) {
            return res.status(400).json({
                status: 400,
                message: "กรุณากรอกข้อมูลให้ครบทุกช่อง",
                data: []
            })
        }
        let products2 = await productModel.findById(idProduct)
        await productModel.deleteOne({ _id: new mongoose.Types.ObjectId(idProduct) })
        return res.status(200).send({
            data: products2,
            message: "ลบข้อมูลสำเร็จ ",
            status: 200,
        })
    } catch (error) {
        console.log("error : ", error)
        return res.status(500).send({
            message: "server เกิดข้อผิดพลาด",
            success: false
        })
    }
})



module.exports = router;
