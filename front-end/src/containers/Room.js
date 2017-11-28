import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import * as roomActions from 'actions/room';
import Game from './Game';
import Header from 'containers/Header';
import wsAction from 'utils/wsAction';
import { getFormatTime } from 'utils/formatter';
import { getPersonName } from 'utils/main';

const renderMessageList = (messageList) => {
    return (
        <div>
            {
                messageList.map(message => {
                    return (
                        <div key={message.timestamp}>
                            <div>
                                <svg className="icon" aria-hidden="true">
                                    <use xlinkHref="#icon-time"></use>
                                </svg>
                                <span>{ getFormatTime(message.timestamp) }</span>
                            </div>
                            <div>
                                <svg className="icon" aria-hidden="true">
                                    <use xlinkHref="#icon-people"></use>
                                </svg>
                                <span>{ getPersonName(message.by) }</span>
                            </div>
                            <div>{ message.content }</div>
                        </div>
                    )
                })
            }
        </div>
    )
};

@connect(
    state => ({
        currentRoom: state.room.currentRoom,
        gameStatus: state.game.status,
        user: state.user
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
        let { currentRoom, gameStatus, user } = this.props;
        let { owner, people, name } = currentRoom;
        let isRoomOwner = owner && user.id === owner.id;

        return (
            <section>
                <Header title={ name } type={'room'} />
                <div>
                    <svg className="icon" aria-hidden="true">
                        <use xlinkHref="#icon-favor"></use>
                    </svg>
                    <span>{ getPersonName(owner) }</span>
                </div>
                <div>
                    <svg className="icon" aria-hidden="true">
                        <use xlinkHref="#icon-group"></use>
                    </svg>
                    {
                        people.map(person => {
                            return (
                                <span key={person.id}>
                                    { getPersonName(person) }
                                </span>
                            )
                        })
                    }
                </div>
                <div>
                    {
                        (() => {
                            if (isRoomOwner && gameStatus === 'await') {
                                return (
                                    <button onClick={ wsAction.startGame }>start game</button>
                                )
                            }
                        })()
                    }
                </div>
                <div>
                    <Game />
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
            wsAction.sendRoomMessage(this.state.messageInputValue);
            this.setState({
                messageInputValue: ''
            });
        }
    }
    componentDidMount () {
        let { roomName, currentRoom } = this.props;
        if (currentRoom && currentRoom.name === roomName) return;
        // todo 处理此时socket还未连接上的情况
        wsAction.enterRoom(roomName);
    }
}

