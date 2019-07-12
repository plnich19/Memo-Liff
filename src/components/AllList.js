import React, { Component } from "react";
import "./AllList.css";
import moment from "moment";
import Select from "react-select";

class AllList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      getList: [],
      getMembersList: [],
      dataFetchMsg: "loading",
      selectedFilterTaskOption: "all",
      filterTaskOptions: []
    };
  }

  getData = context => {
    const actions = [`getTasks`, `getMembers`];
    const groupId = context.groupId;
    actions.forEach(action => {
      const API = `https://asia-east2-memo-chatbot.cloudfunctions.net/DataAPI/?action=${action}&groupId=${groupId}`;
      fetch(API)
        .then(response => response.json())
        .then(data => {
          if (action === "getTasks") {
            this.setState({ getList: data });
            this.getFilterTaskOptions(data);
          } else {
            this.setState({ getMembersList: data });
          }
          console.log(this.state.getList, "getList");
        });
    });
  };

  /**
   *
   * @params {array} data
   * @memberof AllList
   */
  getFilterTaskOptions = data => {
    let dateArr = [];
    data.map(task => {
      dateArr.push(moment(task.datetime).format("YYYY-MM-DD"));
    });

    const distinctedDateArr = [...new Set(dateArr.sort().reverse())].map(
      date => {
        let timestampDateValue = new Date(date).getTime();
        let obj = {
          value: timestampDateValue,
          label: date
        };
        return obj;
      }
    );

    let results = [
      {
        value: "all",
        label: "ทั้งหมด"
      },
      ...distinctedDateArr
    ];
    console.log(results, "re");
    console.log(distinctedDateArr, "distinctedDateArr");
    this.setState({ filterTaskOptions: results });
  };

  handleChange = selectedOption => {
    this.setState({ selectedFilterTaskOption: selectedOption.value });
  };

  componentWillMount() {
    const { context } = this.props;
    this.getData(context);
  }

  componentDidMount() {}

  taskRenderer = task => {
    const currentTime = Math.floor(Date.now());
    console.log(currentTime, "currentTime");
    console.log(task.datetime, "task.datetime");
    if (task.status == true) {
      var taskStatus = "done";
    } else if (task.datetime < currentTime) {
      var taskStatus = "expired";
    }
    console.log(taskStatus, "taskStatus");
    return (
      <div key={task.taskId} className={`taskContent ${taskStatus} `}>
        <div>Title: {task.title}</div>
        <div>
          Due Date: {moment(task.datetime).format("MMMM Do YYYY  hh:mm a")}
        </div>
        <div>
          Create By:
          {this.state.getMembersList.map(member => {
            if (member.userId === task.createby) {
              return <span key={member.userId}>{member.displayName}</span>;
            }
          })}
        </div>
        <div className="assignee">
          Assignee:{" "}
          {task.assignee.map(eachAssigneeID => {
            return this.state.getMembersList.map(eachMember => {
              if (eachMember.userId === eachAssigneeID) {
                return (
                  <span key={eachMember.userId} className="member">
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
    );
  };

  allTasksTable() {
    const { selectedFilterTaskOption } = this.state;
    console.log(selectedFilterTaskOption, "selectedFilterTaskOption");
    return (
      <div>
        {this.state.getList
          .sort((a, b) => new Date(b.datetime) - new Date(a.datetime))
          .reverse()
          .map(task => {
            if (selectedFilterTaskOption === "all") {
              return this.taskRenderer(task);
            } else {
              const todayLimit = selectedFilterTaskOption - 7 * 1000 * 60 * 60;
              const tmrwLimit =
                selectedFilterTaskOption + 1 * 24 * 60 * 60 * 1000;
              if (todayLimit <= task.datetime && task.datetime <= tmrwLimit) {
                console.log(todayLimit, "todayLimit");
                console.log(task.datetime, "task.datetime");
                console.log(tmrwLimit, "tmrwLimit");
                return this.taskRenderer(task);
              } else {
                return null;
              }
            }
          })}
      </div>
    );
  }

  render() {
    const {
      getList,
      dataFetchMsg,
      filterTaskOptions,
      selectedFilterTaskOption
    } = this.state;
    return (
      <div className="allTasks">
        <h1>All Tasks</h1>
        {getList.length > 0 && (
          <Select
            className="select"
            placeholder="เลือกวันที่ต้องการ"
            value={selectedFilterTaskOption}
            onChange={this.handleChange}
            options={filterTaskOptions}
          />
        )}
        {getList.length > 0 ? (
          <div className="oneTask">{this.allTasksTable()}</div>
        ) : (
          <h1>{dataFetchMsg}</h1>
        )}
      </div>
    );
  }
}
export default AllList;
