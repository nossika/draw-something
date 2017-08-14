import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import * as cardActions from 'actions/card';
import Card from 'components/Card';
import http from 'network/http';

@connect(
    state => ({
        list: state.card.list
    }),
    dispatch => bindActionCreators({...cardActions}, dispatch)
)
export default class Board extends Component {
    render () {
        const { list, addCard } = this.props;

        return (
            <div>
                card co1unt: { list.map(item => (<Card key={item} name={item}/>)) }
                <div
                    onClick={() => {
                        http.request({
                            url: '/list',
                            method: 'get',
                            params: {
                                q: 1
                            }
                        })
                        .then(res => {
                            addCard(res.time);
                        });

                    }}
                >add</div>
            </div>

        )
    }
}