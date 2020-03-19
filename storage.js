class Storage {
    static productsAddStorage (products) {
        localStorage.setItem("products", JSON.stringify(products));
    };

    static getProduct (id) { //Match Product!
        let products = JSON.parse(localStorage.getItem("products"));
        return products.find(product => product.id === id);       
    };

    static saveProductFromCart (item) { 
        localStorage.setItem("cartProduct",JSON.stringify(item));
    };

    static getCart () { //Check Cart 
        return localStorage.getItem("cartProduct") ? JSON.parse(localStorage.getItem("cartProduct")) : [];
    };

    static getProducts () {
        let products = JSON.parse(localStorage.getItem("products"));
        return products;
    }

};