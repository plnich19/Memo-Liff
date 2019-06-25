import React, { Component } from 'react';
import firebase from 'firebase';

class YourList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            getList: [],
            displayName:[]
        };

    }
    
    componentDidMount() {
        
        let instantLists = []
        const ref = firebase.firestore().collection('data').doc('groupId-fadgeagsdfreasdgfgesdf').collection('tasks');
        const query = ref.where('assignee', 'array-contains', this.state.displayName).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    instantLists.push(doc.id)
                    console.log(doc.id)
                });


                console.log(instantLists, 'instantLists')
                this.setState({
                    getList: instantLists
                })

            })
            .catch(err => {
                console.log('Error getting documents', err);
            });
        console.log(query)
        console.log("this"+this.state.getList)
    }

    render() {
        return (
            <div>

                <div>
                    <h1>Your Tasks</h1>
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
            </div>
        );
    }
}
export default YourList;