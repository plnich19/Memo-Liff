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
      },
      eachDateTasks: []
    };
  }

  getData = context => {
    const groupId = context.groupId;
    this.setState({
      dataFetchMsg: "Loading"
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
            return;
          }
          this.setState({
            getList: dataTasks.data,
            getMembersList: dataMembers.data,
            dataFetchMsg: "Done"
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

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { currentDateFromSelect, getList } = this.state;
    if (
      prevState.currentDateFromSelect.index !== currentDateFromSelect.index ||
      prevState.getList !== getList
    ) {
      this.eachDateTasks();
    }
  }

  allTasksTable() {
    const { getMembersList, eachDateTasks } = this.state;
    return (
      <div>
        {eachDateTasks.map(task => {
          const propsToCardTask = {
            key: task.taskId,
            task: task,
            membersList: getMembersList
          };
          return <CardTask {...propsToCardTask} />;
        })}
      </div>
    );
  }

  eachDateTasks = () => {
    const { currentDateFromSelect, getList } = this.state;
    let results = [];
    getList
      .sort((a, b) => new Date(b.datetime) - new Date(a.datetime))
      .reverse()
      .map(task => {
        if (currentDateFromSelect.timestamp === "all") {
          results.push(task);
        } else {
          const todayLimit =
            currentDateFromSelect.timestamp - 7 * 1000 * 60 * 60;
          const tmrwLimit =
            currentDateFromSelect.timestamp + 1 * 24 * 60 * 60 * 1000;
          if (todayLimit <= task.datetime && task.datetime <= tmrwLimit) {
            results.push(task);
          }
        }
      });
    this.setState({
      eachDateTasks: results
    });
  };

  render() {
    const {
      getList,
      dataFetchMsg,
      filterTaskOptions,
      currentDateFromSelect,
      eachDateTasks
    } = this.state;
    let countDone = 0;
    eachDateTasks.forEach(task => {
      if (task.status === true) {
        countDone++;
      }
    });
    const calPercentage = (countDone / eachDateTasks.length) * 100;
    const percentage = calPercentage.toFixed(0);
    if (getList.length === 0 || eachDateTasks.length === 0)
      return <h1 className="wariningMsg">{dataFetchMsg}</h1>;
    return (
      <div className="allTasks">
        <ProgressBar percentage={percentage} title="Your Group Score" />
        <div className="chooseDate">
          <button className="prevButton" onClick={this.prevDate}>
            &lt;
          </button>
          <Select
            className="select"
            placeholder={currentDateFromSelect.humanDate}
            value={currentDateFromSelect.humanDate}
            onChange={this.handleChange}
            options={filterTaskOptions}
          />
          <button className="nextButton" onClick={this.nextDate}>
            &gt;
          </button>
        </div>
        <div className="taskContentWrap">{this.allTasksTable()}</div>
      </div>
    );
  }
}
export default AllList;
