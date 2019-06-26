import React, { Component } from 'react';
import firebase from 'firebase';
import './AllList.css';
class AllList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            getList: []

        };

    }

    componentDidMount() {
        let instantLists = []
        const ref = firebase.firestore().collection('data').doc('groupId-fadgeagsdfreasdgfgesdf').collection('tasks');
        const query = ref.get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    instantLists.push(doc.id)
                });
                console.log(instantLists, 'instantLists')
                this.setState({
                    getList: instantLists
                })
            })
            .catch(err => {
                console.log('Error getting documents', err);
            });
        console.log(this.state.getList)
    }

    render() {

        return (
            <div>
                <h1>All Tasks</h1>
                <table className='alllisttable'>
                    {
                        this.state.getList.map((id) => {
                            return (
                                <tr>{id}</tr>
                            )
                        })
                    }
                </table>
            </div>
        );
    }


}
export default AllList;