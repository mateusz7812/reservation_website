import * as React from "react";
import {AdminSubpageDiv} from "./AdminPage";
import AccountModel from "../../dataModels/AccountModel";
import AccountService from "../../services/AccountService";
import {ReservableModel} from "../../dataModels/ReservableModel";
import ReservableService from "../../services/ReservableService";
import ReservableList from "../ReservableList";

class ReservableAdminPage extends React.Component {
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
                <ReservableList reservables={this.state.reservables} callWithId={this.redirect}/>
            </AdminSubpageDiv>
        );
    }
}

export default ReservableAdminPage;