import React from "react";
// import Axios utk melakukan panggilan ke json server
import Axios from "axios";
// import API_URL utk bisa akses url
import { API_URL } from "../constants/API";
import { useParams } from "react-router-dom"; // way 2
// import connect from react-redux to get userId in Axios.post addToCartHandler
import { connect } from "react-redux";
import { getCartData } from "../redux/actions/cart";
import "../assets/styles/gradientStyle.css";
import swal from "sweetalert";

class ProductDetail extends React.Component {
  state = {
    // productData: menyimpan produk yg didapat sesuai dg id yg kita dpt dri route params kita
    productData: {
      // so it has nothing to do with this productdata?  bthuis is product detail page it is separate.
      price: 0,
    },

    //default value productNotFound
    productNotFound: false,
    // default qty saat utk add to cart
    quantity: 1,
  };

  fetchProductData = () => {
    // Axios.get utk mengambil data barang
    Axios.get(`${API_URL}/products`, {
      // pakai params krn utk mengambil id produk
      params: {
        // utk mengambil id produk menggunakan props
        // params kita dptkan dri react-router-dom berkat BrowserRouter
        // productId: nama route params di App.jsx
        id: this.props.params.productId,
      },
    })
      .then((result) => {
        // result.data.length jika id terdapat pd data produk
        if (result.data.length) {
          // result.data: sebuah array
          // result.data[0] artinya utk mendapatkan index pertama, hanya satu index karena id hanya satu digit
          this.setState({ productData: result.data[0] });
        } else {
          // jika id produk tdk ada pada data produk
          this.setState({ productNotFound: true });
        }
      })
      .catch(() => {
        swal({
          title: "There is some mistake in server",
          icon: "warning",
          confirm: true,
        });
      });
  };

  // function to increase and decrease qty before add to cart
  qtyBtnHandler = (action) => {
    if (action === "increment") {
      this.setState({ quantity: this.state.quantity + 1 });
      // > 1 karena at least checkout min 1
    } else if (action === "decrement" && this.state.quantity > 1) {
      this.setState({ quantity: this.state.quantity - 1 });
    }
  };

  // function to add qty of certain product to cart
  addToCartHandler = () => {
    if(this.props.userGlobal.id === 0){
      window.location.href = "/login";
    }

    Axios.get(`${API_URL}/carts`, {
      // cari data spesifik, cek apakah user dg id tsb sdh memiliki barang dg id terkait di dlm cartnya
      params: {
        userId: this.props.userGlobal.id,
        productId: this.state.productData.id,
      },
    }).then((result) => {
      // Jika barang terkait sudah ada di cart user (makanya memiliki length), gunakan patch
      if (result.data.length) {
        // patch: menambahkan qty yg sdh ada dg qty yg baru ditambahkan
        // patch membutuhkan satu parameter lg yaitu id dri barang terkait yg qtynya mau ditambahkan
        // hanya bisa ambil id {result.data[0].id} dri data cart di db.json utk barang terkait yg qty mau diedit karena API msh pakai json.server, tdk bisa dri userid & productid karena blm buat API sendiri. Id yg diambil di sini tergantung dari userId & productId apa yg diperoleh dari data cart (yg terdapat di dlm params di atas)
        // isi result.data adalah data yg dimiliki oleh carts
        // result.data[0].id ==> isi id adalah yg kita dapatkan dri kriteria di dlm params di atas
        Axios.patch(`${API_URL}/carts/${result.data[0].id}`, {
          // quantity: filed yg kita mau ubah => qty yg sdh ada + qty baru
          quantity: result.data[0].quantity + this.state.quantity,
        })
          .then(() => {
            swal({
              title: "Item added successfully",
              icon: "success",
              confirm: true,
            });
            // agar ketika klik add to cart dan berhasil, data di cart akan langsung bertambah
            // getCartData dipanggil setiap di mana terjadi perubahan pd cart
            this.props.getCartData(this.props.userGlobal.id);
          })
          .catch(() => {
            swal({
              title: "There is some mistake in server",
              icon: "warning",
              confirm: true,
            });
          });
      } else {
        // Jika barang terkait belum ada di cart user, gunakan post
        Axios.post(`${API_URL}/carts`, {
          userId: this.props.userGlobal.id,
          productId: this.state.productData.id,
          price: this.state.productData.price,
          productName: this.state.productData.productName,
          productImage: this.state.productData.productImage,
          quantity: this.state.quantity,
        })
          .then(() => {
            swal({
              title: "Item added successfully",
              icon: "success",
              confirm: true,
            });
            // agar ketika klik add to cart dan berhasil, data di cart akan langsung bertambah
            // getCartData dipanggil setiap di mana terjadi perubahan pd cart
            this.props.getCartData(this.props.userGlobal.id);
          })
          .catch(() => {
            swal({
              title: "There is some mistake in server",
              icon: "warning",
              confirm: true,
            });
          });
      }
    });
  };

