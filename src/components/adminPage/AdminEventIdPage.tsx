import React, {Component} from "react";
import EventLabel from "../itemView/EventLabel";
import EventModel from "../../dataModels/EventModel";
import {AdminSubpageDiv} from "./AdminPage";
import EventService from "../../services/EventService";

class AdminEventIdPage extends Component<{}, {event: EventModel|undefined}> {
    state={event: undefined};
    eventId: string|undefined = undefined;

    constructor(props: any) {
        super(props);
        this.eventId = props.match.params.id;
    }

    componentDidMount() {
        this.loadEvent();
    }

    loadEvent() {
        if (this.eventId != null) {
            // eslint-disable-next-line no-unused-expressions
            EventService.getById(this.eventId)
                ?.then((event) => {
                    if (event !== undefined) {
                        this.setState({event: event});
                    }
                })
        }
    }

    render() {
        return (
            <AdminSubpageDiv>
                {
                    this.state.event === undefined
                        ? null
                        : <>
                            <EventLabel
                                // @ts-ignore
                                event={this.state.event}/>
                        </>
                }
            </AdminSubpageDiv>
        );
    }
}

export default AdminEventIdPage;