import React from "react";

import "./EventItem.css";

const eventItem = (props) => (
  <li key={props.eventId} className="event_list-item">
    <div>
      <h1>{props.title}</h1>
      <h2>
        $ {props.price} - {new Date(props.date).toLocaleDateString()}
      </h2>
    </div>
    <div>
      {props.userId === props.creatorId ? (
        <div className="d-flex">
          <a
            onClick={props.editEvent.bind(this, {
              title: props.title,
              price: props.price,
              date: props.date,
              description: props.description,
              _id: props.eventId,
            })}
          >
            <em className="fa fa-edit"></em>
          </a>
          <p>You are the owner of this event</p>
        </div>
      ) : (
        <button
          className="btn"
          onClick={props.viewDetails.bind(this, props.eventId)}
        >
          View Details
        </button>
      )}
    </div>
  </li>
);

export default eventItem;
