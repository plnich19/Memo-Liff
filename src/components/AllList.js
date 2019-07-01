import React, { Component } from 'react';
// import firebase from 'firebase';
import './AllList.css';
class AllList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            getList: []
        };
    }

    componentDidMount() {
        const {context} = this.props
        console.log('AllList componentDidMount props',this.props)
        console.log('AllList componentDidMount state',this.state)
        this.getData(context)
    }

    getData = (context) =>{
        console.log('getData context' ,context)
        const action = `getTasks`
        const groupId = context.groupId
        const API = `https://asia-east2-memo-chatbot.cloudfunctions.net/DataAPI/?action=${action}&groupId=${groupId}`
        fetch(API)
        .then(response => response.json())
        .then(data => {
            console.log('getData afterFetch',data)
            this.setState({ getList:data })
        });
    }

    render() {
        return (
            <div>
                <h1>All Tasks</h1>
                <table className='alllisttable'>
                    {
                        this.state.getList.map((task) => {
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
        );
    }


}
export default AllList;