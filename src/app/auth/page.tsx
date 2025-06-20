"use client";
/* eslint-disable */
import React, { useEffect } from "react";

const auth: React.FC = () => {

    useEffect(() => {
        console.log(document.cookie);
    },[])

    return (
        <div>auth
        </div>
    )
}

export default auth;