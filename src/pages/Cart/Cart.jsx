import { useContext, useEffect, useState } from "react"
import { DataContainer } from "../../App"
import { Col, Container, Row } from "react-bootstrap"
import { db } from '../../FirebaseConfig'
import { getAuth } from 'firebase/auth'
import { collection, addDoc, updateDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import "./Cart.css"
import "../../index.css"

const Cart = () => {
  const { CartItem, setCartItem, addToCart, decreaseQty, deleteProduct} =useContext(DataContainer);
  const totalPrice = CartItem.reduce((price, item) => price + item.qty * item.price, 0)
  const [selectedWarehouse, setSelectedWarehouse] = useState('');

  const warehouseAddresses = {
    'Warehouse-1': 'Penang International Airport, MAS Cargo Complex, Block A, No 1 Cargo Agent Building, Jalan Garuda, 11900 Bayan Lepas, Penang',
    'Warehouse-2': 'MK6, Lot 1061, Jalan Pengkalan, Bukit Tengah, 14000 Bukit Mertajam, Penang',
  };
  
  const handleCheckout = async () => {
  const user = getAuth().currentUser;
  if (user) {
    // Create a new order document in Firestore
    const ordersCollection = collection(db, 'orders');
    const orderData = {
      userId: user.uid,
      products: CartItem,
      totalPrice: totalPrice,
      timeStamp: serverTimestamp(),
      status: 'processing',
    };

    // Add the order to Firestore
    const orderDocRef = await addDoc(ordersCollection, orderData);

    // Deduct the quantity of products in Firestore based on the selected warehouse
    for (const item of CartItem) {
      const productDocRef = doc(db, 'products', item.id);
      const productSnapshot = await getDoc(productDocRef);
      if (productSnapshot.exists()) {
        const productData = productSnapshot.data();
        const selectedWarehouse = `warehouse${selectedWarehouse.charAt(selectedWarehouse.length - 1)}`; // Extract the warehouse number

        // Check if the product has the same warehouse as the selected one
        if (productData.inv === selectedWarehouse) {
          // Update the quantity for the selected warehouse
          const newQuantity = productData.quantity - item.qty;
          const updateData = { quantity: newQuantity };
          await updateDoc(productDocRef, updateData);
        }
      }
    }

    // Clear the cart after checkout
    setCartItem([]);
    localStorage.removeItem('cartItem');
  } else {
    console.log('User is not logged in');
  }
};
  
  useEffect(()=> {
    window.scrollTo(0,1);
    if(CartItem.length ===0) {
      const storedCart = localStorage.getItem("cartItem");
      setCartItem(JSON.parse(storedCart));
    }
  },[])
  return (
      <section className='cart-items'>
        <Container>
          <Row className="justify-content-center">
              <Col className="cartCol">
                {CartItem.length === 0 && <h1 className='no-items'>No Items are add in Cart</h1>}
                {CartItem.map((item) => {
                  const productQty = item.price * item.qty
                  return (
                    <div className='cart-list' key={item.id}>
                      <Row>
                        <Col className="image-holder">
                          <img src={item.img} alt='' />
                        </Col>
                        <Col sm={8} md={9}>
                          <Row className="cart-content justify-content-center">
                            <Col xs={12} sm={9} className="cart-details">
                              <h3>{item.title}</h3>
                              <h4>
                                RM{item.price}.00 x {item.qty}
                                <span>RM{productQty}.00</span>
                              </h4>
                            </Col>
                            <Col xs={12} sm={3} className='cartControl'>
                              <button className='incCart' onClick={() => addToCart(item)}>
                                <i className='fa-solid fa-plus'></i>
                              </button>
                              <button className='desCart' onClick={() => decreaseQty(item)}>
                                <i className='fa-solid fa-minus'></i>
                              </button>
                            </Col>
                          </Row>
                        </Col>
                        <button className="delete" onClick={()=> deleteProduct(item)}>
                            <ion-icon name="close"></ion-icon>
                        </button>
                      </Row>
                    </div>
                  )
                })}
              </Col>
              <Col md={4} className="cartCol">
                <div className='cart-total'>
                  <h2>Cart Summary</h2>
                  <div className='d_flex'>
                    <h4>Ship From :</h4>
                    <select
                      value={selectedWarehouse}
                      onChange={(e) => setSelectedWarehouse(e.target.value)}
                      className="warehouse-select"
                    >
                      <option value="">Select a Warehouse</option>
                      <option value="Warehouse-1">Warehouse 1</option>
                      <option value="Warehouse-2">Warehouse 2</option>
                    </select>
                    {selectedWarehouse && (
                      <div className="warehouse-address">
                        <h4>Warehouse Address:</h4>
                        <p>{warehouseAddresses[selectedWarehouse]}</p>
                        <h7>Free Shipping</h7>
                      </div>
                    )}
                    <h4>Total Price :</h4>
                    <h3>RM{totalPrice}.00</h3>
                  </div>
                  <button className="checkout-button" onClick={handleCheckout}>
                    Checkout
                  </button>
                </div>
              </Col>
          </Row>
        </Container>
      </section>
  )
}

export default Cart
