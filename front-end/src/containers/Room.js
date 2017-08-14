import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Room extends Component {
    static propTypes = {
        room: PropTypes.string.isRequired
    };
    render () {
        let { room } = this.props;
        return (
            <div>room: {room}</div>
        )
    }
}