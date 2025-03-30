/*
Problem statement
Using the HTML code given in the scaffold, implement a fully functional online shopping 
which should use an API for all the products.

Requirements:-
1- Fetch all the products using the following API: https://dummyjson.com/products
2- The JSON you get from the API contain detail of each product, such as title, price, rating, images, etc.\
3- Each product fetched from the API should be displayed on the screen.
4- The API gives you more than one image for each product. The product should be displayed in such a way that it should have the option to toggle the images to the next or previous images.
5- Each product should have the corresponding "Add to Cart" option, which should be able to add the corresponding product to the cart.
6- There should be a cart button at the top page on click, of which the content of the page could be toggled from the cart section to all product sections and vice-versa.
7- The cart section should display all the products that have been added by the user with the quantity.
8- There should be an option to decrease the quantity of the product or remove the product from the cart.
9- In the cart section, there should be a "checkout" button on click of which an alert should be shown with the total price to be paid by the user.
*/

const productsContainer = document.querySelector(".products");
const cartContainer = document.getElementById("cart");
const cartBtn = document.getElementById("cartBtn");
const checkoutBtn = document.getElementById("checkoutBtn");

let cart = [];

// Fetch products from API
fetch("https://dummyjson.com/products")
.then(response => response.json())
.then(data => displayProducts(data.products))
.catch(error => console.error("Error fetching products:", error));

function displayProducts(products) {
    productsContainer.innerHTML = ""; 

    products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("product");

        let imageIndex = 0;

        productCard.innerHTML = `
            <div class="img_con">
                <button class="prev-btn">❮</button>
                <img src="${product.images[imageIndex]}" class="product-image">
                <button class="next-btn">❯</button>
            </div>
            <div class="card_footer">
                <h3>${product.title}</h3>
                <p>Price: $${product.price}</p>
                <button class="addToCartBtn">Add to Cart</button>
            </div>
        `;

        const imageElement = productCard.querySelector(".product-image");
        const prevBtn = productCard.querySelector(".prev-btn");
        const nextBtn = productCard.querySelector(".next-btn");

        prevBtn.addEventListener("click", () => {
            imageIndex = (imageIndex - 1 + product.images.length) % product.images.length;
            imageElement.src = product.images[imageIndex];
        });

        nextBtn.addEventListener("click", () => {
            imageIndex = (imageIndex + 1) % product.images.length;
            imageElement.src = product.images[imageIndex];
        });

        productCard.querySelector(".addToCartBtn").addEventListener("click", () => addToCart(product));

        productsContainer.appendChild(productCard);
    });
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
}

function updateCart() {
    cartContainer.innerHTML = "<h2>Cart</h2>";

    cart.forEach(item => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart_item");

        cartItem.innerHTML = `
            <span>${item.title}</span>
            <span>Price: $${item.price}</span>
            <span>Qty: ${item.quantity}</span>
            <button class="increase">+</button>
            <button class="decrease">-</button>
            <button class="remove">Remove</button>
        `;

        cartItem.querySelector(".increase").addEventListener("click", () => {
            item.quantity++;
            updateCart();
        });

        cartItem.querySelector(".decrease").addEventListener("click", () => {
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                cart = cart.filter(cartItem => cartItem.id !== item.id);
            }
            updateCart();
        });

        cartItem.querySelector(".remove").addEventListener("click", () => {
            cart = cart.filter(cartItem => cartItem.id !== item.id);
            updateCart();
        });

        cartContainer.appendChild(cartItem);
    });
}

cartBtn.addEventListener("click", () => {
    productsContainer.classList.toggle("hide");
    cartContainer.classList.toggle("show");
});

checkoutBtn.addEventListener("click", () => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    alert(`Thankyou for shopping!!!\nYour Total Price: $${total}`);
});