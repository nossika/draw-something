import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import * as roomActions from 'actions/room';
import history from 'utils/history';
import wsAction from 'utils/wsAction';
import Header from 'containers/Header';
import { getPersonName } from 'utils/main';

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
            <section>
                <Header title="首页" type={'home'}/>
                <section className="home-container">
                    <section className="input-wrapper input-group input-btn">
                        <input
                            className="input input-default input-lg"
                            placeholder="输入房间名"
                            value={this.state.roomInputValue}
                            onChange={
                                e => {
                                    let roomInputValue = e.target.value;
                                    this.setState({
                                        roomInputValue
                                    });
                                }
                            }
                            onKeyDown={ e => {
                                if (e.keyCode === 13) {
                                    this.enterRoom();
                                }
                            }}
                        />
                        <span className={"btn btn-default btn-lg" + (this.state.roomInputValue ? '' : ' disabled')} onClick={::this.enterRoom}>进入房间</span>
                    </section>
                    <section className="room-list-wrapper">
                        {
                            roomList.length ? null : <div className="tip">暂无其他房间，自己创建一个吧~</div>
                        }
                        {
                            roomList.map(({ roomName, peopleCount, owner }) => (
                                <Link
                                    to={'/' + roomName}
                                    className="room-item"
                                    key={roomName}
                                >
                                    <div className="row">
                                        <span className="key">房间</span>
                                        <span className="value">{roomName}</span>
                                    </div>
                                    <div className="row">
                                        <span className="key">人数</span>
                                        <span className="value">{peopleCount}</span>
                                    </div>
                                    <div className="row">
                                        <span className="key">房主</span>
                                        <span className="value">{ getPersonName(owner) }</span>
                                    </div>
                                </Link>
                            ))
                        }

                    </section>
                </section>
            </section>
        )
    }
    enterRoom (e) {
        if (!this.state.roomInputValue) return;
        history.push('/' + this.state.roomInputValue);
    }
    componentDidMount () {
        let { setRoomInfo } = this.props;
        document.title = `你画我猜online`;
        wsAction.leaveRoom();
        setRoomInfo({ roomName: '' });
    }
}