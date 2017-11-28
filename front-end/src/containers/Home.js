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
                <div>
                    <input
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
                    <span className={"btn" + (this.state.roomInputValue ? '' : ' disabled')} onClick={::this.enterRoom}>进入房间</span>
                </div>
                {
                    roomList.map(({ roomName, peopleCount, owner }) => (
                        <div
                            key={roomName}
                        >
                            <Link to={'/' + roomName}>
                                <div>
                                    <svg className="icon" aria-hidden="true">
                                        <use xlinkHref="#icon-home"></use>
                                    </svg>
                                    <span>{roomName}</span>
                                </div>
                                <div>
                                    <svg className="icon" aria-hidden="true">
                                        <use xlinkHref="#icon-group"></use>
                                    </svg>
                                    <span>{peopleCount}</span>
                                </div>
                                <div>
                                    <svg className="icon" aria-hidden="true">
                                        <use xlinkHref="#icon-favor"></use>
                                    </svg>
                                    <span>{ getPersonName(owner) }</span>
                                </div>
                            </Link>
                        </div>
                    ))
                }
            </section>

        )
    }
    enterRoom (e) {
        if (!this.state.roomInputValue) return;
        history.push('/' + this.state.roomInputValue);
    }
    componentDidMount () {
        let { setRoomInfo } = this.props;
        wsAction.leaveRoom();
        setRoomInfo({ roomName: '' });
    }
}