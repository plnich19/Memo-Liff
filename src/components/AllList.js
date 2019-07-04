import React, { Component } from 'react';
// import firebase from 'firebase';
import './AllList.css';
class AllList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            getList: [],
            dataFetchMsg: 'loading'
        };
    }

    getData = (context) => {
        console.log('getData context', context)
        const action = `getTasks`
        const groupId = context.groupId
        const API = `https://asia-east2-memo-chatbot.cloudfunctions.net/DataAPI/?action=${action}&groupId=${groupId}`
        fetch(API)
            .then(response => response.json())
            .then(data => {
                console.log('getData afterFetch', data)
                this.setState({ getList: data })
            });
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
        return(
        <table>
            {
                this.state.getList.map((task) => {
                    return (
                        <tr key={task.taskId}>

                            <td>{task.title}</td>
                            <td>{task.assignee}</td>
                            <td>{task.datetime}</td>
                        </tr>
                    )
                })
            }
        </table>
        )
    }

    // tableHeader(){
    //         let header = Object.keys(this.state.getList[0] )
    //         return header.map((key,index)=>{
    //             return <th key={index}>{key.toUpperCase()}</th>
    //         })
    // }

    render() {
        const {getList, dataFetchMsg} = this.state
        return (
            <div>
                <h1>All Tasks</h1>
                {
                    getList.length > 0 ?
                        <table >
                            <tbody className='allListTable'>
                                {/* <tr>{this.tableHeader()}</tr> */}
                                {this.allTasksTable()}
                            </tbody>
                        </table> :
                        <h1>{dataFetchMsg}</h1>
                }
            </div>
        );
    }


}
export default AllList;