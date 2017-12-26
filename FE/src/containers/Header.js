import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as networkActions from 'actions/network';
import wsAction from "../utils/wsAction";

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
        type: '',
    };
    state = {
        nameEditable: false,
        nameValue: '',
    };
    render () {
        const { loadingStatus, webSocketStatus, loading, loaded, wsConnect, wsDisconnect, user, title, type } = this.props;

        let typeNode = (type) => {
            switch (type) {
                case 'home':
                    return null;
                case 'room':
                    return (
                        <Link to={'/'}>
                            <span className="icon-wrapper">
                                <svg className="icon clickable" aria-hidden="true">
                                    <use xlinkHref="#icon-back"></use>
                                </svg>
                            </span>

                        </Link>
                    );
                default:
                    return null;
            }
        };
        return (
            <section className="fixed-header">
                <div className="item left">
                    <span>
                        { typeNode(type) }
                    </span>
                    <span>
                        { type === 'room' ? `房间[${title}]` : title }
                    </span>
                </div>


                <div className="item right" onClick={::this.switchInfoEditable}>

                    {
                        this.state.nameEditable
                            ? (
                                [
                                    <span className="icon-wrapper">
                                        <svg className="icon" aria-hidden="true">
                                            <use xlinkHref="#icon-people"></use>
                                        </svg>
                                    </span>,
                                    <input
                                        className="input input-white input-md"
                                        value={this.state.nameValue}
                                        onChange={
                                            (e) => {
                                                this.setState({
                                                    nameValue: e.target.value
                                                })
                                            }
                                        }
                                        onKeyDown={
                                            (e) => {
                                                if (e.keyCode === 13) {
                                                    this.setName();
                                                }
                                            }
                                        }
                                    />,
                                    <span className="icon-wrapper" onClick={::this.setName}>
                                        <svg className="icon clickable" aria-hidden="true">
                                            <use xlinkHref="#icon-roundcheck"></use>
                                        </svg>
                                    </span>,
                                    <span className="icon-wrapper" onClick={
                                        () => {
                                            this.setState({
                                                nameEditable: false,
                                            });
                                        }
                                    }>
                                        <svg className="icon clickable" aria-hidden="true">
                                            <use xlinkHref="#icon-roundclose"></use>
                                        </svg>
                                    </span>
                                ]
                            )
                            : (
                                <div title="点击修改昵称" className="clickable">
                                    <span className="icon-wrapper">
                                        <svg className="icon" aria-hidden="true">
                                            <use xlinkHref="#icon-profile"></use>
                                        </svg>
                                    </span>
                                    <span>{ user.info.name || user.id }</span>
                                </div>
                            )

                    }


                </div>
                {
                    webSocketStatus
                        ? null
                        : (
                            <div
                                className={ `item wifi ${'alert-color'}` }
                                title={'网络出错'}
                            >
                                <svg className="icon" aria-hidden="true">
                                    <use xlinkHref="#icon-wifi"></use>
                                </svg>
                            </div>
                        )
                }

            </section>
        )
    }
    componentWillMount () {

    }
    switchInfoEditable () {
        if (!this.state.nameEditable) {
            this.setState({
                nameEditable: true,
                nameValue: this.props.user.info.name || this.props.user.id,
            });
        }
    }
    setName () {
        wsAction.setUserInfo({
            name: this.state.nameValue,
        });
        this.setState({
            nameEditable: false,
        });
    }
}