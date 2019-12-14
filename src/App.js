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
                    .notification(notification => {

                        if (notification.data.notification_type === "POST" || notification.data.notification_type === "MULTI_POST") {
                            const {
                                author,
                                data
                            } = notification;

                            let pid = notification.data.personalized_for_id ? `?personalized_for_id=${data.personalized_for_id}` : '';

                            this.__notificationInit(slug, author.name, {
                                body: `has posted ${data.title}`,
                                icon: author.profile_image_link,
                                redirect: `https://${slug}.driff.io/postdetail/${notification.post_id}${pid}`
                            })

                        }

                    })
                    .listen('.chat-notification', e => {

                        const {
                            message_from,
                        } = e;

                        this.__notificationInit(slug, message_from.user_name, {
                            body: e.message,
                            icon: message_from.profile_image_link,
                            redirect: `https://${slug}.driff.io/chat`
                        });
                    })
                    .listen('.new-task-created', e => {

                        const {
                            message_from,
                            data
                        } = e;

                        this.__notificationInit(slug, message_from.name, {
                            body: data.title,
                            icon: message_from.profile_image_link,
                            redirect: `https://${slug}.driff.io/task/${data.abbreviation}-${data.generated_id}`
                        });

                    })
                    .listen('.comment-created', e => {

                        const {
                            message_from,
                        } = e;

                        this.__notificationInit(slug, message_from.name, {
                            body: `${message_from.name} has replied to ${e.abbreviation}-${e.generated_id}`,
                            icon: message_from.profile_image_link,
                            redirect: `https://${slug}.driff.io/task/${e.abbreviation}-${e.generated_id}`
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

        let shell = require('electron').shell;

        Notification.requestPermission().then(result => {

            let myNotification = new Notification(title, {
                'body': this.__stripHtml(options.body),
                'icon' : options.icon ? options.icon : `https://${slug}.driff.io/assets/icons/favicon.ico`
            });

            if (options.redirect) {

                myNotification.onclick = (event) => {

                    event.preventDefault();
                    shell.openExternal(options.redirect);

                }

            }
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
                    this.state.hasAuth ? <NotificationPage
                        parentNotificationList={this.state.notificationList}
                    /> : null
                }
            </div>
        );
    }
}

export default App;
