import React from "react";
import axios from "axios";
import NotificationMain from "./notifications/NotificationMain";
import StreamMain from "./streams/StreamMain";

class NotificationPage extends React.Component {

    constructor() {
        super();
        this.state = {
            type: "",
            streamCount: 0,
            chatCount: 0,
            taskCount: 0
        }
    }

    componentDidMount() {

        var notiCounter = 0;
        let p_type  = window.localStorage.getItem('__p_type');

        if (p_type) {

            this.setState({
                type: p_type
            });

        }
        this.requestStreamCount().then(res => {

            if (res.status) {

                this.setState({
                    streamCount: res.data.entries,
                })

                notiCounter = res.data.entries;


            } else {

                console.log(res.data);

            }

        });
        this.requestChatCount().then(res => {
            if (res.status) {

                var i;
                let taskCount = 0;

                for (i = 0; i < res.data.length; i++) {

                    if (res.data[i].entity_type === 'NEW_TASK' || res.data[i].entity_type === 'TASK_MOVE'
                        || res.data[i] === 'TASK_COMMENT_GROUP_TASK_ID') {

                        taskCount = taskCount + res.data[i].count;

                    }

                }

                let chatCount = res.data.filter(e => e.entity_type === 'CHAT_MESSAGE')[0].count;

                this.setState({
                    chatCount: chatCount,
                    taskCount: taskCount,
                })

                notiCounter = notiCounter + chatCount;
                notiCounter = notiCounter + taskCount;
                window.Electron.ipcRenderer.send('update-notification-counter', notiCounter);
            } else {

                console.log(res.data);

            }
        })


    }

    handleChangeDriff = () => {
        window.localStorage.clear();
        window.location.reload();
    };

    requestStreamCount = async () => {

        let slug = window.localStorage.getItem('slug');
        let access_token = window.localStorage.getItem('access_token');
        let token_type = window.localStorage.getItem('token_type');

        return axios({
            method: 'GET',
            url: `https://${slug}.driff.online/api/v1/total-unread-entries/posts`,
            headers: {
                'Content-Type': "application/json",
                'Authorization': `${token_type} ${access_token}`
            }
        })
            .then((res) => {
                return {
                    status: true,
                    data: res.data,
                }
            })
            .catch((err) => {
                return {
                    status: false,
                    data: err
                }
            });
    };

    requestChatCount = async () => {
        let slug = window.localStorage.getItem('slug');
        let access_token = window.localStorage.getItem('access_token');
        let token_type = window.localStorage.getItem('token_type');
        return axios({
            method: 'GET',
            url: `https://${slug}.driff.online/api/v2/notification-counter-entries`,
            headers: {
                'Content-Type': "application/json",
                'Authorization': `${token_type} ${access_token}`
            }
        })
            .then((res) => {
                return {
                    status: true,
                    data: res.data,
                }
            })
            .catch((err) => {
                return {
                    status: false,
                    data: err
                }
            });
    };

    render() {
        return (
            <div>
                <h1>
                    {
                        this.state.type !== '' ? <button
                        className={'btn btn-sm btn-dark float-left'}
                        onClick={() => {
                            window.localStorage.setItem('__p_type', "");
                            this.setState({
                                type: ""
                            })
                        }}
                    >
                        BACK
                    </button> : null
                    }
                
                    <button
                        className={'btn btn-sm btn-dark float-right'}
                        onClick={this.handleChangeDriff}
                    >
                        CHANGE DRIFF
                    </button>

                </h1>
                <br/>
                <div className={"mt-5"}/>
                {
                    this.state.type === "" ? <div className="list-group">
                        <a
                            href="/#"
                            className="list-group-item list-group-item-action"
                            onClick={()=>{
                                window.localStorage.setItem('__p_type', 'stream');
                                this.setState({
                                    state: 'stream'
                                });
                                window.location.reload();
                            }}
                        >
                            Stream
                            {
                                this.state.streamCount !== 0 ? <span className="badge badge-primary badge-pill ml-2">{this.state.streamCount}</span> : null
                            }

                        </a>
                        <a
                            href="/#"
                            className="list-group-item list-group-item-action"
                        >
                            Chat
                            {
                                this.state.chatCount !== 0 ? <span className="badge badge-primary badge-pill ml-2">{this.state.chatCount}</span> : null
                            }
                        </a>
                        <a
                            href="/#"
                            className="list-group-item list-group-item-action"
                        >
                            Task
                            {
                                this.state.taskCount !== 0 ? <span className="badge badge-primary badge-pill ml-2">{this.state.taskCount}</span> : null
                            }
                        </a>
                        <a
                            href="/#"
                            className="list-group-item list-group-item-action"
                            onClick={() => {
                                window.localStorage.setItem('__p_type', 'notification');
                                this.setState({
                                    type: 'notification'
                                })
                            }}
                        >
                            Notification
                        </a>
                    </div> : null
                }

                {
                    this.state.type === 'notification' ? <NotificationMain/> : null
                }

                {
                    this.state.type === 'stream' ? <StreamMain/> : null
                }
            </div>
        );
    }

}

export default NotificationPage;