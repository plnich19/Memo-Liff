import React, { Component } from 'react';
// import firebase from 'firebase';
// import ReactDOM from 'react-dom';
import Modal from 'react-responsive-modal';
import './YourList.css';

const liff = window.liff;

class YourList extends Component {

    constructor(props) {
        super(props);
        // this.initialize = this.initialize.bind(this);
        this.state = {
            liffData: '',
            getYourList: [],
            displayName: '',
            userId: '',
            pictureUrl: '',
            statusMessage: '',
            openEdit: false,
            openDelete: false,
            checked: false,
            openCheck: false,
            groupId:''
        };

    }


    liffSuccess = (data) => {
        console.log(data)
        const groupId = data.context.groupId;
        let profile = liff.getProfile();
        this.setState({
            liffData: data,
            displayName: profile.displayName,
            userId: profile.userId,
            pictureUrl: profile.pictureUrl,
            statusMessage: profile.statusMessage,
        groupId: groupId 
    });
}

liffError = (err) => {
    console.error("liffError")
    this.setState({
        liffData: err
    });
}


initialize = () => {
    liff.init(this.liffSuccess, this.liffError)
}

getData = (context) =>{
    console.log('getData context' ,context)
    const action = `getYourTask`
    const groupId = context.groupId
    const userId = context.userId
    const API = `https://asia-east2-memo-chatbot.cloudfunctions.net/DataAPI/?action=${action}&groupId=${groupId}&userId=${userId}`
    fetch(API)
    .then(response => response.json())
    .then(data => {
        console.log('getData afterFetch',data)
        this.setState({ getYourList:data })
    });
}

componentDidMount() {
    const {context} = this.props
    console.log('YourList componentDidMount props',this.props)
    console.log('YourList componentDidMount state',this.state)
    this.getData(context)
}

onOpenEditModal = () => {
    this.setState({ openEdit: true });
};

onCloseEditModal = () => {
    this.setState({ openEdit: false });
};

onOpenDeleteModal = () => {
    this.setState({ openDelete: true });
};

onCloseDeleteModal = () => {
    this.setState({ openDelete: false });
};

onOpenCheckModal = () => {
    this.setState({ openCheck: true });
};

onCloseCheckModal = () => {
    this.setState({ openCheck: false });
};

handleCheckboxChange = event =>
    this.setState({ checked: event.target.checked });

changeCheck = () => {
    if (this.state.checked === false) {
        this.setState({ checked: true, openCheck: false })
    }
    if (this.state.checked === true) {
        this.setState({ checked: false, openCheck: false })
    }
}

render() {
    const { context } = this.props
    const {
        displayName,
        groupId,
        pictureUrl
    } = context
    return (
        <div>

            <div>
                <h1>Your Tasks ({displayName})</h1>
                <table className='alllisttable'>
                {
                    this.state.getYourList.map((task) => {
                        const {
                            taskId='',
                            title='',
                            status='',
                            assignee=[],
                            createtime=''
                        } = task
                        return (
                            <tr key={`allTasks-${taskId}`}><td>- {`${title} [${status}]`}</td></tr>
                        )
                    })
                }
                </table>
            </div>

            <button className='editModal' onClick={this.onOpenEditModal}>Edit</button>
            <Modal open={this.state.openEdit} onClose={this.onCloseEditModal} center>
                <h2>Edit</h2>
                <form>
                    <p>Tasks: </p>
                    <input type="text" />
                    <p>Responsibility: </p>
                    <input type="text" />
                    <div></div>
                </form>
                <button>Update</button>
                <button onClick={this.onCloseEditModal}>Cancel</button>
            </Modal>

            <button className='deleteModal' onClick={this.onOpenDeleteModal}>Delete</button>
            <Modal open={this.state.openDelete} onClose={this.onCloseDeleteModal} center>
                <h2>Delete!!!</h2>
                <div>
                    <p className='deleteText'>Are you sure you want to delete this task?</p>

                    <button>Delete</button>
                    <button onClick={this.onCloseDeleteModal}>Cancel</button>
                </div>
            </Modal>

            <label className='checkboxContainer'>
                <span className='checkboxText'>Done?</span>
                <input type='checkbox' className='checkDone'
                    checked={this.state.checked}
                    onClick={this.onOpenCheckModal}
                // onChange={this.handleCheckboxChange}
                ></input>
            </label>
            <Modal open={this.state.openCheck} onClose={this.onCloseCheckModal} center>
                <h2>Status</h2>
                <p className='checkText'>Are you sure you really done this task?</p>
                <div>
                    <button onClick={this.changeCheck}>Yes</button>
                    <button onClick={this.onCloseCheckModal}>No</button>
                </div>
            </Modal>
        </div>
    );
}
}
export default YourList;