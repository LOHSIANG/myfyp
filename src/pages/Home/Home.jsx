import { Fragment, useContext, useEffect } from "react"
import {products} from "../../utils/products"
import { DataContainer } from "../../App"
import SliderHome from "../../components/Slider"
import "./Home.css"
import "../../index.css"

const Home = () => {
  const {addToCart} =useContext(DataContainer);
  const newArrivalData = products.filter(item => item.category ==="mobile" || item.category ==="wireless");
  const bestSales = products.filter(item => item.category ==="sofa");
  useEffect(()=> {
    window.scrollTo(0,0);
  },[])
  return (
    <Fragment>
        <SliderHome/>

    </Fragment>
  )
}

export default Home
