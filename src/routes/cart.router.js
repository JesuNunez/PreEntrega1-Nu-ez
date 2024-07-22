const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const cartsFilePath = path.join(__dirname, 'cart.json');

const getCarts = () => JSON.parse(fs.readFileSync(cartsFilePath, 'utf-8'));
const saveCarts = (carts) => fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));

// Crear un nuevo carrito
router.post('/', (req, res) => {
    const carts = getCarts();
    const id = (carts.length ? Math.max(...carts.map(c => parseInt(c.id))) + 1 : 1).toString();
    const newCart = { id, products: [] };
    carts.push(newCart);
    saveCarts(carts);
    res.status(201).json(newCart);
});

// Listar los productos de un carrito por ID
router.get('/:cid', (req, res) => {
    const carts = getCarts();
    const cart = carts.find(c => c.id === req.params.cid);
    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }
    res.json(cart.products);
});

// Agregar un producto al carrito por ID
router.post('/:cid/product/:pid', (req, res) => {
    const carts = getCarts();
    const cartIndex = carts.findIndex(c => c.id === req.params.cid);
    if (cartIndex === -1) {
        return res.status(404).json({ message: 'Cart not found' });
    }
    const { pid } = req.params;
    const cart = carts[cartIndex];
    const productIndex = cart.products.findIndex(p => p.product === pid);
    if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
    } else {
        cart.products.push({ product: pid, quantity: 1 });
    }
    saveCarts(carts);
    res.json(cart.products);
});

module.exports = router;
