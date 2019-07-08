import React, { Component } from 'react';
import './AllList.css';
import moment from 'moment'
import Select from 'react-select';

class AllList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      getList: [],
      getMembersList: [],
      dataFetchMsg: 'loading',
      selectedFilterTaskOption: 'all',
      filterTaskOptions: []
    };
  }

  getData = (context) => {
    const actions = [`getTasks`, `getMembers`]
    const groupId = context.groupId
    actions.forEach(action => {
      const API = `https://asia-east2-memo-chatbot.cloudfunctions.net/DataAPI/?action=${action}&groupId=${groupId}`
      fetch(API)
        .then(response => response.json())
        .then(data => {
          if (action === 'getTasks') {
            this.setState({ getList: data })
            this.getFilterTaskOptions(data)
          }
          else {
            this.setState({ getMembersList: data })
          }
        });
    })
  }

  getFilterTaskOptions = (data) => {
    let results = data.map((task) => {
      let obj = {
        value: task.datetime,
        label: moment(task.datetime).format('MMMM Do YYYY h:mm a')
      }
      return obj
    })
    results = [
      {
        value: 'all',
        label: 'ALL'
      },
      ...results
    ]
    this.setState({ filterTaskOptions: results })
  }

  handleChange = selectedOption => {
    this.setState({ selectedFilterTaskOption: selectedOption.value });
  };

  componentWillMount() {
    const { context } = this.props
    this.getData(context)
  }

  componentDidMount() {

  }

  taskRenderer = (task) => {
    return (
      <div key={task.taskId} className={`taskContent ${task.status ? 'jobDone' : ''}`}>
        <div>Title: {task.title}</div>
        <div>Due Date: {moment(task.datetime).format('MMMM Do YYYY h:mm a')}</div>
        <div className='assignee'>
          Assignee: {
            task.assignee.map((eachAssigneeID) => {
              return this.state.getMembersList.map((eachMember) => {
                if (eachMember.userId === eachAssigneeID) {
                  return <span key={eachMember.userId} className='member'>{eachMember.displayName}</span>
                } else {
                  return null
                }
              })
            })
          }
        </div>
      </div>
    )
  }


  allTasksTable() {
    return (
      <div>
        {
          this.state.getList.map((task) => {

            if (this.state.selectedFilterTaskOption === "all") {
              return this.taskRenderer(task)
            }
            else {
              if (this.state.selectedFilterTaskOption === task.datetime) {
                return this.taskRenderer(task)
              }
              else {
                return null
              }
            }
          })
        }
      </div>
    )
  }

  render() {
    const { getList, dataFetchMsg, filterTaskOptions, selectedFilterTaskOption } = this.state
    return (
      <div className='allTasks'>
        <h1>All Tasks</h1>
        {
          getList.length > 0 &&
          <Select
            className ='select'
            value={selectedFilterTaskOption}
            onChange={this.handleChange}
            options={filterTaskOptions}
          />
        }
        {
          getList.length > 0 ?
            <div className='oneTask'>
              {this.allTasksTable()}
            </div> :
            <h1>{dataFetchMsg}</h1>
        }
      </div>
    );
  }
}
export default AllList;