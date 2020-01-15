import React, {Component} from "react";
import AddReservableForm from "./AddReservableForm";
import {ReservableModel} from "../../dataModels/ReservableModel";
import ReservableService from "../../services/ReservableService";
import ReservableList from "../ReservableList";
import {withRouter} from "react-router-dom";

class AdminAddReservableManager extends Component<{}, { reservable: undefined | ReservableModel, loadedSpaces: {[key: string]: ReservableModel}, skipReservableChoosing: boolean}> {
    setReservable = (reservable: ReservableModel) => {
        this.setState({"reservable": reservable})
    };

    constructor(props: any) {
        super(props);
        this.state = {reservable: undefined, loadedSpaces: {}, skipReservableChoosing: false};
        this.loadSpaces();
    }

    loadSpaces = () => {
        // eslint-disable-next-line no-unused-expressions
        ReservableService.getAll()
            ?.then((reservables: ReservableModel[] | undefined)=>
                reservables?.filter((reservable:ReservableModel)=> reservable.type === "Space"))
            .then((spaces)=>{
                let dict: {[key: string]: ReservableModel} = {};
                // eslint-disable-next-line no-unused-expressions
                spaces?.forEach((space)=> dict[space.id as string] = space);
                return dict;
            })
            .then((dict)=>this.setState({loadedSpaces: dict}));
    };

    choseSpace = (id: string) => {
        if (this.state.reservable !== undefined) {
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.reservable.space = id;
            this.setState({reservable: this.state.reservable});
        }
    };

    saveReservable= () => {
        if(this.state.reservable !== undefined)
            {
                // @ts-ignore
                this.props.history.push("/adding/reservable", {reservablesToAdd: [this.state.reservable], redirectPath: "/admin/reservable"});
            }
    };

    skipReservableChoosing = () =>{
        this.setState({skipReservableChoosing: true});
    };

    render() {
        return (
            <div>
                {
                    this.state?.reservable === undefined
                        ? <AddReservableForm callWithNewReservable={this.setReservable}/>
                        : this.state.reservable.space === undefined && !this.state.skipReservableChoosing
                        ?<>
                            <ReservableList reservables={this.state.loadedSpaces} callWithId={this.choseSpace}/>
                            <input type="button" id="skipButton" value="skip" onClick={this.skipReservableChoosing}/>
                        </>
                        :<input type="button" id="addButton" value="Add Reservable" onClick={this.saveReservable}/>
                }
            </div>
        );
    }
}

// @ts-ignore
export default withRouter(AdminAddReservableManager);