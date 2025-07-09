// --- DOM Element Selection ---
const container = document.getElementById("container");
const categoryFilter = document.getElementById("category-filter");
const sortFilter = document.getElementById("sort-filter");

// --- State Management ---
// This array will hold the original, complete list of products from the API.
let allProducts = [];

// --- API Fetching ---
async function fetchData() {
    // Show a loading message
    container.innerHTML = "<p>Loading products...</p>";
    try {
        const response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Store the full list of products
        allProducts = data;

        // Initial setup
        populateCategoryFilter();
        displayProducts(allProducts); // Display all products initially

    } catch (error) {
        console.error("Could not fetch data:", error);
        container.innerHTML = "<p>Sorry, we couldn't load the products. Please try again later.</p>";
    }
}

// --- Display Logic ---
function displayProducts(products) {
    // Clear the container before displaying new products
    container.innerHTML = '';

    // If there are no products to display (after filtering)
    if (products.length === 0) {
        container.innerHTML = "<p>No products match your criteria.</p>";
        return;
    }

    products.forEach(product => {
        // (This part is the same as before)
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

// --- Filter and Sort Logic ---

// Dynamically creates category options based on the fetched products
function populateCategoryFilter() {
    // Get unique categories using a Set for efficiency
    const categories = [...new Set(allProducts.map(product => product.category))];
    
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        // Capitalize first letter for better display
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categoryFilter.append(option);
    });
}

// This is the core function that applies all active filters and sorting
function applyFiltersAndSort() {
    let filteredProducts = [...allProducts]; // Start with a fresh copy of all products
    const selectedCategory = categoryFilter.value;
    const selectedSort = sortFilter.value;

    // 1. Apply Category Filter
    if (selectedCategory !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === selectedCategory);
    }

    // 2. Apply Sorting
    switch (selectedSort) {
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'rating-desc':
            // The rating is inside an object: { rate: 3.9, count: 120 }
            filteredProducts.sort((a, b) => b.rating.rate - a.rating.rate);
            break;
        // 'default' case does nothing, preserving the original order (or the order after category filtering)
    }

    // 3. Re-render the page with the filtered and sorted products
    displayProducts(filteredProducts);
}

// --- Event Listeners ---
// Add event listeners to the dropdowns to trigger the filter function
categoryFilter.addEventListener('change', applyFiltersAndSort);
sortFilter.addEventListener('change', applyFiltersAndSort);

// --- Initial Call ---
// Fetch data as soon as the page loads
fetchData();