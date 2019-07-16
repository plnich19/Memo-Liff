import React, { Component } from "react";
import Modal from "react-responsive-modal";
import "./YourList.css";
import axios from "axios";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class YourList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      getYourList: [],
      openEdit: false,
      openDelete: false,
      checked: false,
      openCheck: false,
      groupId: "",
      dataFetchMsg: "loading",
      title: "",
      datetime: "",
      modalDatetime: " ",
      modalTitle: ""
    };
  }

  getData = context => {
    const action = `getYourTask`;
    const groupId = context.groupId;
    const userId = context.userId;
    fetch(
      `https://asia-east2-memo-chatbot.cloudfunctions.net/DataAPI/?action=${action}&groupId=${groupId}&userId=${userId}`
    )
      .then(response => response.json())
      .then(data => {
        this.setState({ getYourList: data });
      });
  };

  submitUpdateTask = () => {
    const { context } = this.props;
    this.editTask(context);
    this.onCloseEditModal();
  };

  onTitleChanged = event => {
    this.setState({
      modalTitle: event.target.value
    });
  };

  onDateTimeChanged = date => {
    const dateToTimStamp = new Date(date).getTime();
    this.setState({
      modalDatetime: dateToTimStamp
    });
  };

  updateStatus = context => {
    const groupId = context.groupId;
    const { openTaskId, checked } = this.state;
    const taskId = openTaskId;
    const url = `https://asia-east2-memo-chatbot.cloudfunctions.net/DataAPI/?action=updateTask&groupId=${groupId}&taskId=${taskId}`;
    const bodyData = {
      status: checked
    };
    axios
      .post(url, bodyData)
      .then(response => {
        this.getData(context);
      })
      .catch(error => {});
  };

  editTask = context => {
    const groupId = context.groupId;
    const { openTaskId, modalTitle, modalDatetime } = this.state;
    const taskId = openTaskId;
    const url = `https://asia-east2-memo-chatbot.cloudfunctions.net/DataAPI/?action=updateTask&groupId=${groupId}&taskId=${taskId}`;
    const bodyData = {
      title: modalTitle,
      datetime: modalDatetime
    };
    axios
      .post(url, bodyData)
      .then(response => {
        this.getData(context);
      })
      .catch(error => {});
  };

  submitDeleteTask = () => {
    const { context } = this.props;
    this.deleteFetch(context);
    this.onCloseDeleteModal();
  };

  deleteFetch(context) {
    const groupId = context.groupId;
    const taskId = this.state.thisTaskId;
    const url = `https://asia-east2-memo-chatbot.cloudfunctions.net/DataAPI/?action=deleteTask&groupId=${groupId}&taskId=${taskId}`;
    axios
      .post(url)
      .then(response => {
        this.getData(context);
      })
      .catch(error => {});
  }

  componentWillMount() {
    const { context } = this.props;
    this.getData(context);
  }

  componentDidMount = () => {};

  onOpenEditModal = taskId => e => {
    const { getYourList } = this.state;
    const selectedTask = getYourList.find(task => {
      return task.taskId === taskId;
    });
    this.setState({
      openEdit: true,
      openTaskId: taskId,
      modalTitle: selectedTask.title,
      modalDatetime: selectedTask.datetime
    });
  };

  onCloseEditModal = () => {
    this.setState({ openEdit: false });
  };

  onOpenDeleteModal = taskId => e => {
    this.setState({
      openDelete: true,
      thisTaskId: taskId
    });
  };

  onCloseDeleteModal = () => {
    this.setState({ openDelete: false });
  };

  onOpenCheckModal = task => e => {
    const { taskId } = task;
    this.setState({
      openCheck: true,
      openTaskId: taskId,
      checked: !task.status
    });
  };

  onCloseCheckModal = () => {
    this.setState({ openCheck: false });
  };

  submitCheck = () => {
    this.setState({ openCheck: false });
    this.updateStatus(this.props.context);
  };

  yourTasksTable = task => {
    const { modalTitle } = this.state;
    const isEnabled = modalTitle.length > 0;
    return (
      <div>
        <Modal
          className="Modal"
          overlayClassName="Overlay"
          open={this.state.openEdit}
          onClose={this.onCloseEditModal}
          center
        >
          <h2>Edit</h2>
          <form className="form">
            <p>Task: </p>
            <input
              type="text"
              name="title"
              value={this.state.modalTitle}
              onChange={this.onTitleChanged}
              formNoValidate
            />
            <p>Due Date: </p>
            <DatePicker
              selected={this.state.modalDatetime}
              onChange={this.onDateTimeChanged}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              timeCaption="time"
            />
          </form>
          <button
            className={"yesButton"}
            disabled={!isEnabled}
            onClick={event => {
              this.submitUpdateTask(this.state.openTaskId);
            }}
          >
            Update
          </button>
          <button className="noButton" onClick={this.onCloseEditModal}>
            Cancel
          </button>
        </Modal>
        <Modal
          className="Modal"
          open={this.state.openDelete}
          onClose={this.onCloseDeleteModal}
          center
        >
          <h2 className="deleteTitle">Delete!!!</h2>
          <div>
            <p className="modalText">
              Are you sure you want to delete this task?
            </p>
            <button
              className="yesdeleteButton"
              onClick={event => {
                this.submitDeleteTask(this.state.openTaskId);
              }}
            >
              Delete
            </button>
            <button
              className="nodeleteButton"
              onClick={this.onCloseDeleteModal}
            >
              Cancel
            </button>
          </div>
        </Modal>
        <Modal
          className="Modal"
          open={this.state.openCheck}
          onClose={this.onCloseCheckModal}
          center
        >
          <h2>Status</h2>
          <p className="modalText">Are you sure you want to change status?</p>
          <div>
            <button className="yesButton" onClick={this.submitCheck}>
              Yes
            </button>
            <button className="noButton" onClick={this.onCloseCheckModal}>
              No
            </button>
          </div>
        </Modal>
        <div className="eachTask">
          <tr key={task.taskId}>
            <td>{task.title}</td>
            <td>
              <button
                className="editdeleteButton"
                onClick={this.onOpenEditModal(task.taskId)}
              >
                Edit
              </button>
            </td>
            <td>
              <button
                className="editdeleteButton"
                onClick={this.onOpenDeleteModal(task.taskId)}
              >
                Delete
              </button>
            </td>
            <td>
              <label className="checkboxContainer">
                <input
                  type="checkbox"
                  className="checkDone"
                  checked={task.status}
                  onClick={this.onOpenCheckModal(task)}
                />
              </label>
            </td>
          </tr>
          <div className="time">
            {moment(task.datetime).format("MMMM Do YYYY, h:mm a")}
          </div>
        </div>
      </div>
    );
  };

  filterTask = () => {
    return (
      <div>
        {this.state.getYourList
          .sort((a, b) => new Date(b.datetime) - new Date(a.datetime))
          .reverse()
          .forEach(task => {
            const currentTime = Math.floor(Date.now());
            if (task.datetime !== currentTime) {
              return this.yourTasksTable(task);
            }
          })}
      </div>
    );
  };

  render() {
    const { getYourList, dataFetchMsg } = this.state;
    return (
      <div className="yourList">
        {getYourList.length > 0 ? (
          <table className="yourListTable">
            <tbody className="tableBody">{this.filterTask()}</tbody>
          </table>
        ) : (
          <h1>{dataFetchMsg}</h1>
        )}
      </div>
    );
  }
}
export default YourList;
