import logo from "./logo.svg";
import "./App.css";
import React, { Component } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import AuthPage from "./pages/Auth";
import BookingsPage from "./pages/Bookings";
import EventsPage from "./pages/Events";
import MainNavigation from "./components/Navigation/MainNavigation";
import AuthContext from "./context/auth-context";
import UsersPage from "./pages/Users";
import "font-awesome/css/font-awesome.min.css";

class App extends Component {
  state = {
    token: null,
    userId: null,
  };
  login = (token, userId, tokenExpiration) => {
    this.setState({ token: token, userId: userId });
  };
  logout = () => {
    this.setState({ token: null, userId: null });
  };
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <React.Fragment>
            <AuthContext.Provider
              value={{
                token: this.state.token,
                userId: this.state.userId,
                login: this.login,
                logout: this.logout,
              }}
            >
              <MainNavigation />
              <main className="main-content">
                <Switch>
                  {!this.state.token && (
                    <Redirect from="/" to="/auth" exact></Redirect>
                  )}
                  {this.state.token && (
                    <Redirect from="/" to="/events" exact></Redirect>
                  )}
                  {this.state.token && (
                    <Redirect from="/auth" to="/events" exact></Redirect>
                  )}
                  {!this.state.token && (
                    <Route path="/auth" component={AuthPage}></Route>
                  )}
                  <Route path="/events" component={EventsPage}></Route>
                  {this.state.token && (
                    <React.Fragment>
                      <Route path="/bookings" component={BookingsPage}></Route>
                      <Route path="/users" component={UsersPage}></Route>
                    </React.Fragment>
                  )}
                  {!this.state.token && <Redirect to="/auth" exact></Redirect>}
                </Switch>
              </main>
            </AuthContext.Provider>
          </React.Fragment>
        </BrowserRouter>
      </div>
    );
  }
}
// function App() {
//   return (
//   );
// }

export default App;
