import React, {Component} from "react";
import AddReservableForm from "./AddReservableForm";
import {ReservableModel} from "../../dataModels/ReservableModel";
import ReservableService from "../../services/ReservableService";
import ReservableList from "../ReservableList";
import {withRouter} from "react-router-dom";
import {StyledButtonInput} from "../StyledComponents";
import styled from "styled-components";
import ReservableLabel from "../itemView/ReservableLabel";

class AdminAddReservableManager extends Component<{}, { reservable: undefined | ReservableModel, loadedSpaces: {[key: string]: ReservableModel}, skipReservableChoosing: boolean}> {
    state = {reservable: undefined, loadedSpaces: {}, skipReservableChoosing: false};

    componentDidMount(): void {
        this.loadSpaces();
    }

    setReservable = (reservable: ReservableModel) => {
        this.setState({"reservable": reservable})
    };

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
            // @ts-ignore
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

        const Button = styled(StyledButtonInput)`
            margin: 10px auto;
        `;

        const StyledDiv = styled.div`
            margin: 20px 0;
            clear: both;
            width: 100%;
            text-align:center;
        `;

        let DivWrapper = styled.div`
            width: 30%;
            margin: 30px auto;
            background-color: white;
            padding: 20px 40px;
            box-shadow: 0 0 5px black;
        `;

        return (
            <div>
                {
                    this.state?.reservable === undefined
                        ? <AddReservableForm callWithNewReservable={this.setReservable}/>
                        // @ts-ignore
                        : this.state.reservable.space === undefined && !this.state.skipReservableChoosing
                        ?<DivWrapper>
                            <h3>Select Space</h3>
                            <ReservableList reservables={this.state.loadedSpaces} callWithId={this.choseSpace}/>
                            <StyledDiv>
                                <Button type="button" id="skipButton" value="Skip" onClick={this.skipReservableChoosing}/>
                            </StyledDiv>
                        </DivWrapper>
                        :
                        <DivWrapper>
                            <StyledDiv>
                                <ReservableLabel
                                    // @ts-ignore
                                    reservableModel={this.state.reservable}/>
                                <Button type="button" id="addButton" value="Add Reservable" onClick={this.saveReservable}/>
                            </StyledDiv>
                        </DivWrapper>
                }
            </div>
        );
    }
}

// @ts-ignore
export default withRouter(AdminAddReservableManager);