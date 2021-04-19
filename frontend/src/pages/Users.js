import React, { Component } from "react";
import AuthContext from "../context/auth-context";
import Spinner from "../components/Spinner/Spinner";
import UserList from "../components/Users/UserList/UserList";
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";

import "./Users.css";

class UsersPage extends Component {
  state = {
    users: [],
    isLoading: false,
    openUserModal: false,
    email: "",
    password: "",
    userTitle: "Add User",
    userId: "",
    selectedUser: null,
  };
  constructor(props) {
    super(props);

    this.emailRef = React.createRef();
    this.passwordRef = React.createRef();
  }

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchUsers();
  }

  showDetailHandler = async (userId) => {
    this.setState((prevState) => {
      let selectedUser = prevState.users.find((user) => user._id == userId);
      return { selectedUser: selectedUser };
    });
  };

  startCreateHandler = async (userId) => {
    this.setState({ openUserModal: true });
  };

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  updateUser = async (user) => {
    console.log(user);
    this.setState({ userId: user._id, email: user.email, openUserModal: true });
  };

  onConfirmHandler = async () => {
    this.setState({ openUserModal: false });
    let email = this.state.email;
    let password = this.state.password;

    let requestBody;
    if (this.state.userId) {
      requestBody = {
        query: `
            mutation UpdateUser($userId: ID!, $email: String!, $password: String!) {
                updateUser(userId: $userId,userInput: {email:$email, password: $password}) {
                    _id
                    email
                }
            }
        `,
        variables: {
          userId: this.state.userId,
          email: email,
          password: password,
        },
      };
    } else {
      requestBody = {
        query: `
            mutation CreateUser($email: String!, $password: String!) {
                createUser(userInput: {email: $email, password: $password}) {
                    _id
                    email
                }
            }
        `,
        variables: {
          email: email,
          password: password,
        },
      };
    }

    fetch("http://localhost:3000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.context.token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then((resData) => {
        this.setState((prevState) => {
          let updatedUsers = [...prevState.users];
          if (!this.state.userId) {
            updatedUsers.push(resData.data.createUser);
          } else {
            updatedUsers = updatedUsers.map((singleUser) => {
              if (singleUser._id === this.state.userId) {
                singleUser = { ...singleUser, ...resData.data.updateUser };
              }
              return singleUser;
            });
          }
          return { users: updatedUsers };
        });
        this.setState({ email: "", password: "", userId: "" });
      })
      .catch((err) => {
        return err;
      });
  };

  onCancelHandler = async () => {
    this.setState({
      openUserModal: false,
      email: "",
      password: "",
      userId: "",
      selectedUser: null,
    });
  };

  fetchUsers = async () => {
    try {
      this.setState({ isLoading: true });
      let requestBody = {
        query: `
                query {
                    users {
                        _id
                        email
                        
                    }
                }
              `,
      };
      const token = this.context.token;

      fetch("http://localhost:3000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => {
          if (res.status !== 200 && res.status !== 201) {
            throw new Error("Failed");
          }
          return res.json();
        })
        .then((resData) => {
          this.setState({ users: resData.data.users, isLoading: false });
        })
        .catch((err) => {
          this.setState({ isLoading: false });
          return err;
        });
    } catch (err) {
      this.setState({ isLoading: false });
      return err;
    }
  };
  render() {
    let userList = this.state.users;
    return (
      <React.Fragment>
        {this.state.openUserModal && <Backdrop />}
        {this.state.openUserModal && (
          <Modal
            title={this.state.userTitle}
            canCancel
            canConfirm
            onConfirm={this.onConfirmHandler}
            onCancel={this.onCancelHandler}
            confirmText="Confirm"
          >
            <form>
              <div className="form-control">
                <label htmlFor="email">E-Mail</label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  ref={this.emailRef}
                  value={this.state.email}
                  onChange={this.handleInputChange}
                />
              </div>
              {/* <div className="form-control">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  ref={this.passwordRef}
                  value={this.state.password}
                  onChange={this.handleInputChange}
                />
              </div> */}
            </form>
          </Modal>
        )}
        {this.state.selectedUser && (
          <Modal
            title={this.state.selectedUser.email}
            canCancel
            onCancel={this.onCancelHandler}
          >
            <h1>{this.state.selectedUser._id}</h1>
            <p>{this.state.selectedUser.email}</p>
          </Modal>
        )}
        {this.context.token && (
          <div className="users-control">
            <p>Add New Users!</p>
            <button className="btn" onClick={this.startCreateHandler}>
              Create User
            </button>
          </div>
        )}
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <UserList
            users={userList}
            authUserId={this.context.userId}
            onViewDetail={this.showDetailHandler}
            updateUser={this.updateUser}
          />
        )}
      </React.Fragment>
    );
  }
}

export default UsersPage;
