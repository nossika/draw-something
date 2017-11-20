import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import * as roomActions from 'actions/room';
import history from 'utils/history';
import wsAction from 'utils/wsAction';
import Header from 'containers/Header';

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
                    <span>enter room name</span>
                    <input
                        value={this.state.roomInputValue}
                        onChange={
                            e => {
                                let roomInputValue = e.target.value;
                                this.setState({
                                    roomInputValue
                                });
                            }
                        }
                        onKeyDown={::this.enterRoom}
                    />
                </div>
                {
                    roomList.map(({ roomName, peopleCount, owner }) => (
                        <div
                            key={roomName}
                        >
                            <Link to={'/' + roomName}>
                                { roomName }: { peopleCount }, owner: { owner ? (owner.info.name || owner.id) : '-' }
                            </Link>
                        </div>
                    ))
                }
            </section>

        )
    }
    enterRoom (e) {
        if (e.keyCode === 13) {
            history.push('/' + this.state.roomInputValue);
        }
    }
    componentDidMount () {
        let { setRoomInfo } = this.props;
        wsAction.leaveRoom();
        setRoomInfo({ roomName: '' });
    }
}