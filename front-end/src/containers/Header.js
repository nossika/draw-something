import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as networkActions from 'actions/network';

@connect(
    state => ({
        loadingStatus: state.network.loadingStatus,
        webSocketStatus: state.network.webSocketStatus,
        user: state.user
    }),
    dispatch => bindActionCreators({...networkActions}, dispatch)
)
export default class Header extends Component {
    static defaultProps = {
        btn: [],
    };
    render () {
        const { loadingStatus, webSocketStatus, loading, loaded, wsConnect, wsDisconnect, user, title, btn } = this.props;

        let btnList = btn.map(name => {
            switch (name) {
                case 'home':
                    return (
                        <Link to={'/'} key={name}>
                            back
                        </Link>
                    );
                default:
                    return null;
            }
        });

        return (
            <section className="fixed-header">
                <div className={ `wifi ${webSocketStatus ? 'success-color' : 'alert-color'}` }>
                    <svg className="icon" aria-hidden="true">
                        <use xlinkHref="#icon-wifi"></use>
                    </svg>
                </div>
                <div>myId: { user.id }</div>
                <div>title: { title }</div>
                <div>
                    {btnList}
                </div>
            </section>
        )
    }
}