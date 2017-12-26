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
import { message$ } from 'flow/message';

const renderMessageList = (messageList) => {
    return (
        <div>
            {
                messageList.map(message => {
                    if (message.type === 'system') {
                        return (
                            <div className="message" key={message.timestamp}>
                                <div className="info">
                                    <span className="by">{ getPersonName(message.by) } { {'enter': '进入房间', 'leave': '离开房间'}[message.content] }</span>
                                    <span className="time">{ getFormatTime(message.timestamp, 'HMS') }</span>
                                </div>
                            </div>
                        )
                    } else {
                        return (
                            <div className="message" key={message.timestamp}>
                                <div className="info">
                                    <span className="by">{ getPersonName(message.by) }</span>
                                    <span className="time">{ getFormatTime(message.timestamp, 'HMS') }</span>
                                </div>
                                <div className="content">{ message.content }</div>
                            </div>
                        )
                    }
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
                        <div title="房主">
                            <span className="icon-wrapper">
                                <svg className="icon" aria-hidden="true">
                                    <use xlinkHref="#icon-favor"></use>
                                </svg>
                            </span>
                            <span>{ getPersonName(owner) }</span>
                        </div>
                        <div>
                            {
                                people.filter(person => owner && person.id !== owner.id).map((person, index) => {
                                    let personName = getPersonName(person);
                                    return (
                                        <div key={person.id}>
                                            <span className="icon-wrapper" style={{visibility: index === 0 ? 'visible' : 'hidden'}}>
                                                <svg className="icon" aria-hidden="true">
                                                    <use xlinkHref="#icon-group"></use>
                                                </svg>
                                            </span>
                                            <span title={personName}>
                                                { personName }
                                            </span>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </section>
                    <section className="chat-block" ref="chat-block">
                        { renderMessageList(currentRoom.messageList) }
                    </section>
                    <section className="input-block">
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
        this.message$$ = message$.subscribe(message => {
            this.refs['chat-block'].scrollTop = this.refs['chat-block'].scrollHeight;
        });
        if (currentRoom && currentRoom.name === roomName) return;
        // todo 处理此时socket还未连接上的情况
        wsAction.enterRoom(roomName);
    }
    componentWillUnmount () {
        this.message$$.unsubscribe();
    }
}

