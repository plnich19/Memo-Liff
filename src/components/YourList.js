import React, { Component } from 'react';
import firebase from 'firebase';
import ReactDOM from 'react-dom';
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
            groupId: ''
        };

    }


    liffSuccess = (data) => {
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

    componentDidMount() {
        window.addEventListener('load', this.initialize);
        // let instantLists = []
        // const ref = firebase.firestore().collection('data').doc('groupId-fadgeagsdfreasdgfgesdf').collection('tasks');
        // const query = ref.where('assignee', 'array-contains', this.state.displayName).get()
        //     .then(snapshot => {
        //         snapshot.forEach(doc => {
        //             instantLists.push(doc.id)
        //         });
        //         console.log(instantLists, 'instantLists')
        //         this.setState({
        //             getYourList: instantLists
        //         })
        //     })
        //     .catch(err => {
        //         console.log('Error getting documents', err);
        //     });
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
        const { liffData } = this.state
        return (
            <div>

                {/* <div>
                    <h1>Your Tasks</h1>
                    <table className='alllisttable'>
                        {
                            this.state.getYourList.map((id) => {
                                return (
                                    <tr>{id}</tr>
                                )
                            })
                        }
                    </table>
                </div> */}
                <p>17:47</p>
                <p>{liffData}</p>
                <p>{this.state.displayName}</p>
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