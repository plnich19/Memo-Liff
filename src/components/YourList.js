import React, { Component } from 'react';
// import firebase from 'firebase';
// import ReactDOM from 'react-dom';
import Modal from 'react-responsive-modal';
import './YourList.css';
import axios from "axios";

const liff = window.liff;

class YourList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            getYourList: [],
            openEdit: false,
            openDelete: false,
            checked: false,
            openCheck: false,
            groupId: '',
            dataFetchMsg: 'no data',
            title: '',
            datetime: ''
        };
    }

    getData = (context) => {
        console.log('getData context', context)
        const action = `getYourTask`
        const groupId = context.groupId
        const userId = context.userId
        fetch(`https://asia-east2-memo-chatbot.cloudfunctions.net/DataAPI/?action=${action}&groupId=${groupId}&userId=${userId}`)
            .then(response => response.json())
            .then(data => {
                console.log('getData afterFetch', data)
                this.setState({ getYourList: data })
            })
    }

    submitUpdateTask = () => {
        const { context } = this.props
        this.updateStatus(context);
        this.onCloseEditModal();
    }

    onTitleChanged = (event) => {
        console.log('onTitleChanged', event.target.value)
        this.setState({
            modalTitle: event.target.value
        });
    };

    onDateTimeChanged = (event) => {
        console.log('onDateTimeChanged', event.target.value)
        this.setState({
            modalDatetime: event.target.value
        });
    };

    updateStatus = (context) => {
        const groupId = context.groupId
        const { openTaskId, modalTitle, modalDatetime,checked } = this.state
        const taskId = openTaskId
        console.log(taskId, 'eeee')
        const url = `https://asia-east2-memo-chatbot.cloudfunctions.net/DataAPI/?action=updateTask&groupId=${groupId}&taskId=${taskId}`
        const bodyData = {
            title: modalTitle,
            datetime: modalDatetime,
            status: checked
        };
        console.log('ff', bodyData)
        axios
            .post(url, bodyData)
            .then((response) => {
                console.log(response);
                this.getData(context)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    submitDeleteTask = () => {
        const { context } = this.props
        this.deleteFetch(context)
        this.onCloseDeleteModal()
    }

    deleteFetch(context) {
        const groupId = context.groupId
        console.log(groupId, 'www')
        const taskId = this.state.thisTaskId
        console.log(taskId, '1www')
        const url = `https://asia-east2-memo-chatbot.cloudfunctions.net/DataAPI/?action=deleteTask&groupId=${groupId}&taskId=${taskId}`
        axios
            .post(url)
            .then((response) => {
                console.log(response);
                this.getData(context)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    componentWillMount() {
        const { context } = this.props
        this.getData(context)
    }

    componentDidMount = () => {

    }

    onOpenEditModal = (taskId) => (e) => {
        const { getYourList } = this.state
        console.log('onOpenEditModal getYourList', getYourList)
        const selectedTask = getYourList.find((task) => {
            return task.taskId === taskId
        })
        console.log('onOpenEditModal selectedTask', selectedTask)
        this.setState({
            openEdit: true,
            openTaskId: taskId,
            modalTitle: selectedTask.title,
            modalDatetime: selectedTask.datetime,
        });
    };

    onCloseEditModal = () => {
        this.setState({ openEdit: false });
    };

    onOpenDeleteModal = (taskId) => (e) => {
        const { getYourList } = this.state
        console.log('onOpenDeleteModal getYourList', getYourList)
        const selectedTask = getYourList.find((task) => {
            return task.taskId === taskId
        })
        this.setState({
            openDelete: true,
            thisTaskId: taskId
        });
    };

    onCloseDeleteModal = () => {
        this.setState({ openDelete: false });
    };

    onOpenCheckModal = (task) => (e) =>{
        const { taskId } = task
        // const { getYourList } = this.state
        // console.log('onOpenCheckModal getYourList', getYourList)
        // const selectedTask = getYourList.find((curTask) => {
        //     return curTask.taskId === taskId
        // })
        this.setState({
            openCheck: true,
            openTaskId: taskId,
            checked: !task.status
        });
        console.log(this.state.checkThis,'bb')
    };

    onCloseCheckModal = () => {
        this.setState({ openCheck: false });
    };

    sumitCheck = () => {
        this.setState({ openCheck: false })
        this.updateStatus(this.props.context)
    }

    yourTasksTable = () => {
        return (
            <table>
                <Modal open={this.state.openEdit} onClose={this.onCloseEditModal} center>
                    <h2>Edit</h2>
                    <form>
                        <p>Tasks: </p>
                        <input type="text" name='title' value={this.state.modalTitle} onChange={this.onTitleChanged} />
                        <p>datetime: </p>
                        <input type="text" name='datetime' value={this.state.modalDatetime} onChange={this.onDateTimeChanged} />
                        <div></div>
                    </form>
                    <button onClick={event => { this.submitUpdateTask(this.state.openTaskId) }}>Update</button>
                    <button onClick={this.onCloseEditModal}>Cancel</button>
                </Modal>
                <Modal open={this.state.openDelete} onClose={this.onCloseDeleteModal} center>
                    <h2>Delete!!!</h2>
                    <div>
                        <p className='deleteText'>Are you sure you want to delete this task?</p>
                        <button onClick={event => { this.submitDeleteTask(this.state.openTaskId) }}>Delete</button>
                        <button onClick={this.onCloseDeleteModal}>Cancel</button>
                    </div>
                </Modal>
                <Modal open={this.state.openCheck} onClose={this.onCloseCheckModal} center>
                    <h2>Status</h2>
                    <p className='checkText'>Are you sure you want to change status?</p>
                    <div>
                        <button onClick={this.sumitCheck}>Yes</button>
                        <button onClick={this.onCloseCheckModal}>No</button>
                    </div>
                </Modal>
                {
                    this.state.getYourList.map((task) => {
                        return (
                            <tr key={task.taskId}>
                                <td>{task.title}</td>
                                {/* <td>{task.assignee}</td> */}
                                <td>{task.datetime}</td>
                                <td>
                                    <button className='editModal' onClick={this.onOpenEditModal(task.taskId)}>Edit</button>
                                </td>
                                <td>
                                    <button className='deleteModal' onClick={this.onOpenDeleteModal(task.taskId)}>Delete</button>
                                </td>
                                <td>status: {`${task.status}`}</td>
                                <td>
                                    <label className='checkboxContainer'>
                                        <input type='checkbox' className='checkDone'
                                            checked={task.status}
                                            onClick={this.onOpenCheckModal(task)}>
                                        </input>
                                    </label>
                                </td>
                            </tr>
                        )
                    })
                }
            </table>
        )
    }

    render() {
        const { getYourList, dataFetchMsg } = this.state
        return (
            <div>
                <div>
                    <h1>Your Tasks </h1>
                    {
                        getYourList.length > 0 ?
                            <table >
                                <tbody>
                                    {this.yourTasksTable()}
                                </tbody>
                            </table> :
                            <h1>{dataFetchMsg}</h1>
                    }
                </div>
            </div>
        );
    }
}
export default YourList;