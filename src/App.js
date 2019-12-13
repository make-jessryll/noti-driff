import React, {Component} from 'react';
import Echo from "laravel-echo";
import DriffLogin from "./components/DriffLogin";
import UserLogin from "./components/UserLogin";
import NotificationPage from "./components/NotificationPage";


class App extends Component {

    constructor() {
        super();

        this.state = {
            hasSlug: false,
            hasAuth: false,
        }
    }

    handleUpdateHasSlug = () => {
        this.setState({
            hasSlug: !this.state.hasSlug
        })
    };

    handleUpdateHasAuth = () => {
        this.setState({
            hasAuth: !this.state.hasAuth
        })
    };

    componentDidMount() {

        this.setState({
            hasSlug: window.localStorage.getItem('slug')
        });

        let token_type = window.localStorage.getItem('token_type');
        let access_token = window.localStorage.getItem('access_token');
        let access_broadcast_token = window.localStorage.getItem('access_broadcast_token');

        if (access_broadcast_token) {

            this.setState({
                hasAuth: true
            });

            this.__initEcho(`${token_type} ${access_token}`, access_broadcast_token);

            let usr = window.localStorage.getItem('__usr');

            if (!usr) {

                window.localStorage.clear();

            } else {

                let slug = window.localStorage.getItem('slug');
                window.Echo.private(`${slug}.App.User.${usr}`)
                    .listen('.chat-notification', e => {
                        console.log(e);
                        const {
                            message_from,
                        } = e;
                        this.__notificationInit(slug, message_from.user_name, {
                            body: e.message
                        })
                    });

            }
        }

    }

    __initEcho = (authToken, authBroadcastToken) => {

        if (!window.io) window.io = require('socket.io-client');

        if (!window.Echo) {

            window.Echo = new Echo({
                broadcaster: "socket.io",
                host: "https://driff.online",
                auth: {
                    headers: {
                        "Authorization": authToken,
                        "Driff-Broadcast-Token": authBroadcastToken
                    }
                }
            });

        }

    };

    __stripHtml = (html) => {
        let temporalDivElement = document.createElement("div");
        temporalDivElement.innerHTML = html;

        return temporalDivElement.textContent || temporalDivElement.innerText || "";
    };

    __notificationInit = (slug, title, options) => {
        Notification.requestPermission().then(result => {
            var driffNottification = new Notification(title, {
                'body': this.__stripHtml(options.body),
                'icon' : `https://${slug}.driff.io/assets/icons/favicon.ico`
            })
        })
    };


    render() {
        return (
            <div className="container pt-4">
                {
                    !this.state.hasSlug ? <DriffLogin
                        parentHandleUpdateSlug={this.handleUpdateHasSlug}
                    /> : null
                }
                {
                    this.state.hasSlug && !this.state.hasAuth ? <UserLogin
                        __parentInitEcho={this.__initEcho}
                        parentHandleUpdateAuth={this.handleUpdateHasAuth}
                    /> : null
                }
                {
                    this.state.hasAuth ? <NotificationPage/> : null
                }
            </div>
        );
    }
}

export default App;
