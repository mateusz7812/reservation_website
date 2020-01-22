import React from "react";
import CookieService from "../services/CookieService";
import {withRouter} from "react-router-dom";

class LogoutPage extends React.Component {

    redirect = (path:string)=>{
        // @ts-ignore
        this.props.history.push(path);
    };

    componentDidMount(): void {
        CookieService.logOut();
        setTimeout(()=>this.redirect("/login"), 1000);
    }

    render() {
        return (
            <div>
                logging out
            </div>);
    }
}

// @ts-ignore
export default withRouter(LogoutPage);