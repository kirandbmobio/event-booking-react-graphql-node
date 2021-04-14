import React, { Component } from "react";
import "./Events.css";
import Modal from "../components/Modal/Modal";

class EventsPage extends Component {
  render() {
    return (
      <React.Fragment>
        <Modal title="Add Event" canCancel canConfirm>
          <p>Modal Content</p>
        </Modal>
        <div className="events-control">
          <p>Share your own Events!</p>
          <button className="btn">Create Event</button>
        </div>
      </React.Fragment>
    );
  }
}

export default EventsPage;
