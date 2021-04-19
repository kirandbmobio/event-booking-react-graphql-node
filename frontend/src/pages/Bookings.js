import React, { Component } from "react";
import Spinner from "../components/Spinner/Spinner";
import AuthContext from "../context/auth-context";
import BookingList from "../components/Bookings/BookingList/BookingList";

class BookingsPage extends Component {
  state = {
    isLoading: false,
    bookings: [],
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
        console.log(err);
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
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
        console.log(err);
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  };

  componentWillUnmount() {
    this.isActive = false;
  }

  render() {
    return (
      <React.Fragment>
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <BookingList
            bookings={this.state.bookings}
            onDelete={this.cancelBookingHandler}
          />
          //   <ul>
          //     {this.state.bookings.map((booking) => (
          //       <li key={booking._id}>
          //         {booking.event.title} -{" "}
          //         {new Date(booking.createdAt).toLocaleDateString()}
          //       </li>
          //     ))}
          //   </ul>
        )}
      </React.Fragment>
    );
  }
}

export default BookingsPage;
