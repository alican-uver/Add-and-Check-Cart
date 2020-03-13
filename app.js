document.addEventListener("DOMContentLoaded", () => {
    const request = new Request();
    const ui = new UI();

    ui.setUpApp();

    request.getData()
    .then((products) => {
        ui.showProductsOnloadPage(products);
        Storage.productsAddStorage(products);

    })
    .then(() => { // Second then use is important beacuse this functions needs to check after page loads   
        ui.getBagBtn();
        ui.cartLogic();
    })
    
    .catch((err) => {
        console.log(err);      
    });

});