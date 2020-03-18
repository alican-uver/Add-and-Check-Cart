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
        ui.categoryBtn();
    })
    
    .catch((err) => {
        console.log(err);      
    });

});

const rangeInput = document.getElementById("my-range");
const pValue = document.getElementById("value");
rangeInput.addEventListener("change", function() {
    console.log(rangeInput.value);
    pValue.innerHTML = `
        value: ${rangeInput.value}
    `
})


    
    





 





