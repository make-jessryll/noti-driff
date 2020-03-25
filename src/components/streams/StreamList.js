import React from "react";
import StreamItem from "./StreamItem";

class StreamList extends React.Component {
    render() {
        return (
            <React.Fragment>
                {
                    this.props.posts.map((i, k) => {
                        return <StreamItem key={k} post={i}/>
                    })
                }
            </React.Fragment>
        );
    }
}

export default StreamList;