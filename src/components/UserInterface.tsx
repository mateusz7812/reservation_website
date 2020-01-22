import React, {FunctionComponent} from "react";
import styled from "styled-components";
import {StyledButtonInput} from "./StyledComponents";
import {withRouter} from "react-router-dom";
import CookieService from "../services/CookieService";

// @ts-ignore
const UserInterface: FunctionComponent = ({children, history}) => {
    const redirect = (path:string)=>{
        // @ts-ignore
        history.push(path);
    };

    let DisplayDiv = styled.div`
        width: 80%;
        min-height: 600px;
        margin: 20px auto;
        position: relative;
    `;

    let MenuDiv = styled.div`
        width: 20%;
        text-align:center;
        position: absolute;
        top: 50%;
        transform: translate(0, -50%);
        border-right: 5px solid white;
        box-shadow: 3px 0 4px -5px black, -3px 0 4px -5px black inset;
    `;

    let PageDiv = styled.div`
        width: 76%;
        float: right;
    `;

    const Button = styled(StyledButtonInput)`
        width: 70%;
        height: 40px;
        margin: 10px auto;
    `;

    const ClearDiv = styled.div`
        clear: both;
    `;

    return (
        <DisplayDiv>
            <MenuDiv>
                {
                    CookieService.getAccount()?.isAdmin()
                        ? <Button type={"button"} value={"Admin Page"} onClick={()=>redirect("/admin")}/>
                        : null
                }
                <Button type={"button"} value={"My reservations"} onClick={()=>redirect("/my_reservations")}/>
                <Button type={"button"} value={"Home"} onClick={()=>redirect("/")}/>
                <Button type={"button"} value={"Log out"} onClick={()=>redirect("/logout")}/>
            </MenuDiv>
            <PageDiv>
                {children}
            </PageDiv>
            <ClearDiv/>
        </DisplayDiv>
    );
 };

 export default withRouter(UserInterface);