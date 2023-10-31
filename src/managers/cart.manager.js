import fs from "fs";

export class CartManager {
  constructor(path) {
    this.path = path;
  }

  async getCarts() {
    try {
      if (fs.existsSync(this.path)) {
        const cartsJSON = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(cartsJSON);
      } else return [];
    } catch (error) {
      console.log(error);
    }
  }

  async #getMaxId() {
    let maxId = 0;
    const carts = await this.getCarts();
    carts.map((prod) => {
      if (prod.id > maxId) maxId = prod.id;
    });
    return maxId;
  }

  async createCart() {
    try {
      const cart = {
        id: (await this.#getMaxId()) + 1,
        products: [],
      };
      const cartsFile = await this.getCarts();
      cartsFile.push(cart);
      await fs.promises.writeFile(this.path, JSON.stringify(cartsFile));
      return cart;
    } catch (error) {
      console.log(error);
    }
  }

  async getCartById(id) {
    try {
        const carts = await this.getCarts();
        const cart = carts.find(c => c.id === id);
        if(!cart) return false;
        return cart;
    } catch (error) {
        console.log(error);
    }
  }

  async saveProductToCart(idCart, idProd){
    try {
      const carts = await this.getCarts();
      const cartExists = await this.getCartById(idCart);
      if(cartExists){
          const existProdInCart = cartExists.products.find(p => p.idProduct === idProd);
          const index = carts.findIndex(cart => cart.id === idCart); 
        
          if(existProdInCart)
             existProdInCart.quantity ++;
          
          else {
            console.log("false");
              const prod = {
                  idProduct: idProd,
                  quantity: 1
              };
              cartExists.products.push(prod); 
           }
           
           
          carts[index] = cartExists;
          await fs.promises.writeFile(this.path, JSON.stringify(carts));
          return cartExists;
      }
    } catch (error) {
      console.log(error);
    }
  }
}

