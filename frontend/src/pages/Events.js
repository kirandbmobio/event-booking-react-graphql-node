import React, { Component } from "react";
import "./Events.css";
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import AuthContext from "../context/auth-context";
import EventList from "../components/Events/EventList/EventList";
import Spinner from "../components/Spinner/Spinner";

class EventsPage extends Component {
  state = {
    creating: false,
    events: [],
    isLoading: false,
    selectedEvent: null,
    event: null,
    title: "",
    description: "",
    price: "",
    date: "",
    eventId: null,
    eventTitle: "Add Event",
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);

    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  }

  componentDidMount() {
    this.fetchEvents();
  }

  startCreateHandler = () => {
    this.setState({ creating: true });
  };

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  updateEvent = (event) => {
    this.setState({
      creating: true,
      title: event.title,
      eventId: event._id,
      price: event.price,
      date: event.date,
      description: event.description,
      eventTitle: "Update Event",
    });
    // title = event.title;
  };

  onConfirmHandler = () => {
    this.setState({ creating: false });
    let title = this.titleElRef.current.value;
    let price = parseFloat(this.priceElRef.current.value);
    let date = this.dateElRef.current.value;
    let description = this.descriptionElRef.current.value;
    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }
    let event = { title, price, date, description };
    let requestBody;
    if (this.state.eventId) {
      requestBody = {
        query: `
            mutation {
                updateEvent(eventId: "${this.state.eventId}",eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
                    _id
                    title
                    description
                    date
                    price
                    creator {
                        _id
                        email
                    }
                }
            }
        `,
      };
    } else {
      requestBody = {
        query: `
            mutation {
                createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
                    _id
                    title
                    description
                    date
                    price
                    creator {
                        _id
                        email
                    }
                }
            }
        `,
      };
    }

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
        this.setState((prevState) => {
          let updatedEvents = [...prevState.events];
          if (!this.state.eventId) {
            updatedEvents.push(resData.data.createEvent);
          } else {
            updatedEvents = updatedEvents.map((singleEvent) => {
              if (singleEvent._id === resData.data.updateEvent._id) {
                singleEvent = { ...singleEvent, ...resData.data.updateEvent };
              }
              return singleEvent;
            });
          }
          return {
            events: updatedEvents,
            eventId: null,
            title: null,
            description: null,
            price: null,
            date: null,
          };
        });
      })
      .catch((err) => {
        return err;
      });
  };

  onCancelHandler = () => {
    this.setState({
      creating: false,
      selectedEvent: null,
      eventId: null,
      title: null,
      description: null,
      price: null,
      date: null,
    });
  };

  bookEventHandler = () => {
    if (!this.context.token) {
      this.setState({ selectedEvent: null });
      return;
    }

    let requestBody = {
      query: `
            mutation {
                bookEvent(eventId: "${this.state.selectedEvent._id}") {
                    _id
                    createdAt
                    updatedAt
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
        this.setState({ selectedEvent: null });
        // this.setState((prevState) => {
        //   let updatedEvents = [...prevState.events];
        //   updatedEvents.push(resData.data.createEvent);
        //   return { events: updatedEvents };
        // });
      })
      .catch((err) => {
        return err;
      });
  };

  cancelEventHandler = async (eventId) => {
    let requestBody = {
      query: `
            mutation CancelEvent($eventId: ID!) {
                cancelEvent(eventId: $eventId) {
                    message
                    status
                }
            }
          `,
      variables: {
        eventId: eventId,
      },
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
        this.setState((prevState) => {
          let updatedEvents = prevState.events.filter(
            (event) => event._id !== eventId
          );
          return { eventId: null, events: updatedEvents };
        });
      })
      .catch((err) => {
        this.setState({ isLoading: false });
        return err;
      });
  };

  showDetailHandler = (eventId) => {
    this.setState((prevState) => {
      const selectedEvent = prevState.events.find((e) => e._id === eventId);
      return { selectedEvent: selectedEvent };
    });
  };

  fetchEvents() {
    this.setState({ isLoading: true });
    let requestBody = {
      query: `
            query {
                events {
                    _id
                    title
                    description
                    price
                    date
                    creator {
                        _id
                        email
                    }
                }
            }
          `,
    };

    fetch("http://localhost:3000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then((resData) => {
        let events = resData.data.events;
        this.setState({ events: events, isLoading: false });
      })
      .catch((err) => {
        this.setState({ isLoading: false });
        return err;
      });
  }

  render() {
    let eventList = this.state.events;
    return (
      <React.Fragment>
        {this.state.creating || (this.state.selectedEvent && <Backdrop />)}
        {this.state.creating && (
          <Modal
            title={this.state.eventTitle}
            canCancel
            canConfirm
            onConfirm={this.onConfirmHandler}
            onCancel={this.onCancelHandler}
            confirmText="Confirm"
          >
            <form>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  ref={this.titleElRef}
                  value={this.state.title}
                  onChange={this.handleInputChange}
                />
              </div>
              <div className="form-control">
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  ref={this.priceElRef}
                  value={this.state.price}
                  onChange={this.handleInputChange}
                />
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  ref={this.dateElRef}
                  value={this.state.date}
                  onChange={this.handleInputChange}
                />
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  rows="4"
                  name="description"
                  ref={this.descriptionElRef}
                  value={this.state.description}
                  onChange={this.handleInputChange}
                ></textarea>
              </div>
            </form>
          </Modal>
        )}
        {this.state.selectedEvent && (
          <Modal
            title={this.state.selectedEvent.title}
            canCancel
            canConfirm
            onConfirm={this.bookEventHandler}
            onCancel={this.onCancelHandler}
            confirmText={this.context.token ? "Book" : "Confirm"}
          >
            <h1>{this.state.selectedEvent.title}</h1>
            <h2>
              $ {this.state.selectedEvent.price} -{" "}
              {new Date(this.state.selectedEvent.date).toLocaleDateString()}
            </h2>
            <p>{this.state.selectedEvent.description}</p>
          </Modal>
        )}
        {this.context.token && (
          <div className="events-control">
            <p>Share your own Events!</p>
            <button className="btn" onClick={this.startCreateHandler}>
              Create Event
            </button>
          </div>
        )}
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <EventList
            events={eventList}
            authUserId={this.context.userId}
            onViewDetail={this.showDetailHandler}
            updateEvent={this.updateEvent}
            cancelEvent={this.cancelEventHandler}
          />
        )}
      </React.Fragment>
    );
  }
}

export default EventsPage;
