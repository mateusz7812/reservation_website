import * as React from "react";
import {AdminSubpageDiv} from "./AdminPage";
import EventList from "../EventList";
import EventService from "../../services/EventService";
import EventModel from "../../dataModels/EventModel";
import {Route, Switch, withRouter} from "react-router-dom";
import AdminAddEventManager from "./AdminAddEventManager";
import EventLabel from "../itemView/EventLabel";
import {StyledButtonInput} from "../StyledComponents";

class AdminEventPage extends React.Component {
    state: {events:{[key: string]: EventModel}} = {events:{}};

    componentDidMount(): void {
       this.loadEvents();
    }

    loadEvents = ()=>{
        // eslint-disable-next-line no-unused-expressions
        EventService.getAll()
            ?.then((events: EventModel[] | undefined)=>
                events?.map((event: EventModel)=>{
                    // eslint-disable-next-line react/no-direct-mutation-state
                        this.state.events[event.id as string] = event;
                        this.setState({events: this.state.events});
                    }
                )
            )
    };

    redirect = (path: string) => {
        // @ts-ignore
        this.props.history.push(path);
    };

    render() {
        return (
            <AdminSubpageDiv>
                {
                    // @ts-ignore
                    this.props.location.pathname.includes("/admin/event/add")
                        ? null
                        : <StyledButtonInput id="addButton" type="button" value="Add Event" onClick={() => this.redirect("/admin/event/add")}/>
                }
                <Switch>
                    <Route path={"/admin/event/add"} component={AdminAddEventManager}/>
                    <Route path={"/admin/event/:id([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})"} component={(props: any)=>
                        <EventLabel
                            {...props}
                            event={this.state.events[props.match.params.id]}/>
                    }/>
                    <Route path={"/admin/event/"} component={(props: any)=><EventList {...props} events={this.state.events} callWithId={(id: string)=>this.redirect("/admin/event/"+id)}/>}/>

                </Switch>
            </AdminSubpageDiv>
        );
    }
}

// @ts-ignore
export default withRouter(AdminEventPage);