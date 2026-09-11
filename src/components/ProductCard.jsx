import React from "react";
import "../assets/styles/productCard.css";
// import Link krn menggunakan tag Link
import { Link } from "react-router-dom";
// import react-redux krn kita perlu user id di params addToCartHandler
import { connect } from "react-redux";
import Axios from "axios";
import { API_URL } from "../constants/API";
import { getCartData } from "../redux/actions/cart";
import swal from "sweetalert";

class ProductCard extends React.Component {
  addToCartHandler = () => {
    if(this.props.userGlobal.id === 0){
      window.location.href = "/login";
      return;
    }

    Axios.get(`${API_URL}/carts`, { 
      // cari data spesifik, check apakah user sudah memiliki barang tsb di cart
      params: {
        userId: this.props.userGlobal.id,
        productId: this.props.productData.id, // we give product id so it will filter only this product id and user. there should be only one product with a product id and userid
      },
    }).then((result) => { // same like this result.
      // Jika barangnya sudah ada di cart user
      if (result.data.length) { // this checks if length is not zero. okk i ge it
        // hanya bisa ambil id {result.data[0].id} data cart dri qty barang yg mau diedit karena API msh pakai json.server, tdk bisa dri userid & productid karena blm buat API sendiri. Id yg diambil di sini tergantung dari userId & productId apa yg diperoleh dari data cart (yg terdapat di dlm params di atas)
        Axios.patch(`${API_URL}/carts/${result.data[0].id}`, { // why is it use [0] to get first item of array. api will return array even if it is one product.
          quantity: result.data[0].quantity + 1,
        })
          .then(() => {
            swal({
              title: "Item added successfully",
              icon: "success",
              confirm: true
            });

            this.props.getCartData(this.props.userGlobal.id);
          })
          .catch(() => {
            swal({
              title: "There is some mistake in server",
              icon: "warning",
              confirm: true
            });
          });
      } else {
        // Jika barangnya belum ada di cart user
        Axios.post(`${API_URL}/carts`, {
          userId: this.props.userGlobal.id,  // userId is stored in store. Not inside product data. productData only contains product details.
          // productData: menyimpan data product
          productId: this.props.productData.id,
          price: this.props.productData.price,
          productName: this.props.productData.productName,
          productImage: this.props.productData.productImage,
          quantity: 1,
        })
          .then(() => {
            swal({
              title: "Item added successfully",
              icon: "success",
              confirm: true
            });

            this.props.getCartData(this.props.userGlobal.id);
          })
          .catch(() => {
            swal({
              title: "There is some mistake in server",
              icon: "warning",
              confirm: true
            });
          });
      }
    });
  };

  render() {
    return (
      <div className="card product-card">
        <img
          // productImage: dari db.json
          // productData: dari home page
          // process.env.PUBLIC_URL to make picts show up
          src={process.env.PUBLIC_URL + this.props.productData.productImage}
          alt=""
        />
        <div className="mb-2">
          <div>
            <Link
              // membuat page produk detail utk setiap produk data dg masing2 produk id sbg url address
              to={`/product-detail/${this.props.productData.id}`}
              // textDecoration: "none" utk menghilangkan garis bawah ketika dihover
              // color: "inherit" utk membuat tulisan hitam default
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {/* productName: dari db.json */}
              {/* productData: dari home page */}
              <div className="fw-bold" style={{textAlign: "left", paddingLeft: 5}}>
                {this.props.productData.productName}
              </div>
            </Link>
            {/* price: dari db.json */}
            {/* productData: dari home page */}
            <div style={{textAlign: "left", paddingLeft: 5}}>
            <span className="text-muted fw-bold">
              Rp{this.props.productData.price.toLocaleString("id-ID")}
            </span>
            </div>
          </div>
          {this.props.userGlobal.role !== "admin" ? (
            <div className="d-flex flex-row justify-content-end">
              <button
                onClick={this.addToCartHandler}
                className="btn btn-warning text-light mt-2 fw-bold"
              >
                Add to cart
              </button>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userGlobal: state.user,
  };
};

const mapDispatchToProps = {
  getCartData,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductCard);
