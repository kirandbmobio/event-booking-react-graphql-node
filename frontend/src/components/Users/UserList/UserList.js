import React from "react";

import UserItem from "./UserItem/UserItem";

import "./UserList.css";

let userList = (props) => {
  let users = props.users.map((user) => {
    return (
      <UserItem
        key={user._id}
        userId={user._id}
        email={user.email}
        viewDetails={props.onViewDetail}
        editUser={props.updateUser}
      />
    );
  });
  return <ul className="users_list">{users}</ul>;
};

export default userList;
