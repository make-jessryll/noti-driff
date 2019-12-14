import React from "react";
import NotificationItem from "../notifications/NotificationItem";

class NotificationList extends React.Component {

    render() {
        return (
            <React.Fragment>
                {
                    this.props.notifications.map((i, k) => {
                        return <NotificationItem key={k}
                            notification={i}
                        />
                    })
                }
            </React.Fragment>
        );
    }
}

export default NotificationList;