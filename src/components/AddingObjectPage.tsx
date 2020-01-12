import React, {Component, FunctionComponent} from "react";
import {AxiosError} from "axios";
import DataModel from "../dataModels/DataModel";
import { withRouter } from "react-router-dom";

type addObjectFunc = (_: DataModel) => Promise<DataModel | undefined>;
type renderObjectView = FunctionComponent<{object: DataModel, requiredData: {[key: string]:{}}, message: string}>;

class AddingObjectPage extends Component<{
    objectsToAdd: DataModel[], requiredObjects: {}, createAddObjectPromise: addObjectFunc , objectView: renderObjectView, redirectPath: string | undefined
}, {}> {
    state: {
        objectsToAdd: DataModel[], requiredObjects: { [key: string]: {} },
        messages: { [key: string]: string }, showExitButton: boolean
    } = {
        objectsToAdd: this.props.objectsToAdd, requiredObjects: this.props.requiredObjects,
        messages: {}, showExitButton: false
    };

    constructor(props: any) {
        super(props);
        if (props.objectsToAdd === undefined || props.requiredObjects === undefined)
            this.redirect();
    }

    componentDidMount(): void {
        this.addObjects();
    }

    redirect = () => {
        // @ts-ignore
        let path = this.props.redirectPath;
        if (path === undefined)
            path = "/";
        // @ts-ignore
        this.props.history.replace(path);
    };

    addObjects = () => {
        for (let index = 0; index < this.state.objectsToAdd?.length ?? 0; index++) {
            let objectToAdd = this.state.objectsToAdd[index];
            // eslint-disable-next-line no-unused-expressions
            this.props.createAddObjectPromise(objectToAdd)
                ?.then((addedObject: DataModel | undefined) => this.handleResponse(addedObject, index))
                ?.catch((error: AxiosError) => this.setErrorMessage(index, error));
        }
    };

    handleResponse = (object: DataModel | undefined | void, index: number) => {
        if (object !== undefined) {
            setTimeout(() => {
                // eslint-disable-next-line react/no-direct-mutation-state
                this.state.objectsToAdd[index] = object;
                this.setState({objectsToAdd: this.state.objectsToAdd});
                this.ifEndOfAddingHandleIt();
            }, 500);
        }
    };

    setErrorMessage = (objectIndex: number, error: AxiosError) => {
        setTimeout(() => {
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.messages[objectIndex] = error.response?.data?.message;
            this.setState({messages: this.state.messages});
            this.ifEndOfAddingHandleIt();
        }, 500);
    };

    ifEndOfAddingHandleIt = () => {
        const objectsAdded = this.state.objectsToAdd.filter((object: DataModel) => object.added());
        const objectsToAddLength = this.state.objectsToAdd.length;
        const addedObjectsLength = objectsAdded.length;

        if (addedObjectsLength === objectsToAddLength) {
            setTimeout(() => {
                this.redirect();
            }, 500);
        } else {
            const errorMessagesLength = Object.keys(this.state.messages).length;
            if ((addedObjectsLength + errorMessagesLength) === objectsToAddLength) {
                this.setState({showExitButton: true});
            }
        }
    };

    render() {
        return (
            <div>
                {
                    this.state.objectsToAdd?.map((object, index) =>
                        <this.props.objectView
                            key={object.id + "_div"}
                            object={object}
                            requiredData={this.props.requiredObjects}
                            message={this.state.messages[index]} />)
                }
                {
                    this.state.showExitButton ?
                        <input id="backButton" type="button" value={"Back"} onClick={this.redirect}/> : null
                }
            </div>
        );
    }
}

// @ts-ignore
export default withRouter(AddingObjectPage);