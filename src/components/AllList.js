import React, { Component } from 'react';
import firebase from 'firebase';
import './AllList.css';
class AllList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            allTasks:[]

        };

    }

    getAllTasks = () => {
        console.log(this, 'aaa')
        fetch(`https://asia-east2-memo-chatbot.cloudfunctions.net/DataAPI/?action=getTasks&groupId=${this.props.groupId}`)
          .then(res => res.json())
          .then(allTasks => {
            this.setState({ allTasks })
            console.log("this", this.state.allTasks)
          })
          .catch(err => {
            console.error(err)
          })
    
        console.log("this +", this.state.allTasks)
      }

    

    componentDidMount() {
        this.getAllTasks()

        // let instantLists = []
        // const ref = firebase.firestore().collection('data').doc('groupId-fadgeagsdfreasdgfgesdf').collection('tasks');
        // const query = ref.get()
        //     .then(snapshot => {
        //         snapshot.forEach(doc => {
        //             instantLists.push(doc.id)
        //         });
        //         console.log(instantLists, 'instantLists')
        //         this.setState({
        //             getList: instantLists
        //         })
        //     })
        //     .catch(err => {
        //         console.log('Error getting documents', err);
        //     });
        // console.log(this.state.getList)
    }

    render() {

        return (
            <div>
                <h1>All Tasks</h1>
                <table className='alllisttable'>
                    {
                        this.state.allTasks.map((id) => {
                            return (
                                <tr>{id}</tr>
                            )
                        })
                    }
                </table>
                <div>
                    {this.props.groupId}
                </div>
            </div>
        );
    }


}
export default AllList;