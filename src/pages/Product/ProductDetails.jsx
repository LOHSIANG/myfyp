import { Fragment, useContext, useEffect, useState } from "react";
import Banner from "../../components/Banner/Banner";
import { DataContainer } from "../../App";
import { Col, Container, Row } from "react-bootstrap";
import ShopList from "../../components/ShopList";
import { products } from "../../utils/products";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "../../index.css"
import "./ProductDetails.css"

const ProductDetails = () => {
    const [listSelected,setListSelected] =useState("desc");
    const [relatedProducts,setRelatedProducts] =useState([]);
    const {selectedProduct,setSelectedProduct,addToCart} =useContext(DataContainer);
    const {id} =useParams();
    if(!selectedProduct) {
        const storedProduct =localStorage.getItem(`selectedProduct-${id}`);
        setSelectedProduct(JSON.parse(storedProduct));
    }
    const [quantity, setQuantity] = useState(1);
    const handleQuantityChange = (event) => {
        setQuantity(parseInt(event.target.value));
    };
    const handelAdd =(selectedProduct,quantity)=> {
        addToCart(selectedProduct,quantity);
        toast.success("Product has been added to cart!");
    }
    useEffect(()=> {
        window.scrollTo(0,0);
        setRelatedProducts(products.filter(item => item.category === selectedProduct?.category && item.id !== selectedProduct?.id));
    },[selectedProduct])
    return ( 
        <Fragment>
            <Banner title={selectedProduct?.productName} />
            <section className="product-page">
                <Container>
                    <Row className="justify-content-center">
                        <Col md={6}>
                            <img loading="lazy" src={selectedProduct?.imgUrl} alt=""/>
                        </Col>
                        <Col md={6} style={{ paddingTop: '150px', paddingLeft: '100px'}}>
                            <h2>{selectedProduct?.productName}</h2>
                            <div className="info">
                                <span className="price">RM{selectedProduct?.price}</span>
                                <span>category:{selectedProduct?.category}</span>
                            </div>
                            <input className="qty-input" type="number" placeholder="Qty" value={quantity} onChange={handleQuantityChange} />
                            <button aria-label="Add" type="submit" className="add" onClick={() => handelAdd(selectedProduct,quantity)}>Add To Cart</button>
                        </Col>
                    </Row>
                </Container>
            </section>
            <section className="related-products">
                <Container>
                    <h3>You might also like</h3>
                </Container>
                <ShopList productItems={relatedProducts} addToCart={addToCart}/>
            </section>
        </Fragment>
    );
}

export default ProductDetails;