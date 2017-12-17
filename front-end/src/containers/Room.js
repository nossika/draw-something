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
        user: state.user,
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
        let { currentRoom } = this.props;
        let { owner, people, name } = currentRoom;
        return (
            <section>
                <Header title={ name } type={'room'} />
                <section className="room-container">
                    <section className="game-block">
                        <Game />
                    </section>
                    <section className="people-block">
                        <div>
                            <span className="icon-wrapper">
                                <svg className="icon" aria-hidden="true">
                                    <use xlinkHref="#icon-favor"></use>
                                </svg>
                            </span>
                            <span>{ getPersonName(owner) }</span>
                        </div>
                        <div>
                            <span className="icon-wrapper">
                                <svg className="icon" aria-hidden="true">
                                    <use xlinkHref="#icon-group"></use>
                                </svg>
                            </span>
                            <span>
                                {
                                    people.filter(person => owner && person.id !== owner.id).map(person => {
                                        return [
                                            <span key={person.id}>
                                                { getPersonName(person) }
                                            </span>,
                                            <br/>
                                        ]
                                    })
                                }
                            </span>
                        </div>
                    </section>
                    <section className="chat-block">
                        <div>
                            <input
                                className="input input-default input-md"
                                placeholder="请输入内容"
                                value={this.state.messageInputValue}
                                onChange={
                                    e => {
                                        let messageInputValue = e.target.value;
                                        this.setState({
                                            messageInputValue
                                        });
                                    }
                                }
                                onKeyDown={e => e.keyCode === 13 && this.sendMessage()}
                            />
                            <span className={"btn btn-default btn-md" + (this.state.messageInputValue ? '' : ' disabled')} onClick={::this.sendMessage}>发送</span>
                        </div>
                        <div>
                            {renderMessageList(currentRoom.messageList)}
                        </div>
                    </section>
                </section>
            </section>
        )
    }
    sendMessage () {
        if (this.state.messageInputValue) {
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

