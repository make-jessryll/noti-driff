import React from 'react';
import axios from 'axios';
import StreamList from "./StreamList";

class StreamMain extends React.Component {

    constructor() {
        super();
        this.state = {
            skip: 0,
            limit: 10,
            total_take: 0,
            posts: []
        }
    }

    componentDidMount() {

        const {
            skip,
            posts
        } = this.state;

        if (posts.length === 0) {

            this.requestUnreadPosts().then(res => {

                if (res.status) {

                    this.setState({
                        skip: skip + res.data.total_take,
                        posts: res.data.posts
                    })

                } else {

                    console.log(res.data);

                }

            });

        }

    }

    requestUnreadPosts = async () => {
        let slug = window.localStorage.getItem('slug');
        let access_token = window.localStorage.getItem('access_token');
        let token_type = window.localStorage.getItem('token_type');

        return await axios({
            method: "GET",
            url: `https://${slug}.driff.online/api/v1/posts?filter[0]=all&filter[1]=post_unread`,
            headers: {
                'Content-Type': "application/json",
                'Authorization': `${token_type} ${access_token}`
            }
        })
            .then(res => {
                return {
                    status: true,
                    data: res.data,
                }
            })
            .catch(err => {
                return {
                    status: false,
                    data: err
                }
            })
    };

    render() {

        return (
            <React.Fragment>
                <h1>Unread Streams</h1>
                <StreamList
                    posts={this.state.posts}
                />
            </React.Fragment>
        );

    }

}

export default StreamMain;