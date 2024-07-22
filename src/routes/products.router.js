const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const productsFilePath = path.join(__dirname, 'products.json');

const getProducts = () => JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
const saveProducts = (products) => fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));

// Listar todos los productos con limitación opcional
router.get('/', (req, res) => {
    const limit = parseInt(req.query.limit);
    let products = getProducts();
    if (!isNaN(limit)) {
        products = products.slice(0, limit);
    }
    res.json(products);
});

// Obtener un producto por ID
router.get('/:pid', (req, res) => {
    const products = getProducts();
    const product = products.find(p => p.id === req.params.pid);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
});

// Agregar un nuevo producto
router.post('/', (req, res) => {
    const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;
    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ message: 'All fields except thumbnails are required' });
    }
    const products = getProducts();
    const id = (products.length ? Math.max(...products.map(p => parseInt(p.id))) + 1 : 1).toString();
    const newProduct = { id, title, description, code, price, status, stock, category, thumbnails };
    products.push(newProduct);
    saveProducts(products);
    res.status(201).json(newProduct);
});

// Actualizar un producto por ID
router.put('/:pid', (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    const products = getProducts();
    const productIndex = products.findIndex(p => p.id === req.params.pid);
    if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }
    const product = products[productIndex];
    products[productIndex] = { ...product, title, description, code, price, status, stock, category, thumbnails };
    saveProducts(products);
    res.json(products[productIndex]);
});

// Eliminar un producto por ID
router.delete('/:pid', (req, res) => {
    let products = getProducts();
    const productIndex = products.findIndex(p => p.id === req.params.pid);
    if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }
    products = products.filter(p => p.id !== req.params.pid);
    saveProducts(products);
    res.status(204).end();
});

module.exports = router;
