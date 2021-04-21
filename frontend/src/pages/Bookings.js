import React, { Component } from "react";
import Spinner from "../components/Spinner/Spinner";
import AuthContext from "../context/auth-context";
import BookingList from "../components/Bookings/BookingList/BookingList";
import BookingChart from "../components/Bookings/BookingChart/BookingChart";
import BookingsControl from "../components/Bookings/BookingsControl/BookingsControl";

class BookingsPage extends Component {
  state = {
    isLoading: false,
    bookings: [],
    outPutType: "list",
  };

  isActive = true;

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchBookings();
  }

  fetchBookings = () => {
    this.setState({ isLoading: true });
    let requestBody = {
      query: `
            query {
                bookings {
                    _id
                    event {
                        _id
                        title
                        date
                        price
                    }
                    createdAt
                }
            }
          `,
    };

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
        let bookings = resData.data.bookings;
        if (this.isActive) {
          this.setState({ bookings: bookings, isLoading: false });
        }
      })
      .catch((err) => {
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
        return err;
      });
  };

  cancelBookingHandler = (bookingId) => {
    this.setState({ isLoading: true });
    let requestBody = {
      query: `
            mutation {
                cancelBooking(bookingId: "${bookingId}") {
                    _id
                    title
                }
            }
          `,
    };

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
        if (this.isActive) {
          this.setState((prevState) => {
            const updatedBookings = prevState.bookings.filter(
              (booking) => booking._id !== bookingId
            );
            return { bookings: updatedBookings, isLoading: false };
          });
        }
      })
      .catch((err) => {
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
        return err;
      });
  };

  changeOutputTypeHandler = async (outPutType) => {
    if (outPutType === "list") {
      this.setState({ outPutType: "list" });
    } else {
      this.setState({ outPutType: "chart" });
    }
  };

  componentWillUnmount() {
    this.isActive = false;
  }

  render() {
    let content = <Spinner />;
    if (!this.state.isLoading) {
      content = (
        <React.Fragment>
          <BookingsControl
            activeOutputType={this.state.outPutType}
            onChange={this.changeOutputTypeHandler}
          />
          <div>
            {this.state.outPutType === "list" ? (
              <BookingList
                bookings={this.state.bookings}
                onDelete={this.cancelBookingHandler}
              />
            ) : (
              <BookingChart bookings={this.state.bookings} />
            )}
          </div>
        </React.Fragment>
      );
    }
    return <React.Fragment>{content}</React.Fragment>;
  }
}

export default BookingsPage;
