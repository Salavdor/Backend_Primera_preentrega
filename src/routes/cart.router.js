import { Router } from "express";
const router = Router();

import { ProductManager } from "../managers/product.manager.js";
import { CartManager } from "../managers/cart.manager.js";

const productManager = new ProductManager("./src/data/products.json");
const cartManager = new CartManager("./src/data/carts.json");

router.post('/', async(req, res)=>{
    try {
        const cartCreated = await cartManager.createCart();
        res.status(200).json(cartCreated);
      } catch (error) {
        res.status(500).json(error.message);
      }
});

router.get('/:cid', async(req, res)=>{
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCartById(Number(cid));
        if (!cart) res.status(404).json({ message: "cart not exist" });
        else res.status(200).json(cart);
      } catch (error) {
        res.status(500).json(error.message);
      }
})

router.post('/:idCart/product/:idProd', async(req, res)=>{
    try {
        const { idProd } = req.params;
        const { idCart } = req.params;  //id de cart existente

        const cart = await cartManager.getCartById(Number(idCart));
        const product = await productManager.getProductById(Number(idProd));

        if(!cart)res.status(404).json({ message: "cart not exist" });  
        if (!product) res.status(404).json({ message: "product not found" });
        if (product && cart) {
            const cartCreated = await cartManager.saveProductToCart(Number(idCart), Number(idProd));
            res.status(200).json(cartCreated);
        }
      } catch (error) {
        res.status(500).json(error.message);
      }
});

export default router;