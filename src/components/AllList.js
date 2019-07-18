import React, { Component } from "react";
import "./AllList.css";
import moment from "moment";
import Select from "react-select";
import CardTask from "./CardTask";
import ProgressBar from "./ProgressBar";
import axios from "axios";

class AllList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      getList: [],
      getMembersList: [],
      dataFetchMsg: "",
      selectedFilterTaskOption: "all",
      filterTaskOptions: [],
      currentDateFromSelect: {
        index: 0,
        humanDate: "ทั้งหมด",
        timestamp: "all"
      }
    };
  }

  getData = context => {
    const groupId = context.groupId;
    this.setState({
      dataFetchMsg: "loading"
    });

    function getActions(action) {
      return axios.get(
        `https://asia-east2-memo-chatbot.cloudfunctions.net/DataAPI/?action=${action}&groupId=${groupId}`
      );
    }

    axios
      .all([getActions("getTasks"), getActions("getMembers")])
      .then(
        axios.spread((dataTasks, dataMembers) => {
          if (dataTasks.length == 0 || dataMembers.length == 0) {
            this.setState({
              dataFetchMsg: "No Data"
            });
          }
          this.setState({
            getList: dataTasks.data,
            getMembersList: dataMembers.data,
            dataFetchMsg: "done"
          });
          this.getFilterTaskOptions(dataTasks.data);
        })
      )
      .catch(err => {
        this.setState({
          dataFetchMsg: "Error"
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

    data.forEach(task => {
      if (task.datetime) {
        dateArr.push(moment(task.datetime).format("YYYY-MM-DD"));
      }
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
    this.setState({ filterTaskOptions: results });
  };

  getCurrentDate = date => {
    const { filterTaskOptions } = this.state;
    const currentIndex = filterTaskOptions.findIndex(
      filterTaskOption => filterTaskOption.value === date
    );
    this.setState({
      currentDateFromSelect: {
        index: currentIndex,
        humanDate: filterTaskOptions[currentIndex].label,
        timestamp: filterTaskOptions[currentIndex].value
      }
    });
  };

  prevDate = () => {
    const { filterTaskOptions, currentDateFromSelect } = this.state;
    const { index } = currentDateFromSelect;
    if (index > 0) {
      this.setState({
        currentDateFromSelect: {
          index: index - 1,
          humanDate: filterTaskOptions[index - 1].label,
          timestamp: filterTaskOptions[index - 1].value
        }
      });
    }
  };

  nextDate = () => {
    const { filterTaskOptions, currentDateFromSelect } = this.state;
    const { index } = currentDateFromSelect;
    if (index < filterTaskOptions.length - 1) {
      this.setState({
        currentDateFromSelect: {
          index: index + 1,
          humanDate: filterTaskOptions[index + 1].label,
          timestamp: filterTaskOptions[index + 1].value
        }
      });
    }
  };

  handleChange = selectedOption => {
    this.getCurrentDate(selectedOption.value);
  };

  componentWillMount() {
    const { context } = this.props;
    this.getData(context);
  }

  allTasksTable() {
    const { currentDateFromSelect, getMembersList } = this.state;
    return (
      <div>
        {this.state.getList
          .sort((a, b) => new Date(b.datetime) - new Date(a.datetime))
          .reverse()
          .map(task => {
            const propsToCardTask = {
              key: task.taskId,
              task: task,
              membersList: getMembersList
            };
            if (currentDateFromSelect.timestamp === "all") {
              return <CardTask {...propsToCardTask} />;
            } else {
              const todayLimit =
                currentDateFromSelect.timestamp - 7 * 1000 * 60 * 60;
              const tmrwLimit =
                currentDateFromSelect.timestamp + 1 * 24 * 60 * 60 * 1000;
              if (todayLimit <= task.datetime && task.datetime <= tmrwLimit) {
                return <CardTask {...propsToCardTask} />;
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
      currentDateFromSelect
    } = this.state;
    let countDone = 0;
    getList.forEach(task => {
      if (task.status === true) {
        countDone++;
      }
    });
    console.log(countDone, "countDone");
    const calPercentage = (countDone / getList.length) * 100;
    const percentage = calPercentage.toFixed(2);
    return (
      <div className="allTasks">
        <div className="groupScore">Your Group Score</div>
        <ProgressBar percentage={percentage} />
        <div className="chooseDate">
          <button className="prevButton" onClick={this.prevDate}>
            &lt;
          </button>
          {getList.length > 0 && (
            <Select
              className="select"
              placeholder={currentDateFromSelect.humanDate}
              value={currentDateFromSelect.humanDate}
              onChange={this.handleChange}
              options={filterTaskOptions}
            />
          )}
          <button className="nextButton" onClick={this.nextDate}>
            &gt;
          </button>
        </div>
        {getList.length > 0 ? (
          <div className="taskContentWrap">{this.allTasksTable()}</div>
        ) : (
          <h1>{dataFetchMsg}</h1>
        )}
      </div>
    );
  }
}
export default AllList;
