import React from 'react';

class StreamItem extends React.Component {

    handleClick = (e) => {
        e.preventDefault();
        let slug = window.localStorage.getItem('slug');
        const {
            post
        } = this.props;
        let shell = require('electron').shell;
        let pid = post.is_personal ? `?personalized_for_id=${post.personalized_for_id}` : "";
        let url = `https://${slug}.driff.io/postdetail/${post.id}${pid}`;
        return shell.openExternal(url);
    };

    render() {
        const {
            post
        } = this.props;

        return (
            <div
                className="media border p-3"
                onClick={this.handleClick}
            >
                <img
                    src={`${post.author.profile_image_link}`}
                    alt={`${post.author.name}`}
                    className="mr-3 mt-3 rounded-circle"
                    width="30"
                    height="30"
                />
                <div className="media-body">
                    <h5>
                        {post.title}
                    </h5>
                </div>
            </div>
        );
    }
}

export default StreamItem;