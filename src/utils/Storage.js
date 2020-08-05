export const getStorage = (key="") => {
  return JSON.parse(localStorage.getItem(key));
}

export const saveStorage = async (key="",value={}) => {
  new Promise ( (resolve) => {
    localStorage.setItem(key,JSON.stringify(value));
    setInterval(()=>{
      if(localStorage.getItem(key) !== undefined){
        resolve()
      }
    },100)
  })
}
