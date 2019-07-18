import React from "react";
import moment from "moment";

export default function CardTask({ task, membersList = [] }) {
  const currentTime = Math.floor(Date.now());
  let taskStatus = "todo";
  if (task.status == true) {
    taskStatus = "done";
  } else if (task.datetime < currentTime) {
    taskStatus = "expired";
  }
  return (
    <div className={`taskContent ${taskStatus} `}>
      <div className="taskContentTitle">{task.title}</div>
      <div className="taskContentDate">
        {moment(task.datetime).format("MMMM Do YYYY  hh:mm a")}
      </div>
      <div className="taskContentCreateBy">
        Create by:
        {membersList.map(member => {
          if (member.userId === task.createby) {
            return <span key={member.userId}>{member.displayName}</span>;
          }
        })}
      </div>
      <div className="taskContentPIC">
        <div className="taskContentPICTitle">Person in charge</div>
        <div className="taskContentPICMembers">
          {task.assignee.map(eachAssigneeID => {
            return membersList.map(eachMember => {
              if (eachMember.userId === eachAssigneeID) {
                return (
                  <span
                    key={eachMember.userId}
                    className="taskContentPICMember"
                  >
                    {eachMember.displayName}
                  </span>
                );
              } else {
                return null;
              }
            });
          })}
        </div>
      </div>
    </div>
  );
}
