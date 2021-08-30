import React,{useState} from 'react';
import YTSLogo from "../images/logo-YTS.svg"
import PTB from "../images/logo-TPB.svg"
import YTSSearch from "../searchAPIs/yts";
import TPBSearch from '../searchAPIs/tpb';

const Search = (props) =>{

    const [providers] = useState([
      {
          logo:YTSLogo,
          name:"YTS",
          categories:["Movies"],
          component:(props)=>YTSSearch(props)
      },
      {
          logo:PTB,
          name:"PirateBay",
          categories:["Video","Audio","Applications","Games","Porn","Other"],
          component:(props)=>TPBSearch(props)
      },
    ])



    const [selectedProvider,setSelectedProvider] = useState(0)
    const [selectedCategory,setSelectedCategory] = useState(0)

    return (
    <div className="searchCol" {...props}>
        <h3>Select Search Provider</h3>
        <p>Warning: Be sure to comply with your country's copyright laws when downloading torrents from any of these search engines.</p>
        <div className={"providerRow"}>
            {providers.map((item,key) =>
                <button className={key===selectedProvider?"providerBox active":"providerBox"} key={key} onClick={()=>setSelectedProvider(key)}>
                    <img alt={"YTS Logo"} src={item.logo}/>
                </button>
            )}
        </div>
        {
            providers[selectedProvider].categories.length > 1?
                <div className={"categoriesRow"}>
                    {providers[selectedProvider].categories.map((item,key) =>
                        <button className={key===selectedCategory?"categoryBox active":"providerBox"} key={key} onClick={()=>setSelectedCategory(key)}>
                            <p>{item}</p>
                        </button>
                    )}
                </div>:null
        }
        {
            providers[selectedProvider].name==='PirateBay' && <TPBSearch category={providers[selectedProvider].categories[selectedCategory]}/>
        }
        {
            providers[selectedProvider].name==='YTS' && <YTSSearch category={providers[selectedProvider].categories[selectedCategory]}/>
        }
    </div>
    )
}

export default Search
