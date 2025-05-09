var express = require('express');
var router = express.Router();
const productModel = require('../models/products')
const userModel = require('../models/users')

const mongoose = require("mongoose");
const ordersModel = require('../models/orders');
const MiddleWareToken = require('../middleware/TokenMIddlewareUser')

// ? Get All order
router.get('/api/v1/orders', MiddleWareToken, async (req, res) => {
    try {
        let orders = await ordersModel.find()
        if (orders.length === 0) {
            return res.status(201).send({
                status: 201,
                message: "เรียกดูออเดอร์ทั้งหมด สำเร็จ",
                data: null,
            })
        }
        return res.status(201).send({
            status: 201,
            message: "เรียกดูออเดอร์ทั้งหมด สำเร็จ",
            data: orders,
        });
    } catch (error) {
        console.log(error)
        res.status(400).json({
            status: 400,
            message: "เกิดข้อผิดพลาด กรุณาลอง ใหม่อีกครั้ง",
            data: []
        })
    }
})

// ? Get Order Product by Id
router.get('/api/v1/products/:id/orders', MiddleWareToken, async (req, res) => {
    let idProduct = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(idProduct)) {
        return res.status(400).send({
            message: "id Invalid",
            success: false,
            error: ["id is not a valid ObjectId"],
        });
    }
    const product = await productModel.findById(idProduct);
    if (!product) {
        return res.status(404).send({
            message: "Product not found",
            success: false,
        });
    }
    const nameProduct = product.name;

    const orders = await ordersModel.find({ "orderUser.name": nameProduct });
    // ! console.log(orders) 
    // ! [{ก้อน Object }]

    if (orders.length === 0) {
        return res.status(200).send({
            data: nameProduct,
            message: "ไม่มีออเดอร์สินค้าเมนูนี้",
            status: 200,
        });
    }

    let orderCounter = 0;
    let productOrders = [];

    for (let order of orders) {
        // console.log(order)
        for (let menu of order.orderUser) {
            if (menu.name === nameProduct) {
                orderCounter += 1;
                productOrders.push({
                    userData: order.userData,
                    quantity: menu.quantity
                });
            }
        }
    }

    product.productOrders = productOrders;
    await product.save();

    return res.status(200).send({
        data: nameProduct,
        orders: productOrders,
        message: `มีออเดอร์สินค้านี้ทั้งหมด ${orderCounter}`,
        status: 200,
    });
});

// ? Add Order in product
router.post('/api/v1/products/:id/orders', MiddleWareToken, async (req, res) => {
    const { name, email, address, phoneNumber, quantity } = req.body;

    const userData = {
        name,
        email,
        address,
        phoneNumber,
    };

    const idProduct = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(idProduct)) {
        return res.status(400).json({
            message: "id ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง",
            success: false,
            error: ["id is not a valid ObjectId"],
        });
    }

    const product = await productModel.findById(idProduct);
    if (!product) {
        return res.status(404).json({
            message: "ไม่พบสินค้านี้ในระบบ",
        });
    }

    if (product.stockProduct < quantity) {
        return res.status(400).json({
            status: 400,
            message: "สินค้าคงเหลือไม่พอ",
            stockLeft: product.stockProduct
        });
    }

    product.stockProduct -= quantity;

    const orderItem = {
        name: product.name,
        price: product.price,
        quantity
    };

    product.productOrders.push({
        userData,
        ordersUser: [{
            quantity
        }]
    });

    const totalOrders = product.productOrders.length;
    product.totalOrders = totalOrders;
    await product.save();


    await ordersModel.create({
        userData: [userData],
        orderUser: [orderItem]
    });

    res.status(201).json({
        status: 201,
        message: "สร้าง order ใน product และบันทึกในฐานข้อมูล orders แล้ว",
        data: {
            product: product,
            order: {
                userData,
                orderUser: [orderItem]
            }
        }
    });
});




module.exports = router;
