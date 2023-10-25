import { useContext, useEffect, useState } from "react"
import { Container, Nav, Navbar } from "react-bootstrap";
import "./navbar.css";
import { DataContainer } from "../../App";
import { Link } from "react-router-dom";

const NavBar = () => {
  const {CartItem,setCartItem} =useContext(DataContainer);
  const [expand, setExpand] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  // fixed Header
  function scrollHandler() {
    if (window.scrollY >= 100) {
        setIsFixed(true);
    } else if(window.scrollY <= 50) {
        setIsFixed(false);
    }
  }
  window.addEventListener("scroll", scrollHandler);
  useEffect(()=> {
    if(CartItem.length ===0) {
      const storedCart = localStorage.getItem("cartItem");
      setCartItem(JSON.parse(storedCart));
    }
  },[])
  return (
      <Navbar
      fixed="top"
      expand="md"
      className={isFixed ? "navbar fixed":"navbar"}
      >
        <Container className="navbar-container">
            <Navbar.Brand to="/">
              <ion-icon name="home"></ion-icon>
              <h1 className="logo">MYFYP</h1>
            </Navbar.Brand>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Nav.Item>
                  <Link aria-label="Go to Home Page" className="navbar-link" to="/" onClick={() => setExpand(false)}>
                      <span className="nav-link-label">Home</span>
                  </Link>
                </Nav.Item>

                <Nav.Item>
                <Link aria-label="Go to Shop Page" className="navbar-link" to="/shop" onClick={() => setExpand(false)}>
                    <span className="nav-link-label">Shop</span>
                </Link>
                </Nav.Item>

                <Nav.Item>
                <Link aria-label="Go to Cart Page" className="navbar-link" to="/cart" onClick={() => setExpand(false)}>
                    <span className="nav-link-label">Cart</span>
                </Link>
                </Nav.Item>
                
                <Nav.Item className="expanded-cart">
                  <div className="icon-container">
                    <i className="fas fa-user nav-icon"></i>
                  </div>
                  <Link aria-label="Go to Cart Page" to="/cart" className="cart" data-num={CartItem.length}>
                    <div className="icon-container">
                      <i className="fas fa-shopping-cart nav-icon"></i>
                    </div>
                  </Link>
                </Nav.Item>
              </Nav>
        </Navbar.Collapse>
        </Container>
      </Navbar>
  )
}

export default NavBar
