import axios from 'axios';

let serverAddress =
    process.env.NODE_ENV === "development" ?
    process.env.REACT_APP_DEV_SERVER : window.location.href;

if(serverAddress.substring(serverAddress.length-1) !== "/"){
  serverAddress = `${serverAddress}/`
}

console.log(serverAddress)

const baseURL = `${serverAddress}api/v2/`

const APICall = axios.create({
  baseURL:baseURL,
})

export const login = async ({username, password}) => {
  return APICall.get('auth/login',{
    params:{username,password}
  })
}

export const logout = () => {
  return axios.get('auth/logout')
}

export const getTorrents = async () => {
  return APICall.get('torrents/info',{
    params:{
      sort:"added_on",
      reverse:true,
    }
  })
}

export const getProperties = async (hash) => {
  return APICall.get('torrents/properties',{
    params:{
      hashes:hash
    }
  })
}

export const sync = async (rid) => {
  return APICall.get('sync/maindata')
}

export const resume = async (hash="") => {
  return APICall.get('torrents/resume',{
    params:{
      hashes:hash
    }
  })
}

export const pause = async (hash="") => {
  return APICall.get('torrents/pause',{
    params:{
      hashes:hash
    }
  })
}

export const remove = async (hash="",deleteFiles=false) => {
  return APICall.get('torrents/delete',{
    params:{
      hashes:hash,
      deleteFiles
    }
  })
}

export const addTorrent = async (url="") => {
  return APICall.get('torrents/add',{
    params:{
      urls:url,
    }
  })
}

export const getPrefs = async () => {
  return APICall.get('app/preferences')
}

export const updatePref = async (json={}) =>{
  return APICall.get('app/setPreferences',{
    params:{
      json
    },
  })
}
