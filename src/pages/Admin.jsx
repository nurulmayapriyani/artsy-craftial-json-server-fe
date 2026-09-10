import React from "react";
// import Axios setiap kali terdapat panggilan ke API
import Axios from "axios";
// import API_URL krn kita mau data dari halaman url API
import { API_URL } from "../constants/API";
// import admin.css utk setelan productImage
import "../assets/styles/admin.css";
// import connect utk tahu role yg sdg login sbg user atau admin
import { connect } from "react-redux";
// import navigate utk navigate login as user to home page and they can't access admin page
import { Navigate } from "react-router-dom";
import swal from "sweetalert";

class Admin extends React.Component {
  state = {
    loading: false,
    // productList: untuk menyimpan data product list
    productList: [],
    filterProductList: [],

    page: 1,
    // maxPage: 0 ==> krn tergantung pd length of produk
    maxPage: 0,
    // itemPerPage: declare amount of product item per page
    itemPerPage: 8,
    searchProductName: "",

    // utk menyimpan input dari form item baru
    addProductName: "",
    addPrice: 0,
    addProductImage: "",
    addDescription: "",
    addCategory: "",

    // default editId, supaya kita tahu ketika edit sebuah produk merupakan item yang mana
    editId: 0,

    // untuk menyimpan input dari form edit
    editProductName: "",
    editPrice: 0,
    editProductImage: "",
    editDescription: "",
    editCategory: "",
  };

  fetchProducts = () => {
    this.setState({ loading: true });
    Axios.get(`${API_URL}/products`)
      .then((result) => {
        let maxPage = Math.ceil(result.data.length / this.state.itemPerPage);
        this.setState({
          productList: result.data,
          maxPage: maxPage,
          filterProductList: result.data,
          loading: false,
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          loading: false,
        });
        swal({
          title: "There is some mistake in server",
          icon: "warning",
          confirm: true,
        });
      });
  };

  // karena mau digunakan di renderProducts maka sebaiknya ditempatkan di atas renderProducts
  editToggle = (editData) => {
    // setState dibuat agar ketika edit produk pada form edit, form menampilkan data produk yg akan bisa kita edit
    this.setState({
      editId: editData.id,
      editProductName: editData.productName,
      editPrice: editData.price,
      editProductImage: editData.productImage,
      editDescription: editData.description,
      editCategory: editData.category,
    });
  };

  // jika edit dicancel form edit akan hilang dan data tampil spt semula
  cancelEdit = () => {
    this.setState({ editId: 0 });
  };

  // copied the function from home
  paginationHandler = (page) => {
    if (page <= this.state.maxPage && page >= 1) {
      this.setState({ page: page });
    }
  };

  filterHandler = () => {
    let filterProducts = this.state.productList.filter((p) =>
      p.productName
        .toLowerCase()
        .includes(this.state.searchProductName.toLowerCase())
    );
    this.setState({
      filterProductList: filterProducts,
      maxPage: Math.ceil(filterProducts.length / this.state.itemPerPage),
      page: 1,
    });
  };

  // function utk tombol save ketika edit produk
  saveBtnHandler = () => {
    // Axios.patch harus memiliki id dari produk yg mau didelete
    // editId: menyimpan id dari produk yg kita mau edit
    Axios.patch(`${API_URL}/products/${this.state.editId}`, {
      // key object: field yg kita mau edit, value object: value baru setelah diedit
      productName: this.state.editProductName,
      price: parseInt(this.state.editPrice),
      productImage: this.state.editProductImage,
      description: this.state.editDescription,
      category: this.state.editCategory,
    })
      .then(() => {
        // fetchproducts memberikan data terbaru setelah produk diedit
        this.fetchProducts();
        // setelah disave, form edit akan hilang dan data tampil spt semula
        this.cancelEdit();
      })
      .catch((err) => {
        console.log(err);

        swal({
          title: "There is some mistake in server",
          icon: "warning",
          confirm: true,
        });
      });
  };

