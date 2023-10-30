import { useContext, useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { DataContainer } from "../../App";
import { toast } from "react-toastify";
import { db } from '../../FirebaseConfig';
import { doc, collection, getDocs } from "firebase/firestore";
import "./product.css";

const Product = ({ addToCart }) => {
  const { setSelectedProduct } = useContext(DataContainer);
  const router = useNavigate();
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        let list = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setProductData(list);
        console.log("Retrieved product data from Firestore:", list);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };
  
    fetchData(); // Fetch data when the component mounts
  
    return () => {
      // Cleanup code to prevent re-fetching (empty function)
    };
  }, []); // Empty dependency array means this effect runs once when the component mounts

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    localStorage.setItem(`selectedProduct-${product.id}`, JSON.stringify(product));
    router(`/shop/${product.id}`);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success("Product has been added to the cart!");
  };

  return (
    <div>
      {productData.map((product) => (
        <Col key={product.id} md={3} sm={5} xs={10} className="product mtop">
          <img
            loading="lazy"
            onClick={() => handleProductClick(product)}
            src={product.imageUrl}
            alt=""
          />
          <div className="product-details">
            <h3 onClick={() => handleProductClick(product)}>
              {product.title}
            </h3>
            <div className="stock">
              <h6>In Stock!</h6>
            </div>
            <div className="price">
              <h4>RM{product.price}</h4>
              <button
                aria-label="Add"
                type="submit"
                className="add"
                onClick={() => handleAddToCart(product)}
              >
                <ion-icon name="add"></ion-icon>
              </button>
            </div>
          </div>
        </Col>
      ))}
    </div>
  );
};

export default Product;
