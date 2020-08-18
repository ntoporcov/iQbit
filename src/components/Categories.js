import React, {useContext, useEffect, useState} from "react";
import {getCategories} from "../utils/TorrClient";
import {Context} from "../App";



const Categories = (props) => {

    const {contextCategories} = useContext(Context)

    const [categories,setCategories] = useState(contextCategories)
    const [categoryRefresh,setCategoryRefresh] = useState(contextCategories)

    useEffect(()=>{
        if(categoryRefresh){
            getCategories().then(response=>{
                setCategories(response.data)
                setCategoryRefresh(false)
            })
        }

        if(contextCategories !== categories){
            setCategories(contextCategories)
        }

    },[contextCategories, categories, categoryRefresh])

    return(
        <>
            {
                Object.keys(categories).map((item,key) =>
                    <p key={key}>
                        {categories[item].name}
                    </p>
                )
            }
        </>
    )
}

export default Categories;
