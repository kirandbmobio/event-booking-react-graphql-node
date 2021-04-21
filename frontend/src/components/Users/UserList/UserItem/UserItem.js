import React from "react";

import "./UserItem.css";

const userItem = (props) => (
  <li key={props.userId} className="user_list-item">
    <div>
      <h1>{props.email}</h1>
      {/* <h2>
        $ {props.price} - {new Date(props.date).toLocaleDateString()}
      </h2> */}
    </div>
    <div className="d-flex">
      <button
        className="btn"
        onClick={props.viewDetails.bind(this, props.userId)}
      >
        View Details
      </button>
      <button
        className="btn"
        onClick={props.editUser.bind(this, {
          _id: props.userId,
          email: props.email,
        })}
      >
        Edit
      </button>
      <button
        className="btn danger"
        onClick={props.deleteUser.bind(this, props.userId)}
      >
        Delete
      </button>
      <button
        className="btn"
        onClick={props.changePassword.bind(this, {
          _id: props.userId,
          email: props.email,
        })}
      >
        Change Password
      </button>
    </div>
  </li>
);

export default userItem;
