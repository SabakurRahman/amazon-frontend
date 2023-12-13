import React from "react";
import "./App.css";
import data from "./data";
function App() {
  return (
    <>
      <header>
        <a href="#">amazona</a>
      </header>
      <main>
        <h1>Feature Product</h1>
        <div className="products">
          {data.product.map((product) => (
            <div className="product" key={product.slug}>
              <a href={`/product/${product.slug}`}>
                <img src={product.image} alt={product.name} />
              </a>
              <div className="product-info">
                <a href={`/product/${product.slug}`}>
                  <p>{product.name}</p>
                </a>
                <p>
                  <strong>${product.price}</strong>
                </p>
                <button>Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

export default App;
