import React from "react";
import {
  Navbar,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  NavbarBrand,
  NavbarText,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

// Link: has the same function like tag a but it's from react-router-dom. It has props named "to"
import { Link, Navigate } from "react-router-dom";
// connect from react-redux bcs we want to show username user in navbar
import { connect } from "react-redux";
import { logoutUser } from "../redux/actions/user";
import logo from "../assets/styles/logo.png";
import { FaShoppingCart } from "react-icons/fa";

class Navibar extends React.Component {
  state = {
    // navigate: false, // it is only initial value.
  };

  onLogout = () => {
    this.props.logoutUser();
    // navigate logout to home page so page will reload and clearing all state or store
    window.location.href = "/"; // i used this for workaround bcz .. i can comment this.. but i think this one is easier?
    // this.setState({ navigate: true }); // it will work now
  };

  render() {
    // this one didnt work
    // if (this.state.navigate) {
    //   // if this.state.navigate is true then make it false and navigate to home page. but in state it's already false.
    //   this.state.navigate = false;
    //   return <Navigate to="/" />;
    // }

    return (
      <Navbar color="body" light style={{padding: 0}}>
        {/* to make brand send us to home page when it's clicked */}
        <NavbarBrand
          tag={Link}
          to="/"
          className="text-warning font-weight-bold text-align-start"
        >
          <img
            src={logo}
            // to make written of "Logo" show up when the logo pict can't be show up
            alt="Logo"
            style={{
              height: "50px",
              marginRight: "10px",
            }}
          />
          <span className="fw-bold fs-4">Artsy Craftial</span>
        </NavbarBrand>
        <Nav style={{width: "22%", justifyContent: "end"}}>
          {/* if condition is true run the task inside react fragment*/}
          {this.props.userGlobal.username ? (
            <>
              {/*react fragment has function like tag div, used in this case to unite two elements divided: NavItem & UncontrolledDropdown*/}
              <NavItem
                style={{
                  marginTop: "auto",
                  marginBottom: "auto",
                  padding: "0.5rem 1rem"
                }}
              >
                <NavbarText nav="true" className="text-warning fs-5 fw-bold">
                  Hello, {this.props.userGlobal.username}
                </NavbarText>
              </NavItem>
              {this.props.userGlobal.role !== "admin" ? (
              <NavItem
                style={{
                  marginTop: "auto",
                  marginBottom: "auto",
                  padding: "0.5rem 1rem",
                }}
              >
                  <Link
                    to="/cart"
                    className="text-decoration-none text-warning fw-bold fs-5"
                  >
                    <FaShoppingCart />
                    {/* cartList is from cart.js reducer */}(
                    {this.props.cartGlobal.cartList.length})
                  </Link>
              </NavItem>
                ) : null}
              {/* nav to declare if the dropdown is in navbar */}
              <UncontrolledDropdown nav inNavbar>
                {/* caret to give a small arrow */}
                <DropdownToggle nav caret className="text-warning fs-5 fw-bold">
                  Pages
                </DropdownToggle>
                {/* to make align dropdown menu move to left so they can compeletely show not cut*/}
                <DropdownMenu end>
                  {/* if login as user */}
                  {this.props.userGlobal.role !== "admin" ? (
                    <DropdownItem>
                      <Link
                        to="/history"
                        className="text-decoration-none text-warning fs-5 fw-bold"
                      >
                        History
                      </Link>
                    </DropdownItem>
                  ) : // if login as admin then cart doesn't show up
                  null}

                  {/* if only login as admin */}
                  {this.props.userGlobal.role === "admin" ? (
                    <DropdownItem>
                      <Link
                        to="/admin"
                        className="text-decoration-none text-warning fw-bold fs-5"
                      >
                        Admin
                      </Link>
                    </DropdownItem>
                  ) : // if login as user then admin page doesn't show up
                  null}

                  {/* divider: a tiny line to divide with previous dropdown item */}
                  <DropdownItem divider />
                  <DropdownItem
                    className="text-warning fw-bold fs-5"
                    onClick={this.onLogout}
                  >
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </>
          ) : (
            // if condition is false run the task after ":"
            <NavItem>
              <NavbarText>
                {/* Link has default display inline */}
                <Link
                  className="text-warning text-decoration-none fs-4 fw-bold"
                  to="/login"
                >
                  Login
                </Link>{" "}
                |{" "}
                <Link
                  className="text-warning text-decoration-none fs-4 fw-bold"
                  to="/register"
                >
                  Register
                </Link>
              </NavbarText>
            </NavItem>
          )}
        </Nav>
      </Navbar>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userGlobal: state.user,
    cartGlobal: state.cart,
  };
};

const mapDispatchToProps = {
  logoutUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Navibar);
