import { useContext, useEffect } from "react"
import { DataContainer } from "../../App"
import { Col, Container, Row } from "react-bootstrap"
import { database } from '../../FirebaseConfig'
import { getAuth } from 'firebase/auth'
import "./Cart.css"
import "../../index.css"

const Cart = () => {
  const { CartItem, setCartItem, addToCart, decreaseQty, deleteProduct} =useContext(DataContainer);
  const totalPrice = CartItem.reduce((price, item) => price + item.qty * item.price, 0)

  // Function to handle the checkout process and send data to Firebase
  const handleCheckout = () => {
    const user = getAuth().currentUser; // Using Firebase authentication
    if (user) {
      const purchasesRef = database.ref(`/users/${user.uid}/purchases`);
      const purchaseData = {
        products: CartItem,
        totalPrice: totalPrice,
        // Add other relevant purchase information
      };

      // Push the purchase data to Firebase using the database reference
      purchasesRef.push(purchaseData);

      // Clear the cart after checkout
      setCartItem([]);

      // Optionally, you can also clear the cart data in local storage
      localStorage.removeItem('cartItem');
    } else {
      // Handle the case where the user is not authenticated
      console.log('User is not logged in');
    }
  };
  
  useEffect(()=> {
    window.scrollTo(0,0);
    if(CartItem.length ===0) {
      const storedCart = localStorage.getItem("cartItem");
      setCartItem(JSON.parse(storedCart));
    }
  },[])
  return (
      <section className='cart-items'>
        <Container>
          <Row className="justify-content-center">
              <Col md={8}>
                {CartItem.length === 0 && <h1 className='no-items product'>No Items are add in Cart</h1>}
                {CartItem.map((item) => {
                  const productQty = item.price * item.qty
                  return (
                    <div className='cart-list' key={item.id}>
                      <Row>
                        <Col className="image-holder" sm={4} md={3}>
                          <img src={item.imgUrl} alt='' />
                        </Col>
                        <Col sm={8} md={9}>
                          <Row className="cart-content justify-content-center">
                            <Col xs={12} sm={9} className="cart-details">
                              <h3>{item.productName}</h3>
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
              <Col md={4} className="cart-summary">
                <div className='cart-total'>
                  <h2>Cart Summary</h2>
                  <div className=' d_flex'>
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
