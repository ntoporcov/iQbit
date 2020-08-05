import React, {useEffect, useState} from "react";
import Draggable from 'react-draggable';


const BottomSheet = (props) => {

    const topDiff = props.top || 100;
    const leftDiff = props.left || 0;
    const open = props.open;

    const screenHeight = window.innerHeight;

    const initialPosition = {x: 0, y: screenHeight}

    const finalPosition = {
        y: topDiff,
        x: leftDiff,
    }

    const threshold = .15;

    return (
        <div className={open?"BottomSheet open":"BottomSheet"}>
            <Draggable
                axis={"y"}
                handle={".handleArea"}
                defaultPosition={initialPosition}
                position={open?finalPosition:initialPosition}
                children={
                    <div className={"modal"}>
                        <span className={"handleArea"}><span className={"handle"}/></span>
                        {props.children}
                    </div>
                }
                bounds={{top:topDiff}}
                onStop={(event)=>{
                    if(event.screenY > ( screenHeight - (screenHeight * threshold))){
                        props.onDismiss()
                    }
                }}
            />
        </div>
    )
}

export default BottomSheet
