import React, { Component } from 'react';

export default class Card extends Component {
    render () {
        const { name } = this.props;
        return (
            <div>
                card
                name: { name }
            </div>
        )
    }
}