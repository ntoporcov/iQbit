import React, {useEffect, useState} from "react";
import Draggable from 'react-draggable';
import useWindowSize from "../utils/useWindowSize";

const BottomSheet = (props) => {

    const WindowSize = useWindowSize();

    const topDiff = props.top || 100;
    const leftDiff = props.left || 0;
    // const open = props.open;

    const [open,setOpen] = useState(false)

    useEffect(()=>{
        if(props.open){
            setOpen(true)
        }else{
            setOpen(false)
        }
    },[props])

    const initialPosition = {x: 0, y: WindowSize.height}

    const finalPosition = {
        y: topDiff,
        x: leftDiff,
    }

    const threshold = .25;

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
                    if(event.pageY > ( WindowSize.height - (WindowSize.height * threshold))){
                        setOpen(false)
                        setTimeout(()=>{
                            props.onDismiss()
                        },400)
                    }
                }}
            />
        </div>
    )
}

export default BottomSheet
