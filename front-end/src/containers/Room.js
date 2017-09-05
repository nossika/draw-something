import React, { Component } from 'react';
import PropTypes from 'prop-types';
import socket from 'network/ws';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import * as roomActions from 'actions/room';
import Game from './Game';


@connect(
    state => ({
        currentRoom: state.room.currentRoom,
        isRoomOwner: state.room.currentRoom.owner && state.user.info.id === state.room.currentRoom.owner.id,
        gameStatus: state.game.status,
    }),
    dispatch => bindActionCreators({...roomActions}, dispatch)
)
export default class Room extends Component {
    static propTypes = {
        roomName: PropTypes.string.isRequired
    };
    render () {
        let { currentRoom, isRoomOwner, gameStatus } = this.props;
        return (
            <section>
                <div>roomName: { currentRoom.roomName }</div>
                <div>count: { currentRoom.people.length }</div>
                <div>owner: { JSON.stringify(currentRoom.owner) }</div>
                <div>list: { JSON.stringify(currentRoom.people) }</div>

                <div>
                    {
                        (() => {
                            if (isRoomOwner && gameStatus === 'await') {
                                return (
                                    <button onClick={::this.startGame}>start game</button>
                                )
                            }
                        })()
                    }
                </div>
                <div>
                    <Game status={gameStatus}/>
                </div>
            </section>
        )
    }
    startGame () {
        socket.emit('startGame');
    }
    componentDidMount () {
        let { roomName, setRoomInfo, currentRoom } = this.props;
        if (currentRoom && currentRoom.roomName === roomName) return;
        socket.emit('enterRoom', roomName, () => {
            setRoomInfo({ roomName });
        }); // todo 处理此时socket还未连接上的情况

    }
}

