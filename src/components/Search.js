import React from 'react';
import {SearchInput, Icon, Fab} from "react-onsenui";

const Search = (props) =>{
  const providers = [
      {
          logo:"url",
          name:"YTS",
          categories:["Movies"]
      }
  ]

    return (
    <div className="searchCol" {...props}>
        <h3>Select Search Provider</h3>
        <div className={"searchInputRow"}>
            <SearchInput className={"searchInput"} style={{height:"100%"}} defaultValue={"Search Torrents"}/>
            <Fab modifier={"mini"}>
                <Icon icon={"ion-ios-search"} size={25} />
            </Fab>
        </div>
    </div>
  )
}

export default Search