  // function utk tombol delete
  deleteBtnHandler = async (deleteId) => {
    // await will make code wait here until there is response in confirmDelete. So both cancel and delete buttons will works
    const confirmDelete = await swal({
      title: "Are you sure to delete this?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    if (confirmDelete) {
      // Axios.delete harus memiliki id dari produk yg mau didelete
      Axios.delete(`${API_URL}/products/${deleteId}`)
        .then(() => {
          // fetchproducts memberikan data terbaru setelah produk didelete
          this.fetchProducts();
        })
        .catch((err) => {
          console.log(err);
          swal({
            title: "There is some mistake in server",
            icon: "warning",
            confirm: true,
          });
        });
    } else {
      swal({
        title: "Delete Canceled",
        icon: "info",
        confirm: true,
      });
    }
  };

  renderProducts = () => {
    const beginningIndex = (this.state.page - 1) * this.state.itemPerPage;

    // slice: menentukan index produk ke berapa saja yg ditampilkan pada setiap pagenya
    return this.state.filterProductList
      .slice(beginningIndex, beginningIndex + this.state.itemPerPage)
      .map((val) => {
        // jika barang sdg diedit maka yg ditampilkan berupa form yg bisa diinput
        if (val.id === this.state.editId) {
          return (
            <tr>
              <td>{val.id}</td>
              <td>
                <input
                  value={this.state.editProductName}
                  onChange={this.inputHandler}
                  type="text"
                  className="form-control fw-bold"
                  name="editProductName"
                />
              </td>
              <td>
                <input
                  value={this.state.editPrice}
                  onChange={this.inputHandler}
                  type="number"
                  className="form-control fw-bold"
                  name="editPrice"
                />
              </td>
              <td>
                <input
                  value={this.state.editProductImage}
                  onChange={this.inputHandler}
                  type="text"
                  className="form-control fw-bold"
                  name="editProductImage"
                />
              </td>
              <td>
                <input
                  value={this.state.editDescription}
                  onChange={this.inputHandler}
                  type="text"
                  className="form-control fw-bold"
                  name="editDescription"
                />
              </td>
              <td>
                <select
                  value={this.state.editCategory}
                  onChange={this.inputHandler}
                  name="editCategory"
                  className="form-control fw-bold"
                >
                  <option value="" className="fw-bold">
                    All Items
                  </option>
                  <option value="Softcover Notebook" className="fw-bold">
                    Softcover Notebook
                  </option>
                  <option value="Spiral Notebook" className="fw-bold">
                    Spiral Notebook
                  </option>
                  <option value="Pop Socket" className="fw-bold">
                    Pop Socket
                  </option>
                </select>
              </td>
              <td>
                <button
                  onClick={this.saveBtnHandler}
                  className="btn btn-success fw-bold"
                >
                  Save
                </button>
              </td>
              <td>
                <button
                  onClick={this.cancelEdit}
                  className="btn btn-danger fw-bold"
                >
                  Cancel
                </button>
              </td>
            </tr>
          );
        }

        // framework in admin page
        return (
          <tr>
            <td className="align-middle">{val.id}</td>
            <td className="align-middle">{val.productName}</td>
            <td className="align-middle">
              Rp{val.price?.toLocaleString("id-ID")}
            </td>
            <td>
              <img
                className="admin-product-image"
                src={val.productImage}
                alt=""
              />
            </td>
            <td className="align-middle">{val.description}</td>
            <td className="align-middle">{val.category}</td>
            <td className="align-middle">
              {/* editToggle menerima parameter yaitu editData dri produk jadi pada onClick hrs dibungkus dg anonymous function supaya kita bisa kasih parameter yaitu val*/}
              <button
                // val mengirimkan semua key dlm satu object ke editToggle
                onClick={() => this.editToggle(val)}
                className="btn btn-warning text-light fw-bold"
              >
                Edit
              </button>
            </td>
            <td className="align-middle">
              <button
                onClick={() => this.deleteBtnHandler(val.id)}
                className="btn btn-danger fw-bold"
              >
                Delete
              </button>
            </td>
          </tr>
        );
      });
  };

  // function utk menambah produk baru
  addNewProduct = () => {
    Axios.post(`${API_URL}/products`, {
      productName: this.state.addProductName,
      // parseInt used as protection for price should be number not string
      price: parseInt(this.state.addPrice),
      productImage: this.state.addProductImage,
      description: this.state.addDescription,
      category: this.state.addCategory,
    })
      .then(() => {
        // fetchproducts memberikan data terbaru setelah add new product sehingga new item muncul
        this.fetchProducts();
        // utk reset form produk baru menjadi kosong kembali setelah menambah produk
        this.setState({
          addProductName: "",
          addPrice: 0,
          addProductImage: "",
          addDescription: "",
          addCategory: "",
        });
      })
      .catch((err) => {
        console.log(err);
        swal({
          title: "There is some mistake in server",
          icon: "warning",
          confirm: true,
        });
      });
  };

  // inputHandler = (event) => {
  //   // value: storage of input users from admin page
  //   // name: to recognize the incoming values from which input
  //   const { name, value } = event.target;

  //   // name using square brackets to make the objects sent to setState is dynamic
  //   this.setState({ [name]: value });
  // };

  // utk membuat fetchProducts trigger ketika masuk admin page tanpa mencet apapun
  componentDidMount() {
    this.fetchProducts();
  }

  inputHandler = (ev) => {
    // event.target will give the input element on which we used inputHandler.. so we cant give event any named? we can give it any name, it is positional arguemtn.
    // when any event is called bowser passes the event object to the function in first parameter. event object contains information about the event. it is passed in onclick, ozninput, onmouseover etc. Almost all events pass an event parameter, we can use it if we want. Here we are using it to store the value inside state with same name as name of input tag. so the builtin only target? b cs we can named event right? yes event is parameter name we can name it anything but target is property of the object sent by browser so we cant change it.
    const name = ev.target.name;
    const value = ev.target.value;

    this.setState({ [name]: value });
  };

  render() {
    const { filterProductList, loading } = this.state;
    // jika login sbg user maka direturn to home page
    if (this.props.userGlobal.role !== "admin") {
      return <Navigate to="/" />;
    }

    return (
      <div className="p-5">
        <div className="row">
          <div className="col-12 text-center bg-light bg-gradient shadow-lg rounded bg-opacity-75">
            <h1 className="text-dark p-5 fw-bold">Product Lists</h1>
            <div
              className="mx-auto d-flex align-items-start"
              style={{
                width: "300px",
              }}
            >
              <input
                onChange={this.inputHandler}
                name="searchProductName"
                type="text"
                style={{
                  paddingTop: "5px",
                  paddingButton: "5px",
                  marginRight: "10px"
                }}
                className="form-control mb-3 fw-bold"
                placeholder="Search..."
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      this.filterHandler();
                    }
                }}
              />
              <button
                className="btn btn-warning text-light fw-bold"
                onClick={this.filterHandler}
              >
                Filter
              </button>
            </div>
            <table className="table table-hover border-warning">
              <thead className="thead-light">
                <tr className="bg-warning bg-opacity-50">
                  <th className="text-light fs-5">ID</th>
                  <th className="text-light fs-5">Name</th>
                  <th className="text-light fs-5">Price</th>
                  <th className="text-light fs-5">Image</th>
                  <th className="text-light fs-5">Description</th>
                  <th className="text-light fs-5">Category</th>
                  <th className="text-light fs-5" colSpan="2">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-light bg-opacity-75 fs-6 fw-bold">
                {loading ? (
                  <tr>
                    <td colSpan="100%" className="text-center py-5">
                      <div
                        className="spinner-border text-warning"
                        role="status"
                      >
                        <span className="visually-hidden">
                          Loading...
                        </span>
                      </div>

                      <p className="fw-bold mt-3 mb-0" style={{ color: "white"}}>
                        Loading products...
                      </p>
                    </td>
                  </tr>
                ) : filterProductList.length === 0 ? (
                    <tr>
                      <td colSpan="100%" className="text-center">
                        <p className="fw-bold fs-5 mb-0" style={{ color: "black"}}>
                          No products available
                        </p>
                      </td>
                    </tr>
                ) : this.renderProducts()}
              </tbody>
              {/* // form input utk new item */}
              <tfoot className="bg-warning bg-opacity-25">
                <tr>
                  <td></td>
                  <td>
                    <input
                      value={this.state.addProductName}
                      onChange={this.inputHandler}
                      name="addProductName"
                      type="text"
                      className="form-control fw-bold"
                      placeholder="Enter product name"
                    />
                  </td>
                  <td>
                    <input
                      value={this.state.addPrice}
                      onChange={this.inputHandler}
                      name="addPrice"
                      type="number"
                      className="form-control fw-bold"
                    />
                  </td>
                  <td>
                    <input
                      value={this.state.addProductImage}
                      onChange={this.inputHandler}
                      name="addProductImage"
                      type="text"
                      className="form-control fw-bold"
                      placeholder="Enter product image path"
                    />
                  </td>
                  <td>
                    <input
                      value={this.state.addDescription}
                      onChange={this.inputHandler}
                      name="addDescription"
                      type="text"
                      className="form-control fw-bold"
                      placeholder="Enter product description"
                    />
                  </td>
                  <td>
                    <select
                      onChange={this.inputHandler}
                      name="addCategory"
                      className="form-control fw-bold"
                    >
                      <option id="placeholderselect" className="fw-bold" value="">Choose Category</option>
                      <option className="fw-bold" value="Softcover Notebook">Softcover Notebook</option>
                      <option className="fw-bold" value="Spiral Notebook">Spiral Notebook</option>
                      <option className="fw-bold" value="Pop Socket">Pop Socket</option>
                    </select>
                  </td>
                  <td colSpan="2">
                    <button
                      onClick={this.addNewProduct}
                      className="btn btn-light text-dark fw-bold"
                    >
                      Add Product
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
            {/* copied the div from home */}
            <div className="card mx-auto mb-3 filsort-card d-flex justify-content-center flex-row" style={{backgroundColor: "transparent", border: "none"}}>
              {/* first page */}
              {this.state.maxPage > 1 ? (
              <a
                className="btn btn-warning text-light fw-bold"
                style={{
                  marginRight: "auto",
                }}
                // disabled={this.state.page === 1} not working lol
                onClick={() => this.paginationHandler(1)}
              >
                {"<<"}
              </a>
              ): null}

