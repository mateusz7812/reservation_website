import React, {Component} from "react";

class EventPage extends Component{
    state = {event: undefined, reservable: [], selections: []};
    event_id = "";

    componentDidMount() {
        this.event_id = this.props.match.params.id;
    }

    render(){
        return(
            <div>
            </div>
        );
    }

}

export default EventPage;