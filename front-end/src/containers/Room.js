import React, { Component } from 'react';
import PropTypes from 'prop-types';
import socket from 'network/ws';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import * as roomActions from 'actions/room';

@connect(
    state => ({
        myRoom: state.room.myRoom
    }),
    dispatch => bindActionCreators({...roomActions}, dispatch)
)
export default class Room extends Component {
    static propTypes = {
        roomName: PropTypes.string.isRequired
    };
    render () {
        let { myRoom } = this.props;
        return (
            <section>
                <div>roomName: { myRoom.roomName }</div>
                <div>count: { myRoom.people.length }</div>
                <div>owner: { JSON.stringify(myRoom.owner) }</div>
                <div>list: { JSON.stringify(myRoom.people) }</div>
            </section>
        )
    }
    componentDidMount () {
        let { roomName, setRoomInfo } = this.props;
        socket.emit('enterRoom', roomName, () => {
            setRoomInfo({ roomName });
        }); // todo 处理此时socket还未连接上的情况

    }
}