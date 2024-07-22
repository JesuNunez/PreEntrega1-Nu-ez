const express = require('express');
const app = express();
const productsRouter = require('./routes/products.router.js');
const cartsRouter = require('./routes/cart.router.js');

app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); //Hecho en ingles a proposito
});

