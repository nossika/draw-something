import React from 'react';
export default class Error extends React.Component {
    static defaultProps = {
        type: '',
    };
    render () {
        switch (this.props.type) {
            case 'logout':
                return (
                    <section>
                        你已在其他地方登陆，此页面已失效...
                    </section>
                );
            default:
                return (
                    <section>
                        出错了...
                    </section>
                );
        }

    }
}