  componentDidMount() {
    this.fetchProductData();
    // window.location.pathname returns the path and filename of the current page
    // console.log(window.location.pathname);
  }

  render() {
    return (
      <div className="container-fluid gradient-container">
        <div className="container">
          {this.state.productNotFound ? (
            // jika this.state.productNotFound adalah true
            <div className="alert alert-warning mt-3">
              Product with ID {this.props.params.productId} has not been found
            </div>
          ) : (
            // jika this.state.productNotFound adalah false
            <div className="d-flex justify-content-center row mt-5 bg-light bg-gradient shadow-lg rounded bg-opacity-75">
              <div className="col-5">
                <img
                  className="mt-5 pb-5"
                  style={{ width: "100%" }}
                  src={this.state.productData.productImage}
                  alt="product image"
                />
              </div>
              <div className="col-7 d-flex pt-2 pb-2 flex-column justify-content-center">
                <h4 className="fw-bold pb-3">
                  {this.state.productData.productName}
                </h4>
                <h5 className="fw-bold pb-3 text-secondary">
                  Rp {this.state.productData.price.toLocaleString("id-ID")}
                </h5>
                <div style={{textAlign: "left"}}>
                <h5 className="fw-bold pt-3">Description:</h5>
                <p className="fw-bold fs-5 pb-5">
                  {this.state.productData.description}
                </p>
                </div>
                {this.props.userGlobal.role !== "admin" ? (
                  <>
                    <div className="d-flex flex-row">
                    <span className="fw-bold fs-5" style={{paddingRight: 10}}>Qty:</span>
                    <button
                      // terdapat tanda kurung dg parameter kosong krn fungsi yg dipanggil menerima parameter
                      // decrement sesuai dg kondisi di dlm fungsi tsb
                      onClick={() => this.qtyBtnHandler("decrement")}
                      className="btn btn-warning text-white fw-bold"
                    >
                      -
                    </button>
                    <span className="fs-4 fw-bold px-3 ">{this.state.quantity}</span>
                    <button
                      // terdapat tanda kurung dg parameter kosong krn fungsi yg dipanggil menerima parameter
                      // increment sesuai dg kondisi di dlm fungsi tsb
                      onClick={() => this.qtyBtnHandler("increment")}
                      className="btn btn-warning text-white fw-bold"
                    >
                      +
                    </button>
                    </div>
                    <button
                      onClick={this.addToCartHandler}
                      className="btn btn-warning text-white mt-3 fw-bold"
                    >
                      Add to cart
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

// way 2
const withRouter = (WrappedComponent) => (props) => {
  const params = useParams();

  return <WrappedComponent {...props} params={params} />;
};

const mapStateToProps = (state) => {
  return {
    userGlobal: state.user,
  };
};

const mapDispatchToProps = {
  getCartData,
};

// export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ProductDetail)); // way 2
