import React from "react";
import EventItem from "./EventItem/EventItem";

import "./EventList.css";

const eventList = (props) => {
  let events = props.events.map((event) => {
    return (
      <EventItem
        key={event._id}
        eventId={event._id}
        title={event.title}
        userId={props.authUserId}
        creatorId={event.creator._id}
        price={event.price}
        date={event.date}
        description={event.description}
        viewDetails={props.onViewDetail}
        editEvent={props.updateEvent}
        cancelEvent={props.cancelEvent}
      />
    );
  });
  return <ul className="events_list">{events}</ul>;
};

export default eventList;
