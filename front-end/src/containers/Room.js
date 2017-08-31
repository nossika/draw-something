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
        room: PropTypes.string.isRequired
    };
    render () {
        let { room, myRoom } = this.props;
        return (
            <section>
                <div>room: { myRoom.name }</div>
                <div>count: { myRoom.people.length }</div>
                <div>list: { JSON.stringify(myRoom.people) }</div>
            </section>
        )
    }
    componentDidMount () {
        let { room, setRoom } = this.props;
        socket.emit('enterRoom', room, () => {
            setRoom(room);
        }); // todo 处理此时socket还未连接上的情况

    }
}