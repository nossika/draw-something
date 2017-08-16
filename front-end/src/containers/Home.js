import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import * as roomActions from 'actions/room';

@connect(
    state => ({
        roomList: state.room.roomList
    }),
    dispatch => bindActionCreators({...roomActions}, dispatch)
)
export default class Home extends Component {
    state = {
        roomInputValue: '1'
    };
    render () {
        const { roomList } = this.props;
        return (
            <div>
                <div>hello !</div>
                <div>
                    <span>enter room name</span>
                    <input
                        value={this.state.roomInputValue}
                        onChange={::this.roomInputChange}
                        onKeyDown={::this.enterRoom}
                    />
                </div>
                {
                    roomList.map(({ room, count }) => (
                        <div
                            key={room}

                        >
                            <Link to={'/' + room}>
                                { room }: { count }
                            </Link>
                        </div>
                    ))
                }
            </div>

        )
    }
    roomInputChange (e) {
        let roomInputValue = e.target.value;
        this.setState({
            roomInputValue
        });
    }
    enterRoom (e) {
        console.log(e.keyCode, e)
        console.log(this.state.roomInputValue)

    }
}