import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import * as roomActions from 'actions/room';
import history from 'utils/history';
import socket from 'network/ws';

@connect(
    state => ({
        roomList: state.room.roomList
    }),
    dispatch => bindActionCreators({...roomActions}, dispatch)
)
export default class Home extends Component {
    state = {
        roomInputValue: ''
    };
    render () {
        const { roomList } = this.props;
        return (
            <div>
                <div>hello !</div>
                <div>
                    <span>enter room name</span>
                    <input
                        value={this.state.roomInputValue}
                        onChange={::this.roomInputChange}
                        onKeyDown={::this.enterRoom}
                    />
                </div>
                {
                    roomList.map(({ roomName, peopleCount, owner }) => (
                        <div
                            key={roomName}
                        >
                            <Link to={'/' + roomName}>
                                { roomName }: { peopleCount }, owner: { owner ? '-' : owner.id }
                            </Link>
                        </div>
                    ))
                }
            </div>

        )
    }
    roomInputChange (e) {
        let roomInputValue = e.target.value;
        this.setState({
            roomInputValue
        });
    }
    enterRoom (e) {
        if (e.keyCode === 13) {
            history.push('/' + this.state.roomInputValue);
        }
    }
    componentDidMount () {
        let { setRoom } = this.props;
        socket.emit('leaveRoom');
        setRoom('');
    }
}