              {/* previous page 2 */}
              {/* page: current page*/}
              {this.state.page > 2 ? (
                <a
                  className="btn btn-warning text-light fw-bold"
                  onClick={() => this.paginationHandler(this.state.page - 2)}
                >
                  {this.state.page - 2}
                </a>
              ) : null}

              {/* previous page */}
              {/* page: current page */}
              {this.state.page > 1 ? (
                <a
                  className="btn btn-warning text-light fw-bold"
                  onClick={() => this.paginationHandler(this.state.page - 1)}
                >
                  {this.state.page - 1}
                </a>
              ) : null}

              {/* current page */}
              {/* page: current page */}
              <a
                className="btn btn-warning text-light active fw-bold"
                style={{ border: "3px solid white" }}
              >
                {this.state.page}
              </a>

              {/* next page */}
              {/* page: current page */}
              {this.state.page < this.state.maxPage ? (
                <a
                  className="btn btn-warning text-light fw-bold"
                  onClick={() => this.paginationHandler(this.state.page + 1)}
                >
                  {this.state.page + 1}
                </a>
              ) : null}

              {/* next page 2 */}
              {/* page: current page */}
              {this.state.page < this.state.maxPage - 1 ? (
                <a
                  className="btn btn-warning text-light fw-bold"
                  onClick={() => this.paginationHandler(this.state.page + 2)}
                >
                  {this.state.page + 2}
                </a>
              ) : null}

              {/* last page */}
              {this.state.maxPage > 1 ? (
              <a
                className="btn btn-warning text-light fw-bold"
                style={{
                  marginLeft: "auto",
                }}
                onClick={() => this.paginationHandler(this.state.maxPage)}
              >
                {">>"}
              </a>
              ): null}

            </div>
          </div>
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

export default connect(mapStateToProps)(Admin);
