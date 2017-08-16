import React from 'react'
const asyncComponent = loadComponent => (
    class AsyncComponent extends React.Component {
        state = {
            Component: null
        };
        mounted = false;
        componentWillMount() {
            if (this.hasLoadedComponent()) {
                return;
            }
            loadComponent()
                .then(module => module.default)
                .then((Component) => {
                    if (!this.mounted) return;
                    this.setState({ Component });
                })
                .catch((err) => {
                    console.error(`Cannot load component in <AsyncComponent />`);
                    throw err;
                });
        }
        componentDidMount () {
            this.mounted = true;
        }
        componentWillUnmount () {
            this.mounted = false;
        }
        hasLoadedComponent() {
            return this.state.Component !== null;
        }
        render() {
            const { Component } = this.state;
            return (Component) ? <Component {...this.props} /> : null;
        }
    }
);

export default asyncComponent;