import React, {useContext, useEffect, useState} from "react";
import {IonLabel, IonSegment, IonSegmentButton} from "@ionic/react";
import Torrents from "../components/Torrents";
import {Context} from "../App";

const TorrentsCol = (props) => {
    const {settings} = useContext(Context)

    const [segment,setSegment] = useState("all");

    const SegmentPicker = () => {

        if(settings.loggedin){
            return(
                <div className={"segmentPicker"}>
                    <IonSegment mode={"ios"} value={segment} onIonChange={e => {
                        setTimeout(()=>{
                            setSegment(e.detail.value)
                        },200)
                    }}>
                        <IonSegmentButton mode={"ios"} value="all">
                            <IonLabel>All Torrents</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton mode={"ios"} value="complete">
                            <IonLabel>Complete</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton mode={"ios"} value="downloading">
                            <IonLabel>Downloading</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>
                </div>
            )
        }else{
            return null
        }
    }

    return(
        <div  className={"torrentsCol"}>
            <SegmentPicker/>
            <Torrents sortingObj={props.sortingObj} segment={segment}/>
        </div>
    )
}

export default TorrentsCol
