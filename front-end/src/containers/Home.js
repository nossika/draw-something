import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import * as roomActions from 'actions/room';

@connect(
    state => ({
        roomList: state.room.roomList
    }),
    dispatch => bindActionCreators({...roomActions}, dispatch)
)
export default class Home extends Component {
    render () {
        const { roomList } = this.props;
        return (
            <div>
                hello !
                {
                    roomList.map(({ room, count }) => (
                        <div key={room}>{room}: {count}</div>
                    ))
                }
            </div>

        )
    }
}