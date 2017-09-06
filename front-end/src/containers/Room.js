import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import * as roomActions from 'actions/room';
import Game from './Game';
import handler from 'utils/handler';
import { getFormatTime } from 'utils/formatter';

const renderMessageList = (messageList) => {
    let list = [];
    messageList.forEach((message, index) => {
        list.push(
            <div key={index}>
                <span>time:{ getFormatTime(message.timestamp) }</span>
                <span>content: { message.content }</span>
                <span>by: { JSON.stringify(message.by) }</span>
            </div>
        )
    });
    return (
        <div>
            { list }
        </div>
    )
};

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
    state = {
        messageInputValue: ''
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
                                    <button onClick={ handler.startGame }>start game</button>
                                )
                            }
                        })()
                    }
                </div>
                <div>
                    <Game status={gameStatus}/>
                </div>
                <div>
                    <input
                        value={this.state.messageInputValue}
                        onChange={
                            e => {
                                let messageInputValue = e.target.value;
                                this.setState({
                                    messageInputValue
                                });
                            }
                        }
                        onKeyDown={::this.sendMessage}
                    />
                </div>
                <div>
                    {renderMessageList(currentRoom.messageList)}
                </div>
            </section>
        )
    }
    sendMessage (e) {
        if (e.keyCode === 13) {
            handler.sendRoomMessage(this.state.messageInputValue);
            this.setState({
                messageInputValue: ''
            });
        }
    }
    componentDidMount () {
        let { roomName, currentRoom } = this.props;
        if (currentRoom && currentRoom.roomName === roomName) return;
        // todo 处理此时socket还未连接上的情况
        handler.enterRoom(roomName);
    }
}

