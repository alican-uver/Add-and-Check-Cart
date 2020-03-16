class Request {
    async getData () {
        try  {
            const response = await fetch("products.json");
            const json = await response.json();
            const items = json.items;          
            const products = items.map(item => {
                return {  //Change items structure
                    id : item.id,
                    title : item.fields.title,
                    price : item.fields.price,
                    category : item.fields.category,
                    image: item.fields.image.fields.file.url
                };
            });       
            
            return products;                      
        }
        catch (error) {
            console.log(error); 
        };
    };
};
