import React, { Component } from 'react';
import './AllList.css';
import moment from 'moment'
class AllList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      getList: [],
      getMembersList: [],
      dataFetchMsg: 'loading'
    };
  }

  getData = (context) => {
    console.log('getData context', context)
    const actions = [`getTasks`, `getMembers`]
    const groupId = context.groupId
    actions.forEach(action => {
      const API = `https://asia-east2-memo-chatbot.cloudfunctions.net/DataAPI/?action=${action}&groupId=${groupId}`
      fetch(API)
        .then(response => response.json())
        .then(data => {
          if (action === 'getTasks') {
            console.log('getData afterFetch', data)
            this.setState({ getList: data })
          }
          else {
            this.setState({ getMembersList: data })
            console.log('getMembersList afterFetch', data)

          }

        });
    })
  }

  componentWillMount() {
    const { context } = this.props
    console.log('AllList componentDidMount props', this.props)
    console.log('AllList componentDidMount state', this.state)
    this.getData(context)
  }

  componentDidMount() {

  }

  allTasksTable() {
    return (
      <div>
        {
          this.state.getList.map((task) => {
            return (
              <div className='taskContent'>
                <div>Title: {task.title}</div>
                <div>Due Date: {moment(task.datetime).format('MMMM Do YYYY h:mm a')}</div>
                <div className='assignee'>
                Assignee: {
                    task.assignee.map((eachAssigneeID) => {
                      return this.state.getMembersList.map((eachMember) => {
                        if (eachMember.userId === eachAssigneeID) {
                          return <span className='member'>{eachMember.displayName}</span>
                        } else {
                          return null
                        }
                      })
                    })
                  }
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }

  // divHeader() {
  //     let header = Object.keys(this.state.getList[0])
  //     return header.maspan((key, index) => {
  //         return <th key={index}>{key.toUpperCase()}</th>
  //     })
  // }
  render() {
    const { getList, dataFetchMsg } = this.state
    return (
      <div className='allTasks'>
        <h1>All Tasks</h1>
        {
          getList.length > 0 ?
            <div className='oneTask'>
              {/* <th>
                                <tr>{this.tableHeader()}</tr>
                            </th> */}
              {this.allTasksTable()}
            </div> :
            <h1>{dataFetchMsg}</h1>
        }
      </div>
    );
  }


}
export default AllList;