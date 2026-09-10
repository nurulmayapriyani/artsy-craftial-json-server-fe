import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Admin from "./pages/Admin";
import Cart from "./pages/Cart";
import History from "./pages/History";
import ProductDetail from "./pages/ProductDetail";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css";
import { connect } from "react-redux";
import background from "./assets/main_bg.jpg";
import { userKeepLogin, checkStorage } from "./redux/actions/user";
import { getCartData } from "./redux/actions/cart";
import "./assets/styles/gradientStyle.css";

class App extends React.Component {
  componentDidMount() {
    // jika kita tdk dpt data userLocalStorage brrti user blm login
    const userLocalStorage = localStorage.getItem("userDataEmmerce");

    if (userLocalStorage) {
      // JSON.parse mengubah object yg mnjd string menjadi object lagi
      const userData = JSON.parse(userLocalStorage);
      // alasan getCartData di simpan bersama userKeep Login karena kita mau ambil cart dari user yg sdh login
      this.props.userKeepLogin(userData);
      // getCartData meminta userId yg blm bisa kita dapatkan dri redux karena justru di dlm userKeepLogin dia yg set reduxnya tp kita bisa dapatkan dari variable userdata di atas
      this.props.getCartData(userData.id);
    } else {
      // jika ini tdk ada, ketika logout dan direfresh akan muncul Loading karena checkstorage tdk dipanggil maka tdk ada yg mengubah storageIsChecked menjadi true sdgkn storageIsChecked yg menjadi kunci utk masuk ke dlm aplikasi kita
      this.props.checkStorage();
    }
  }

  render() {
    // budu: look its like attribute, u can read it inside component by using this.props.myprop. okay hunny
    // return <Reactivity myprop="Vale from app.jsx"></Reactivity>;
    
    // condition while refresh dan and still login
    if (this.props.userGlobal.storageIsChecked) {
      return (
        <div className="App ">
          <BrowserRouter tag="div">
            <Navbar />
            <div className="flex-grow-1">
              <Routes>
                <Route element={<Login />} path="/login" />
                <Route element={<Register />} path="/register" />
                <Route element={<Admin />} path="/admin" />
                <Route element={<Cart />} path="/cart" />
                <Route element={<History />} path="/history" />
                <Route
                  element={<ProductDetail />}
                  path="/product-detail/:productId"
                />
                <Route element={<Home />} path="/" />
              </Routes>
            </div>
            <Footer></Footer>
          </BrowserRouter>
          <img className="bg-image" src={background}></img>
        </div>
      );
    }

    // condition while refresh but not login
    return <div>Loading...</div>;
  }
}

const mapStateToProps = (state) => {
  return {
    userGlobal: state.user,
  };
};

const mapDispatchToProps = {
  userKeepLogin,
  checkStorage,
  getCartData,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
