const container = document.getElementById("container");
const categoryFilter = document.getElementById("category-filter");
const sortFilter = document.getElementById("sort-filter");
let allProducts = [];
async function fetchData() {
    container.innerHTML = "<p>Loading products...</p>";
    try {
        const response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        allProducts = data;
        populateCategoryFilter();
        displayProducts(allProducts);
    } catch (error) {
        console.error("Could not fetch data:", error);
        container.innerHTML = "<p>Sorry, we couldn't load the products. Please try again later.</p>";
    }
}
function displayProducts(products) {
    container.innerHTML = '';
    if (products.length === 0) {
        container.innerHTML = "<p>No products match your criteria.</p>";
        return;
    }
    products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";
        const imageContainer = document.createElement("div");
        imageContainer.className = "product-image-container";
        const image = document.createElement("img");
        image.className = "product-image";
        image.src = product.image;
        image.alt = product.title;
        imageContainer.append(image);
        const infoContainer = document.createElement("div");
        infoContainer.className = "product-info";
        const footerContainer = document.createElement("div");
        footerContainer.className = "product-footer";
        const category = document.createElement("span");
        category.className = "product-category";
        category.textContent = product.category;
        const title = document.createElement("h3");
        title.className = "product-title";
        title.textContent = product.title;
        const price = document.createElement("p");
        price.className = "product-price";
        price.textContent = `$${product.price.toFixed(2)}`;
        const button = document.createElement("button");
        button.className = "add-to-cart-btn";
        button.textContent = "Add to Cart";
        footerContainer.append(price, button);
        infoContainer.append(category, title, footerContainer);
        productCard.append(imageContainer, infoContainer);
        container.append(productCard);
    });
}
function populateCategoryFilter() {
    const categories = [...new Set(allProducts.map(product => product.category))];
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categoryFilter.append(option);
    });
}
function applyFiltersAndSort() {
    let filteredProducts = [...allProducts];
    const selectedCategory = categoryFilter.value;
    const selectedSort = sortFilter.value;
    if (selectedCategory !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === selectedCategory);
    }
    switch (selectedSort) {
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'rating-desc':
            filteredProducts.sort((a, b) => b.rating.rate - a.rating.rate);
            break;
    }
    displayProducts(filteredProducts);
}
categoryFilter.addEventListener('change', applyFiltersAndSort);
sortFilter.addEventListener('change', applyFiltersAndSort);
fetchData();