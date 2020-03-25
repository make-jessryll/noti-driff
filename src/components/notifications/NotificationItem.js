import React from "react";

class NotificationItem extends React.Component {

    __setTitleNotification = () => {
        const {
            notification,
            notification: {
                message_from
            }
        } = this.props;
        
        switch(notification.entity_type) {
            
            case "NEW_POST": 
                return `${message_from.name} posted a new post ${notification.message}`;
            case "REACT_POST":
                return `${message_from.name} react on the post ${notification.message}`;
            case "REACT_POST_COMMENT":
                return `${message_from.name} react on the reply ${notification.message}`;
            default: 
                return this.__stripHtml(notification.message);
        }
    };

    __stripHtml = (html) => {
        let temporalDivElement = document.createElement("div");
        temporalDivElement.innerHTML = html;

        return temporalDivElement.textContent || temporalDivElement.innerText || "";
    };

    handleClick = (e) => {
      e.preventDefault();

    };

    render() {
        const {
            notification
        } = this.props;
        return (
            
           <div className="media border p-3">
                <img 
                    src={`${notification.message_from.profile_image_link}`} 
                    alt={notification.message_from.name} 
                    className="mr-3 mt-3 rounded-circle"
                    width="30"
                    height="30"
                />
                    <div className="media-body">
                        <h5> 
                            <small>
                                <i>{this.__setTitleNotification()}</i>
                            </small>
                        </h5>
                    </div>
            </div>
        )
    }
}

export default NotificationItem;