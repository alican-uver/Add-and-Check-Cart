class UI {
    constructor () {
        //Select Elements
        this.productsDiv = document.querySelector("#productsDiv"); 
        this.cart = []; 
        this.buttonsDom = [];
        this.displayCartTotal = document.querySelector(".cart-total");
        this.itemCount = document.querySelector(".basket-icon"); 
        this.cartContent = document.querySelector(".cart-content");
        this.cartOverlay = document.querySelector(".cart-overlay");
        this.shoppingCart = document.querySelector(".cart");
        this.exitCart = document.querySelector(".close-cart");
        this.basketIcon = document.querySelector(".shopping-icon");
        this.clearAllCart = document.querySelector(".clear-cart");
        this.openingMenuIcon = document.querySelector(".menu-icon");
        
    };

    showProductsOnloadPage (products) { //will work when the page loads
        let values = ""; 

        products.forEach(product => {
            values += `
            <div class="col-md-6 col-lg-3 pt-5">
                <div class="card shadow">
                    <img src="${product.image}" class="card-img-top" alt="...">
                    <div class="card-body text-center">
                        <h5 class="card-title pb-1">${product.title}</h5>
                        <h6 class="pb-1">${product.price}</h6>
                        <button class="btn btn-warning bag-btn" data-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i>
                               <span>Sepete Ekle</span>
                        </button>
                    </div>
                </div>
            </div>          
            `;

            this.productsDiv.innerHTML = values;
        });

    }

    getBagBtn () { // Main function this project! 
        const buttons = [...document.querySelectorAll(".bag-btn")];
        this.buttonsDom = buttons;
        buttons.forEach(button => {
            let id = button.dataset.id;
            let inCart = this.cart.find(item => item.id === id);
        
            if (inCart) {
                button.innerText = "Sepette";
                button.disabled = true;
            }
            else { 
                button.addEventListener("click", event => {
                    button.innerText = "Sepette";
                    button.disabled = true;
                    //Get Product from Products   
                    let cartItem = {...Storage.getProduct(id), amount: 1 };
                    //Add product to the cart array! 
                    this.cart = [...this.cart, cartItem];
                    //save product in local storage
                    Storage.saveProductFromCart(this.cart);
                    //set cart values
                    this.setCartValues(this.cart)
                    //display cart Item
                    this.addCartItem(cartItem);
                    //Showcart
                    this.showCart();                   
                });
            };
        });
    };

    setCartValues (cart) { // Update how many item? , totalprice
        let tempTotal = 0; 
        let itemsTotal = 0; 

        cart.map(item => {
            tempTotal += item.price * item.amount; 
            itemsTotal += item.amount; 
        });
        //Update TotalPrice and BasketIcon
        this.displayCartTotal.innerHTML = `${parseFloat(tempTotal.toFixed(2))} TL`
        this.itemCount.innerText = itemsTotal;            
    };

    addCartItem (item) { // Add Product to Cart
        const div = document.createElement("div");
        div.classList.add("cart-item");
        div.innerHTML = `
        <img src="${item.image}" alt="product">
        <div>
            <h4>${item.title}</h4>
            <h5>${item.price} TL</h5>
            <span class="remove-item" data-id=${item.id}>Sepetten Kaldır</span>
        </div>
        <div>
            <i class="fas fa-chevron-up" data-id=${item.id}></i>
            <p class="item-amount">${item.amount}</p>
            <i class="fas fa-chevron-down" data-id=${item.id}></i>    
        </div>    
        `;

        this.cartContent.appendChild(div);
    };

    showCart () { 
        this.cartOverlay.classList.add("transparentBcg");
        this.shoppingCart.classList.add("show-cart");
    };

    setUpApp () { // Will work when the page loads     
        this.cart = Storage.getCart();
        this.setCartValues(this.cart);
        this.populateCart(this.cart);
        this.exitCart.addEventListener("click", () => { //Products Cart close
            this.cartOverlay.classList.remove("transparentBcg");
            this.shoppingCart.classList.remove("show-cart");         
        });

        this.basketIcon.addEventListener("click", () => { //Products Cart opening
            this.cartOverlay.classList.add("transparentBcg");
            this.shoppingCart.classList.add("show-cart");
        }); 
        
        this.openingMenuIcon.addEventListener("click", () => { // Menu Opening
            this.openMenu();
        });

        this.navbarSlide(); 
        this.backToTopBtn(); 
        
    };

    navbarSlide () { //Navbar Scroll Effect
        const navbar = document.querySelector("#site-navbar");   
        window.addEventListener("scroll", () => {          
            window.pageYOffset > 300 ? navbar.classList.add("navbar-sticky") : navbar.classList.remove("navbar-sticky");
        });        
    }

    backToTopBtn () { //Back to Top Button
        document.querySelector("#up").addEventListener("click", () => {
            window.scrollTo(0, 0);            
        })
    }

    openMenu () { // Menu burger icon X Effect
        document.querySelector(".products-menu").classList.toggle("menu-active");
        this.openingMenuIcon.classList.toggle("toggle");
    }

    populateCart (cart) { // Add Cart to Chose Product
        cart.forEach(item => {
            this.addCartItem(item);            
        });
    };

    cartLogic () { // All deleted process
        this.clearAllCart.addEventListener("click", () => {
            this.clearCart();
        });
        //Remove, add and eject amount process! 
        this.cartContent.addEventListener("click", event => {
            if (event.target.className === "remove-item") {
                let removeItem = event.target; 
                let id = removeItem.dataset.id;

                //update again product basket text
                let matchProduct = this.cart.find(item => item.id === id);              
                const buttons = [...document.querySelectorAll(".bag-btn")];
                buttons.forEach(button => {
                    if (button.dataset.id === matchProduct.id ) {
                        button.disabled = false;
                        button.innerHTML = `<i class="fas fa-shopping-cart mr-2"></i>Sepete Ekle`;
                    };                    
                });   

                this.cart = this.cart.filter(item => item.id !== id ); //!!! Put out clicked product and return other product as array to this.cart! 
                this.setCartValues(this.cart);
                Storage.saveProductFromCart(this.cart);
                this.cartContent.removeChild(removeItem.parentElement.parentElement);    
                this.cartOverlay.classList.remove("transparentBcg");
                this.shoppingCart.classList.remove("show-cart");                     
            }

            else if (event.target.classList.contains("fa-chevron-up")) {
                let addAmount = event.target;
                let id = addAmount.dataset.id;
                let tempItem = this.cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount + 1;
                this.setCartValues(this.cart);
                Storage.saveProductFromCart(this.cart);
                addAmount.nextElementSibling.innerText = tempItem.amount;
            }

            else if (event.target.classList.contains("fa-chevron-down")) {
                let lowerAmount = event.target;
                let id = lowerAmount.dataset.id;
                let tempItem = this.cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount -1;
                if (tempItem.amount > 0 ) {
                    this.setCartValues(this.cart);
                    Storage.saveProductFromCart(this.cart);
                    lowerAmount.previousElementSibling.innerText = tempItem.amount;
                }
                else {
                    this.cart = this.cart.filter(item => item.id !== id);          
                    this.setCartValues(this.cart);
                    Storage.saveProductFromCart(this.cart);
                    this.cartContent.removeChild(lowerAmount.parentElement.parentElement);
                    const buttons = [...document.querySelectorAll(".bag-btn")];
                    buttons.forEach(button => {
                      if (button.dataset.id === id) {
                        button.disabled = false;
                        button.innerHTML = `<i class="fas fa-shopping-cart mr-2"></i>Sepete Ekle`;
                      }
                    });
                  }
            }       
        });
    };

    clearCart () { // All products deleted process
        this.cart = []; 
        this.setCartValues(this.cart); //Update Cart
        Storage.saveProductFromCart(this.cart); //Update Storage
        const buttons = [...document.querySelectorAll(".bag-btn")]; 
        buttons.forEach(button => { //Update Button Active
            button.disabled = false;
            button.innerHTML = `<i class="fas fa-shopping-cart mr-2"></i>Sepete Ekle`;
        });
        this.cartContent.innerHTML = "";
        this.cartOverlay.classList.remove("transparentBcg");
        this.shoppingCart.classList.remove("show-cart");    
    };

};