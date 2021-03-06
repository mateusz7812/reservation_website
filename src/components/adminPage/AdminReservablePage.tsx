import * as React from "react";
import {AdminSubpageDiv} from "./AdminPage";
import {ReservableModel} from "../../dataModels/ReservableModel";
import ReservableService from "../../services/ReservableService";
import ReservableList from "../ReservableList";
import {Route, Switch, withRouter} from "react-router-dom";
import AdminAddReservableManager from "./AdminAddReservableManager";
import AdminReservableIdView from "./AdminReservableIdView";
import {StyledButtonInput} from "../StyledComponents";

class AdminReservablePage extends React.Component {
    state: {reservables:{[key: string]: ReservableModel}} = {reservables: {}};

    componentDidMount(): void {
        this.loadReservables();
    }

    loadReservables = ()=>{
        // eslint-disable-next-line no-unused-expressions
        ReservableService.getAll()
            ?.then((reservables: ReservableModel[] | undefined)=>
                reservables?.map((reservable: ReservableModel)=>{
                        // eslint-disable-next-line react/no-direct-mutation-state
                        this.state.reservables[reservable.id as string] = reservable;
                        this.setState({reservables: this.state.reservables});
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
                    this.props.location.pathname.includes("/admin/reservable/add")
                        ? null
                        : <StyledButtonInput id="addButton" type="button" value="Add Reservable" onClick={() => this.redirect("/admin/reservable/add")}/>
                }
                <Switch>
                    <Route path={"/admin/reservable/add"} component={AdminAddReservableManager}/>
                    <Route path={"/admin/reservable/:id([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})"} component={(props: any)=> <AdminReservableIdView {...props} reservable={this.state.reservables[props.match.params.id]} />}/>
                    <Route path={"/admin/reservable/"} component={(props: any)=><ReservableList {...props} reservables={this.state.reservables} callWithId={(id: string)=> this.redirect("/admin/reservable/"+id)}/>}/>
                </Switch>
            </AdminSubpageDiv>
        );
    }
}

// @ts-ignore
export default withRouter(AdminReservablePage);