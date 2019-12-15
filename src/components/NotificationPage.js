import React from "react";
import axios from "axios";
import NotificationList from "./notifications/NotificationList";

class NotificationPage extends React.Component {

    constructor() {
        super();
        this.state = {
            skip: 0,
            limit: 20,
            notifications: []
        }
    }

    componentDidMount() {
        if (this.state.notifications.length === 0) {

            this.requestGetNotifications().then(res => {
                if (res.status === true) {
                    return this.setState({
                        notifications: res.data.notifications
                    })
                }
            })

        }
    }

    requestGetNotifications = async () => {

        let slug = window.localStorage.getItem('slug');
        let access_token = window.localStorage.getItem('access_token');
        let token_type = window.localStorage.getItem('token_type');

        const {
            skip,
            limit
        } = this.state;

        return await axios({
            method: "GET",
            url: `https://${slug}.driff.online/api/v2/notification-counter?skip=${skip}&limit=${limit}`,
            headers: {
                'Content-Type': "application/json",
                'Authorization': `${token_type} ${access_token}`
            }
        })
            .then(res => {
                return {
                    status: true,
                    data: res.data
                }
            })
            .catch(err => {
                return {
                    status: false,
                    data: err
                }
            })
    };

    handleChangeDriff = () => {
      window.localStorage.clear();
      window.location.reload();
    };

    render() {
        return (
            <div>
                <h1>
                    Notification
                    <button
                        className={'btn btn-sm float-right btn-primary'}
                        onClick={this.handleChangeDriff}
                    >
                        Change Driff
                    </button>
                </h1>
                <NotificationList
                    notifications={this.state.notifications}
                />
            </div>
        );
    }

}

export default NotificationPage;