import { useEffect, useState } from 'react'
import './App.css'
import {motion} from 'framer-motion'
import axios from 'axios'
import $ from 'jquery'
import { initializeApp } from 'firebase/app'
import {} from 'firebase/app-check'
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore'
import { deleteUser, EmailAuthProvider, getAuth, GithubAuthProvider, GoogleAuthProvider, linkWithPopup, onAuthStateChanged, reauthenticateWithPopup, signInAnonymously, signOut } from 'firebase/auth'

if (window.hasFetchedKeys === undefined) {
  window.hasFetchedKeys = false;
}

const firebaseConfig = {
  apiKey: "AIzaSyBtv6lezuraEoxN3fBNuhIg9uhL8EW8B-k",
  authDomain: "budify-430f1.firebaseapp.com",
  projectId: "budify-430f1",
  storageBucket: "budify-430f1.firebasestorage.app",
  messagingSenderId: "325648244592",
  appId: "1:325648244592:web:89a5b10c15e17532a3f9b5",
  measurementId: "G-9JSQSGGMZZ"
};

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)

const new_user = new Promise((resolve) => {
  onAuthStateChanged(auth, (user) => {
    if(user == null){
      signInAnonymously(auth).then((value) => resolve(value.user.uid))
    }else{
      resolve(user.uid)
    }
  })
})

await new_user

const db = getFirestore(app)

const github = new GithubAuthProvider()

const google = new GoogleAuthProvider()

export default function App(){
  const [hover, setHover] = useState(false)
  const [active, setActive] = useState(false)

  const Get_Test_Budify = async () => {
    $("#load_data").empty()
    const item = document.getElementById("item")
    const city = document.getElementById("city")
    const people = document.getElementById("people")

    const json_data = document.createElement("pre")
    json_data.textContent = "Loading..."
    json_data.className = "relative w-[90%] h-full m-auto p-0 bg-transparent text-xl text-white font-light overflow-x-auto overflow-y-auto"
    document.getElementById("load_data").appendChild(json_data)

    const budget_link = "https://get-budify-prices-2223hqzj3q-uc.a.run.app/?q=" + item.value + "&city=" + city.value + "&housemates=" + people.value
    const webby = (await axios.get(budget_link))["data"]

    json_data.textContent = JSON.stringify(webby, null, 2)

    $("#download_container").empty()

    const download_button = document.createElement("button")
    download_button.className="relative border-white border border-dashed w-[12em] h-[75%] m-auto ml-0 mr-0 p-0 cursor-pointer rounded-full bg-black scale-[1] hover:scale-[1.1] active:scale-[0.9] duration-300 transition-all bg-black flex flex-col align-middle justify-center text-center text-white text-xl "
    download_button.innerText = "Download As JSON"
    download_button.onclick = (e) => {
      e.preventDefault()

      const data_link = document.createElement("a")
      data_link.href = URL.createObjectURL(new Blob([JSON.stringify(webby, null, 2)]))
      data_link.download = "prices.json"
      data_link.click()
    }
    document.getElementById("download_container").appendChild(download_button)

  }

  const Get_navbar_options = (name) => {
    const arr = ["api_playground", "api_billing", "api_keys", "api_docs"]

    for(let i = 0; i != arr.length; i++){
      if(arr[i] == name){
        document.getElementById(arr[i]).style.display = "flex"
        continue
      }
      document.getElementById(arr[i]).style.display = "none"
    }

  }

  useEffect(() => {
    const get_user_keys = async () => {
      if (window.hasFetchedKeys) return; 
      window.hasFetchedKeys = true;
    
      try{
        const key_container = document.getElementById("keyContainer")

        if(!key_container){
          console.log("container not found")
          return
        }
        
        const get_customer = (await getDoc(doc(db, "customers/" + auth.currentUser.uid))).get("data")
        
        const get_keys = (await getDoc(doc(db, "auth/auth_keys"))).get("keys")
        
        for(let i = 0; i != get_keys.length; i++){
          if(get_keys[i]["customer_id"] == get_customer["client"]){
            const element_text = document.createElement("p")
            element_text.innerText = get_keys[i]["apikey"]
            element_text.className = "relative w-full h-fit m-auto mt-0 mb-0 p-0 bg-transparent text-xl text-white flex flex-row align-middle justify-start text-start "
 
            key_container.appendChild(element_text)
          }
        }
      } catch (err) {
        window.hasFetchedKeys = false;
      }
    }
  
    if (document.readyState !== "loading") {
      get_user_keys();
    } else {
      document.addEventListener("DOMContentLoaded", get_user_keys);
    }
    window.addEventListener("resize", (ev) => {
      if(window.innerWidth >= 1024){
        (() => {setActive(false)})()
      }
    })

    const github_login = document.getElementsByClassName("github_login")
    const google_login = document.getElementsByClassName("google_login")
    const logoff = document.getElementsByClassName("logoff")
    const subscribe = document.getElementsByClassName("subscribe")

    const login_subscription = document.getElementById("login_subscription")
    const subscription = document.getElementById("subscription")
    const budify_billing = document.getElementById("budify_billing")

    onAuthStateChanged(auth, async (user) => {
      if(user.isAnonymous === false){
        google_login[0].style.display = "none"
        github_login[0].style.display = "none"
        logoff[0].style.display = "flex"
        subscribe[0].style.display = "flex"

        google_login[1].style.display = "none"
        github_login[1].style.display = "none"
        logoff[1].style.display = "flex"
        subscribe[1].style.display = "flex"
        
        login_subscription.style.display = "none"
        subscription.style.display = "flex"

        const customer = (await getDoc(doc(db, "customers/" + auth.currentUser.uid))).get("data")

        if(customer["active"] === false){
          budify_billing.style.display = "none"
          subscription.style.display = "flex"
        }else{
          budify_billing.style.display = "flex"
          subscription.style.display = "none"

          const customer_data = document.getElementsByClassName("customer_data")

          const client_info = (await axios.get("https://check-customer-data-2223hqzj3q-uc.a.run.app?user=" + auth.currentUser.uid))["data"]
          
          const total_usage = document.getElementsByClassName("total_usage")
          total_usage[0].textContent = "Total Weekly Usage: $" + ((client_info["usage"]["data"][0]["aggregated_value"] * 0.10).toFixed(2)).toString()

          customer_data[0].value = client_info["customer"]["name"]
          customer_data[1].value = client_info["customer"]["email"]
          customer_data[2].value = client_info["customer"]["phone"]
          customer_data[3].value = client_info["customer"]["address"]["city"]
          customer_data[4].value = client_info["customer"]["address"]["postal_code"]
          customer_data[5].value = client_info["customer"]["address"]["country"]
          customer_data[6].value = client_info["customer"]["address"]["line1"]
        }
      }else{
        google_login[0].style.display = "flex"
        github_login[0].style.display = "flex"
        logoff[0].style.display = "none"
        subscribe[0].style.display = "none"

        google_login[1].style.display = "flex"
        github_login[1].style.display = "flex"
        logoff[1].style.display = "none"
        subscribe[1].style.display = "none"

        login_subscription.style.display = "flex"
        subscription.style.display = "none"
        budify_billing.style.display = "none"
      }
    })
  })

  const update_client = async () => {
    const customer_data = document.getElementsByClassName("customer_data")

    const name = customer_data[0].value
    const email = customer_data[1].value
    const phone = customer_data[2].value
    const city = customer_data[3].value
    const postal_code = customer_data[4].value
    const country = customer_data[5].value
    const address = customer_data[6].value


    const update_link = (await axios.post("http://localhost:5001/budify-430f1/us-central1/update_customer", {"email": email, "name": name, "phone": phone, "city": city, "postal_code": postal_code, "country": country, "address": address}, {headers: {Authorization: auth.currentUser.uid}}))["data"]

    console.log(update_link)
    alert(name + " details updated")
  }

  const Add_User_Key = async () => {
    const key_container = document.getElementById("keyContainer")

    const get_customer = (await getDoc(doc(db, "customers/" + auth.currentUser.uid))).get("data")
    const get_keys = (await getDoc(doc(db, "auth/auth_keys"))).get("keys")

    const apikey_link = (await axios.get("https://add-keys-2223hqzj3q-uc.a.run.app?user=" + auth.currentUser.uid))["data"]

    get_keys.push({"apikey": apikey_link, "customer_id": get_customer["client"]})
    setDoc(doc(db, "auth/auth_keys"), {"keys": get_keys})

    const element_text = document.createElement("p")
    element_text.innerText = apikey_link
    element_text.className = "relative w-full h-fit m-auto mt-0 mb-0 p-0 bg-transparent text-xl text-white flex flex-row align-middle justify-start text-start "
    
    key_container.appendChild(element_text)
  }

  const reauthUser = (userProvider) => {
    if(userProvider == "github.com"){
      reauthenticateWithPopup(auth.currentUser, github).then((value) => {alert(auth.currentUser.email + " had to reauth, try to delete it again"); window.location.reload()})
    }else{
      reauthenticateWithPopup(auth.currentUser, google).then((value) => {alert(auth.currentUser.email + " had to reauth, try to delete it again"); window.location.reload()})
    }
  }
  return(
    <div className="relative w-full h-fit m-auto p-0 bg-transparent flex flex-col lg:flex-row align-middle justify-center gap-3 ">
      <motion.nav initial={{height: 13 + "vh"}} className="fixed top-0 left-0 w-full z-200 m-auto mt-0 mb-0 p-0 bg-transparent flex flex-col align-middle ">
        <div className="relative w-full min-h-full h-full m-auto mt-0 mb-0 p-0 bg-transparent flex flex-row align-middle justify-center text-center ">
          <ul className="relative w-[40%] z-200 h-full m-auto p-0 bg-transparent flex flex-row align-middle justify-start text-start ">
            <h1 className="text-2xl text-white font-medium z-200 ml-[5%] mr-0 flex flex-col align-middle justify-center text-center  ">
              Budify API
            </h1>
          </ul>
          <ul className="relative w-[60%] h-full m-auto p-0 bg-transparent flex flex-row align-middle justify-end text-end gap-3 ">
            <div onClick={active? () => setActive(false) : () => setActive(true)} onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)} className="relative z-101 w-[3.5em] h-[50%] cursor-pointer m-auto ml-0 mr-[5%] p-0 bg-transparent flex lg:hidden flex-col align-middle justify-center text-center ">
              <motion.div initial={{width: 50 + "%"}} animate={{width: hover? 50 + "%" : 100 + "%"}} className="relative w-[50%] h-[0.3em] ml-auto mr-0 m-auto p-0 bg-white rounded-md flex flex-col align-middle justify-center text-center "></motion.div>
              <motion.div initial={{width: 75 + "%"}} animate={{width: hover? 75 + "%" : 75 + "%"}} className="relative w-[75%] h-[0.3em] ml-auto mr-0 m-auto p-0 bg-white rounded-md flex flex-col align-middle justify-center text-center "></motion.div>
              <motion.div initial={{width: 100 + "%"}} animate={{width: hover? 100 + "%" : 50 + "%"}} className="relative w-full h-[0.3em] ml-auto mr-0 m-auto p-0 bg-white rounded-md flex flex-col align-middle justify-center text-center "></motion.div>
            </div>
          </ul> 
        </div>
      </motion.nav>
      <motion.ul initial={{display: "none"}} animate={{display: active? "flex" : "none"}} className="bar fixed top-0 left-0 w-[40vh] h-screen z-105 m-auto mt-0 mb-0 p-0 bg-transparent lg:hidden flex-col align-middle gap-2 ">
        <div className="nav_items relative w-[90%] min-h-[9vh] h-[9vh] m-auto mt-[45%] mb-0 p-0 rounded-full shadow-black shadow-xs flex flex-col align-middle justify-center text-xl text-center cursor-pointer">
          <li className="text-white text-xl relative w-full h-full m-auto p-0 bg-transparent flex flex-col align-middle justify-center" onClick={(e) => {e.preventDefault(); Get_navbar_options("api_playground")}} ><a href="#api_playground">API Playground</a></li>
        </div>
        <div className="nav_items relative w-[90%] min-h-[9vh] h-[9vh] m-auto mt-0 mb-0 p-0 rounded-full shadow-black shadow-xs flex flex-col align-middle justify-center text-xl text-center cursor-pointer">
          <li className="text-white text-xl relative w-full h-full m-auto p-0 bg-transparent flex flex-col align-middle justify-center" onClick={(e) => {e.preventDefault(); Get_navbar_options("api_docs")}} ><a href="#api_docs">API Docs</a></li>
        </div>
        <div className="nav_items relative w-[90%] min-h-[9vh] h-[9vh] m-auto mt-0 mb-0 p-0 rounded-full shadow-black shadow-xs flex flex-col align-middle justify-center text-xl text-center cursor-pointer">
          <li className="text-white text-xl relative w-full h-full m-auto p-0 bg-transparent flex flex-col align-middle justify-center" onClick={(e) => {e.preventDefault(); Get_navbar_options("api_keys")}} ><a href="#api_keys">API Keys</a></li>
        </div>
        <div className="nav_items relative w-[90%] min-h-[9vh] h-[9vh] m-auto mt-0 mb-0 p-0 rounded-full shadow-black shadow-xs flex flex-col align-middle justify-center text-xl text-center cursor-pointer">
          <li className="text-white text-xl relative w-full h-full m-auto p-0 bg-transparent flex flex-col align-middle justify-center" onClick={(e) => {e.preventDefault(); Get_navbar_options("api_billing")}} ><a href="#api_billing">API Billing</a></li>
        </div>
        <div className="relative w-[90%] min-h-[9vh] h-[9vh] m-auto mt-0 mb-0 p-0 flex flex-col align-middle justify-center text-xl text-center cursor-pointer">
        </div>
        <div className="subscribe relative w-[90%] min-h-[9vh] h-[9vh] m-auto mt-0 mb-0 p-0 flex flex-col align-middle justify-center text-xl text-center cursor-pointer">

        </div>
        <div className="logoff relative w-[90%] min-h-[9vh] h-[9vh] m-auto mt-0 mb-0 p-0 flex flex-col align-middle justify-center text-xl text-center cursor-pointer">
          <li className="dels text-red-500 text-xl border-white border border-dashed relative hover:scale-[1.1] active:scale-[0.9] transition-all duration-300 rounded-xl shadow-black shadow-xs w-full h-[85%] m-auto p-0 flex flex-col align-middle justify-center" onClick={(e) => {e.preventDefault(); deleteUser(auth.currentUser).then((value) => window.location.reload()).catch((err) => {if(err.code == "auth/requires-recent-login"){reauthUser(auth.currentUser.providerData[0].providerId)}})}} >
            Delete Account
          </li>
        </div>
        <div className="google_login relative w-[90%] min-h-[9vh] h-[9vh] m-auto mt-0 mb-0 p-0 flex flex-col align-middle justify-center text-xl text-center cursor-pointer">
          <li className="text-white text-xl relative rounded-xl shadow-gray-800 shadow-xs w-full h-[85%] m-auto p-0 bg-black hover:scale-[1.1] active:scale-[0.9] transition-all duration-300 flex flex-col align-middle justify-center" onClick={(e) => {e.preventDefault(); linkWithPopup(auth.currentUser, google).then((value) => window.location.reload()).catch((err) => alert(err))}} >
            Google Login
          </li>
        </div>
        <div className="github_login relative w-[90%] min-h-[9vh] h-[9vh] m-auto mt-0 mb-0 p-0 shadow-black shadow-xs flex flex-col align-middle justify-center text-xl text-center cursor-pointer">
          <li className="dels text-white text-xl relative hover:scale-[1.1] active:scale-[0.9] transition-all duration-300 rounded-xl shadow-black shadow-xs border-white border border-dashed w-full h-[85%] m-auto p-0 flex flex-col align-middle justify-center" onClick={(e) => {e.preventDefault(); linkWithPopup(auth.currentUser, github).then((value) => window.location.reload()).catch((err) => alert(err))}} >
            Github Login
          </li>
        </div>
      </motion.ul>
      <motion.ul className="bar relative w-[20%] h-screen z-105 m-auto mt-0 mb-0 p-0 bg-transparent hidden lg:flex flex-col align-middle gap-2 ">
        <div className="nav_items relative w-[90%] min-h-[9vh] h-[9vh] m-auto mt-[45%] mb-0 p-0 rounded-full shadow-black shadow-xs flex flex-col align-middle justify-center text-xl text-center cursor-pointer">
          <li className="text-white text-xl relative w-full h-full m-auto p-0 bg-transparent flex flex-col align-middle justify-center" onClick={(e) => {e.preventDefault(); Get_navbar_options("api_playground")}} ><a href="#api_playground">API Playground</a></li>
        </div>
        <div className="nav_items relative w-[90%] min-h-[9vh] h-[9vh] m-auto mt-0 mb-0 p-0 rounded-full shadow-black shadow-xs flex flex-col align-middle justify-center text-xl text-center cursor-pointer">
          <li className="text-white text-xl relative w-full h-full m-auto p-0 bg-transparent flex flex-col align-middle justify-center" onClick={(e) => {e.preventDefault(); Get_navbar_options("api_docs")}} ><a href="#api_docs">API Docs</a></li>
        </div>
        <div className="nav_items relative w-[90%] min-h-[9vh] h-[9vh] m-auto mt-0 mb-0 p-0 rounded-full shadow-black shadow-xs flex flex-col align-middle justify-center text-xl text-center cursor-pointer">
          <li className="text-white text-xl relative w-full h-full m-auto p-0 bg-transparent flex flex-col align-middle justify-center" onClick={(e) => {e.preventDefault(); Get_navbar_options("api_keys")}} ><a href="#api_keys">API Keys</a></li>
        </div>
        <div className="nav_items relative w-[90%] min-h-[9vh] h-[9vh] m-auto mt-0 mb-0 p-0 rounded-full shadow-black shadow-xs flex flex-col align-middle justify-center text-xl text-center cursor-pointer">
          <li className="text-white text-xl relative w-full h-full m-auto p-0 bg-transparent flex flex-col align-middle justify-center" onClick={(e) => {e.preventDefault(); Get_navbar_options("api_billing")}} ><a href="#api_billing">API Billing</a></li>
        </div>
        <div className="relative w-[90%] min-h-[9vh] h-[9vh] m-auto mt-0 mb-0 p-0 flex flex-col align-middle justify-center text-xl text-center cursor-pointer">
        </div>
        <div className="subscribe relative w-[90%] min-h-[9vh] h-[9vh] m-auto mt-0 mb-0 p-0 flex flex-col align-middle justify-center text-xl text-center cursor-pointer">

        </div>
        <div className="logoff relative w-[90%] min-h-[9vh] h-[9vh] m-auto mt-0 mb-0 p-0 flex flex-col align-middle justify-center text-xl text-center cursor-pointer">
          <li className="dels border-white border border-dashed text-red-500 text-xl relative hover:scale-[1.1] active:scale-[0.9] transition-all duration-300 rounded-xl shadow-black shadow-xs w-full h-[85%] m-auto p-0 flex flex-col align-middle justify-center" onClick={(e) => {e.preventDefault(); deleteUser(auth.currentUser).then((value) => window.location.reload())}} >
            Delete Account
          </li>
        </div>
        <div className="google_login relative w-[90%] min-h-[9vh] h-[9vh] m-auto mt-0 mb-0 p-0 flex flex-col align-middle justify-center text-xl text-center cursor-pointer">
          <li className="text-white text-xl relative rounded-xl shadow-gray-800 shadow-xs w-full h-[85%] m-auto p-0 bg-black hover:scale-[1.1] active:scale-[0.9] transition-all duration-300 flex flex-col align-middle justify-center" onClick={(e) => {e.preventDefault(); linkWithPopup(auth.currentUser, google).then((value) => window.location.reload()).catch((err) => alert(err))}} >
            Google Login
          </li>
        </div>
        <div className="github_login relative w-[90%] min-h-[9vh] h-[9vh] m-auto mt-0 mb-0 p-0 shadow-black shadow-xs flex flex-col align-middle justify-center text-xl text-center cursor-pointer">
          <li className="dels border-white border border-dashed text-white text-xl relative hover:scale-[1.1] active:scale-[0.9] transition-all duration-300 rounded-xl shadow-black shadow-xs w-full h-[85%] m-auto p-0 flex flex-col align-middle justify-center" onClick={(e) => {e.preventDefault(); linkWithPopup(auth.currentUser, github).then((value) => window.location.reload()).catch((err) => alert(err))}} >
            Github Login
          </li>
        </div>
      </motion.ul>
      <div className="relative z-99 w-full lg:w-[80%] h-screen max-h-screen m-auto p-0 flex flex-col align-middle overflow-y-hidden overflow-x-hidden">
        <main id="api_playground" className="relative rounded-tl-2xl z-99 w-full h-screen max-h-fit min-h-screen m-auto mt-[14vh] mb-0 p-0 rounded-t-2xl flex flex-col align-middle overflow-y-hidden " >
          <div className="relative w-full h-screen min-h-screen m-auto mt-[1.5%] mb-0 p-0 bg-transparent flex flex-col align-middle gap-2 overflow-y-hidden ">
            <div id="playground_title" className="relative w-full min-h-[20vh] h-[20vh] overflow-y-auto m-auto mt-0 mb-0 p-0 bg-transparent flex flex-col align-middle ">
              <h1 className="relative w-[85%] h-[20vh z-102 m-auto mt-0 mb-0 p-0 flex flex-row align-middle justify-start text-start text-white text-4xl font-medium ">
                API Playground
              </h1>
              <p className="relative w-[85%] h-fit m-auto mt-[1%] mb-0 p-0 flex flex-row align-middle justify-start text-start text-white text-2xl font-light ">
                Try The Budify API For Free <br />
                Budify For Price Discovery
              </p>
            </div>
            <div id="play_form" className="relative w-[90%] h-fit max-h-fit m-auto mt-0 mb-0 p-0 bg-transparent flex flex-col lg:flex-row-reverse align-middle gap-2 overflow-y-auto ">
              <div id="response_output" className="relative w-full lg:w-[50%] h-[45vh] lg:h-[90vh] min-h-[45vh] lg:min-h-[65vh] m-auto mt-0 mb-0 p-0 bg-black flex flex-col align-middle justify-center text-center ">
                <div className="relative w-full h-[20%] m-auto p-0 bg-transparent flex flex-row align-middle justify-start text-start ">
                  <div id="title" className="relative w-[15em] h-[75%] m-auto ml-0 mr-0 p-0 rounded-md flex flex-col align-middle justify-center text-center ">
                    <h1 className="text-2xl text-white font-light ">
                      Response (JSON)
                    </h1>
                  </div>
                </div>
                <div id="load_data" className="relative w-full h-[60%] m-auto p-0 bg-transparent flex flex-row align-middle justify-start text-start">

                </div>
                <div className="relative w-full h-[20%] m-auto p-0 bg-transparent flex flex-row align-middle justify-start text-start ">
                  <div id="download_container" className="relative w-[10em] h-full m-auto ml-[2%] mr-0 p-0 flex flex-col align-middle justify-center text-center text-white text-xl ">

                  </div>
                </div>
              </div>
              <form method="GET" onSubmit={(e) => {e.preventDefault(); Get_Test_Budify()}} action="" className="relative w-full lg:w-[50%] h-[90vh] min-h-[90vh] m-auto mt-0 mb-[4%] p-0 bg-transparent flex flex-col align-middle gap lg:gap-2 overflow-x-hidden overflow-y-hidden ">
                <div className="relative w-full h-[20vh] min-h-[20vh] m-auto mt-0 mb-0 p-0 bg-transparent flex flex-col align-middle justify-center text-center  ">
                  <h1 className="relative w-full lg:w-[90%] h-fit m-auto p-0 flex flex-row align-middle justify-start text-start text-white text-2xl font-medium ">
                    Budget Item Input 
                  </h1>
                  <input id="item" required placeholder="Enter A Item e.g Rent, Food, Internet" type="text" className="relative w-full lg:w-[90%] h-[3em] m-auto mt-[1%] p-0 rounded-2xl shadow-gray-950 shadow-xs flex flex-col align-middle justify-center text-center text-white text-xl " />
                </div>
                <div className="relative w-full h-[20vh] min-h-[20vh] m-auto mt-0 mb-0 p-0 bg-transparent flex flex-col align-middle justify-center text-center  ">
                  <h1 className="relative w-full lg:w-[90%] h-fit m-auto p-0 flex flex-row align-middle justify-start text-start text-white text-2xl font-medium ">
                    City Input 
                  </h1>
                  <input id="city" required placeholder="Enter A City e.g London, New York City" type="text" className="relative w-full lg:w-[90%] h-[3em] m-auto mt-[1%] p-0 rounded-2xl shadow-gray-950 shadow-xs flex flex-col align-middle justify-center text-center text-white text-xl " />
                </div>
                <div className="relative w-full h-[20vh] min-h-[20vh] m-auto mt-0 mb-0 p-0 bg-transparent flex flex-col align-middle justify-center text-center  ">
                  <h1 className="relative w-full lg:w-[90%] h-fit m-auto p-0 flex flex-row align-middle justify-start text-start text-white text-2xl font-medium ">
                    Household Input 
                  </h1>
                  <input id="people" required placeholder="How Many Housemates?" type="number" className="relative w-full lg:w-[90%] h-[3em] m-auto mt-[1%] p-0 rounded-2xl shadow-gray-950 shadow-xs flex flex-col align-middle justify-center text-center text-white text-xl  " />
                </div>
                <div className="relative w-full lg:w-[90%] h-[20vh] min-h-[20vh] m-auto mt-0 mb-[35%] p-0 bg-transparent flex flex-col align-middle justify-center text-center  ">
                  <motion.button initial={{scale: 1}} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} transition={{type: "spring", duration: 1}} type="submit" className="relative border-white border border-dashed w-full h-[50%] cursor-pointer m-auto p-0 bg-black rounded-full font-medium text-xl text-white ">
                    Press To Estimate Cost
                  </motion.button>
                </div>
              </form>
            </div>
          </div>
        </main>
        <main id="api_docs" className="relative rounded-tl-2xl z-99 w-full h-screen max-h-screen min-h-screen m-auto mt-[14vh] mb-0 p-0 rounded-t-2xl flex flex-col align-middle overflow-y-auto overflow-x-hidden ">
          <div className="relative w-[90%] min-h-[15vh] h-[15vh] m-auto mt-[3%] mb-0 p-0 bg-transparent flex flex-col align-middle justify-center text-center ">
            <h1 className="text-4xl font-light text-white flex flex-row align-middle justify-start text-start relative w-[90%] h-fit m-auto p-0 ">
              <strong>Budify Docs</strong>
            </h1>
            <p className="text-xl text-gray-300 flex flex-row align-middle justify-start text-start relative w-[90%] h-fit m-auto p-0  ">
              Get Started With The Budify API
            </p>
          </div>
          <div className="relative w-[90%] min-h-[20vh] h-[20vh] m-auto mt-[4%] mb-0 p-0 bg-transparent flex flex-col align-middle justify-center text-center ">
            <h1 className="text-3xl text-white font-light flex flex-row align-middle justify-start text-start relative w-[90%] h-fit m-auto p-0 ">
              <strong>Introduction</strong>
            </h1> <br />
            <p className="text-xl text-gray-300 flex flex-row align-middle justify-start text-start relative w-[90%] h-fit m-auto p-0  ">

            </p>
          </div>
          <div className="relative w-[90%] min-h-[40vh] h-[40vh] m-auto mt-[4%] mb-0 p-0 bg-transparent flex flex-col align-middle ">
            <h1 className="text-3xl text-white font-light flex flex-row align-middle justify-start text-start relative w-[90%] h-fit m-auto mt-0 mb-0 p-0 ">
              <strong>Use Cases</strong>
            </h1>
            <p className="text-2xl text-gray-300 flex flex-col align-middle justify-start text-start font-medium relative w-[90%] h-fit m-auto mt-[1%] mb-0 p-0 ">
              <li className="text-xl text-gray-300 flex flex-row align-middle justify-start text-start font-medium relative w-full h-fit m-auto p-0 ">
                Develop Apps That Require Price Discovery <br /> E.g Apps That Need Easy To Use Cost Of Living Data And Price Data 
              </li> <br />
              <li className="text-xl text-gray-300 flex flex-row align-middle justify-start text-start font-medium relative w-full h-fit m-auto p-0 ">
                Finding Average And Median Price Data <br /> E.g Search Rent, New York City, 2 Housemates
              </li> <br />
              <li className="text-xl text-gray-300 flex flex-row align-middle justify-start text-start font-medium relative w-full h-fit m-auto p-0 ">
                Helps Your Paycheck Last Longer <br /> E.g Knowing What The Prices Are And Stopping Mindless Spending
              </li> <br />
            </p>
          </div>
          <div className="relative w-[80%] min-h-[50vh] h-[50vh] m-auto mt-[4%] mb-0 p-0 bg-transparent flex flex-row align-middle justify-start text-start">

          </div>
        </main>
        <main id="api_keys" className="relative rounded-tl-2xl z-99 w-full h-screen max-h-screen min-h-screen m-auto mt-[14vh] mb-0 p-0 rounded-t-2xl flex flex-col align-middle overflow-y-auto overflow-x-hidden ">
          <div className="relative w-[90%] h-[30vh] m-auto mt-0 mb-0 p-0 bg-transparent flex flex-col align-middle justify-center text-center ">
            <h1 className="text-4xl text-white font-light flex flex-row align-middle justify-start text-start relative w-[90%] h-fit m-auto p-0 ">
              <strong>Budify API Keys</strong>
            </h1>
            <h1 className="text-4xl text-white font-light flex flex-row align-middle justify-start text-start relative w-[90%] h-[3em] m-auto p-0 ">
              <motion.button onClick={(e) => {e.preventDefault(); Add_User_Key()}} initial={{scale: 1}} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} transition={{type: "spring", duration: 1}} className="relative w-[10em] h-[53%] m-auto ml-0 mr-0 p-0 bg-linear-45 from-violet-950 via-violet-900 to-violet-800 text-xl font-medium rounded-xl shadow-black shadow-xs cursor-pointer ">
                + Add API Key
              </motion.button>
            </h1>
          </div>
          <div id="keyContainer" className="relative w-[80%] h-[70vh] m-auto p-0 bg-transparent flex flex-col align-middle gap-7 overflow-y-auto ">

          </div>
        </main>
        <main id="api_billing" className="relative rounded-tl-2xl z-99 w-full h-screen max-h-screen min-h-screen m-auto mt-[14vh] mb-0 p-0 rounded-t-2xl flex flex-col align-middle gap-2 overflow-y-hidden overflow-x-hidden ">
          <div id="subscription" className="subscribe relative w-[90%] h-[80vh] m-auto mt-[2%] mb-0 p-0 bg-transparent border-pink-950 border rounded-xl hidden flex-col align-middle justify-center text-center ">
            <ul className="relative w-full h-[20%] m-auto p-0 flex flex-col align-middle justify-center text-center  ">
              <li className="text-4xl text-white font-light flex flex-row align-middle justify-start text-start relative w-[90%] h-fit m-auto p-0 ">
                Budify Subscription
              </li>
            </ul>
            <ul className="relative w-full h-[60%] m-auto p-0 flex flex-col align-middle justify-center text-center  ">
              <li className="text-2xl text-gray-300 font-light flex flex-row align-middle justify-start text-start relative w-[90%] h-fit m-auto p-0">
                $0.10 per Budify API Request
              </li>
              <li className="text-2xl text-gray-300 font-light flex flex-row align-middle justify-start text-start relative w-[90%] h-fit m-auto p-0">
                Pay As You Go, No Upfront Payment needed.
              </li>
              <li className="text-2xl text-gray-300 font-light flex flex-row align-middle justify-start text-start relative w-[90%] h-fit m-auto p-0">
                Unlimited API Requests 
              </li>
              <li className="text-2xl text-gray-300 font-light flex flex-row align-middle justify-start text-start relative w-[90%] h-fit m-auto p-0">
                Develop Apps That Require Price Discovery
              </li>
              <li className="text-2xl text-gray-300 font-light flex flex-row align-middle justify-start text-start relative w-[90%] h-fit m-auto p-0">
                Discover Average And Median Local Prices 
              </li>
            </ul>
            <ul className="relative w-full h-[4em] m-auto p-0 flex flex-row align-middle justify-start text-start ">
              <motion.li onClick={(e) => {e.preventDefault(); window.location.href = "https://checkout-2223hqzj3q-uc.a.run.app?user=" + auth.currentUser.uid}} initial={{scale: 1}} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} transition={{type: "spring", duration: 1}} className="subscribe_checkout text-2xl text-white font-light flex flex-col align-middle justify-center text-center relative w-[75%] h-[85%] rounded-xl m-auto ml-[5%] mr-0 p-0 border-violet-950 border shadow-2xs shadow-black ">
                Subscribe Now
              </motion.li>
            </ul>
          </div>
          <div id="login_subscription" className="subscribe relative w-[90%] h-[80vh] m-auto mt-[3%] mb-0 p-0 bg-transparent border-pink-950 border rounded-xl hidden flex-col align-middle justify-center text-center ">
            <ul className="relative w-full h-[20%] m-auto p-0 flex flex-col align-middle justify-center text-center  ">
              <li className="text-4xl text-white font-light flex flex-row align-middle justify-start text-start relative w-[90%] h-fit m-auto p-0 ">
                Budify Login And Subscription
              </li>
            </ul>
            <ul className="relative w-full h-[50%] m-auto p-0 flex flex-col align-middle justify-center text-center  ">
              <li className="text-2xl text-gray-300 font-light flex flex-row align-middle justify-start text-start relative w-[90%] h-fit m-auto p-0">
                $0.10 per Budify API Request
              </li>
              <li className="text-2xl text-gray-300 font-light flex flex-row align-middle justify-start text-start relative w-[90%] h-fit m-auto p-0">
                Pay As You Go, No Upfront Payment needed.
              </li>
              <li className="text-2xl text-gray-300 font-light flex flex-row align-middle justify-start text-start relative w-[90%] h-fit m-auto p-0">
                Unlimited API Requests 
              </li>
              <li className="text-2xl text-gray-300 font-light flex flex-row align-middle justify-start text-start relative w-[90%] h-fit m-auto p-0">
                Develop Apps That Requires Price Discovery 
              </li>
              <li className="text-2xl text-gray-300 font-light flex flex-row align-middle justify-start text-start relative w-[90%] h-fit m-auto p-0">
                Discover Average And Median Local Prices 
              </li>
            </ul>
            <ul className="relative w-full h-[30%] m-auto p-0 flex flex-col align-middle justify-start text-start ">
              <div className="relative w-[75%] h-[4em] m-auto ml-[5%] mr-0 p-0 flex flex-col align-middle justify-center text-xl text-center cursor-pointer">
                <li className="text-white text-xl relative rounded-xl shadow-gray-800 shadow-xs w-full h-[65%] m-auto p-0 border border-violet-950 hover:scale-[1.1] active:scale-[0.9] transition-all duration-300 flex flex-col align-middle justify-center" onClick={(e) => {e.preventDefault(); linkWithPopup(auth.currentUser, google).then((value) => window.location.href = "https://checkout-2223hqzj3q-uc.a.run.app?user=" + auth.currentUser.uid).catch((err) => alert(err))}} >
                  Login With Google And Subscribe 
                </li>
              </div>
              <div className="relative w-[75%] h-[4em] m-auto ml-[5%] mr-0 p-0 flex flex-col align-middle justify-center text-xl text-center cursor-pointer">
                <li className="text-white text-xl relative rounded-xl shadow-gray-800 shadow-xs w-full h-[65%] m-auto p-0 border border-violet-950 hover:scale-[1.1] active:scale-[0.9] transition-all duration-300 flex flex-col align-middle justify-center" onClick={(e) => {e.preventDefault(); linkWithPopup(auth.currentUser, github).then((value) => window.location.href = "https://checkout-2223hqzj3q-uc.a.run.app?user=" + auth.currentUser.uid).catch((err) => alert(err))}} >
                  Login With Github And Subscribe 
                </li>
              </div>
            </ul>
          </div>
          <div id="budify_billing" className="relative w-[90%] max-h-[80vh] h-[80vh] m-auto mt-[3%] mb-0 p-0 bg-transparent hidden flex-col align-middle overflow-y-auto ">
            <div className="relative w-[85%] min-h-[5vh] h-[5vh] m-auto mt-0 mb-0 p-0 bg-transparent flex flex-col align-center text-center justify-center" ></div>
            <div className="relative w-[85%] min-h-[8vh] h-[8vh] m-auto mt-0 mb-0 p-0 bg-transparent flex flex-col align-center text-center justify-center ">
              <h1 className="total_usage text-4xl text-white font-light flex flex-row align-middle justify-start text-start " >

              </h1>
              <p className="text-2xl text-white font-light flex flex-row align-middle justify-start text-start ">
                (Billed Weekly)
              </p>
            </div>
            <form onSubmit={(e) => {e.preventDefault(); update_client()}} action="" className="relative w-[85%] min-h-[75vh] h-[75vh] m-auto mt-[5%] mb-0 p-0 bg-transparent flex flex-col align-middle gap-2 ">
              <div className="relative w-full h-[4em] m-auto mt-0 mb-0 p-0 bg-transparent flex flex-col align-middle justify-center text-center ">
                <h1 className="text-2xl text-white font-light flex flex-row align-middle justify-start text-start " >
                  Update Customer Info 
                </h1>
              </div>
              <input className="customer_data relative w-full h-[3.5em] m-auto mt-0 mb-0 p-0 bg-transparent flex flex-row align-middle justify-start text-center text-white text-xl " placeholder="Enter A Name" type="text" />
              <input className="customer_data relative w-full h-[3.5em] m-auto mt-0 mb-0 p-0 bg-transparent flex flex-row align-middle justify-start text-center text-white text-xl " placeholder="Enter A Email" type="email" />
              <input className="customer_data relative w-full h-[3.5em] m-auto mt-0 mb-0 p-0 bg-transparent flex flex-row align-middle justify-start text-center text-white text-xl " placeholder="Enter A Mobile Number" type="number" />
              <input className="customer_data relative w-full h-[3.5em] m-auto mt-0 mb-0 p-0 bg-transparent flex flex-row align-middle justify-start text-center text-white text-xl " placeholder="Enter A City e.g New York City" type="text" />
              <input className="customer_data relative w-full h-[3.5em] m-auto mt-0 mb-0 p-0 bg-transparent flex flex-row align-middle justify-start text-center text-white text-xl " placeholder="Enter The City's Postal Number" type="number" />
              <input className="customer_data relative w-full h-[3.5em] m-auto mt-0 mb-0 p-0 bg-transparent flex flex-row align-middle justify-start text-center text-white text-xl " placeholder="Enter A Country Code e.g SE, US, GB, DE, FR or etc" type="text" />
              <input className="customer_data relative w-full h-[3.5em] m-auto mt-0 mb-0 p-0 bg-transparent flex flex-row align-middle justify-start text-center text-white text-xl " placeholder="Enter A Address" type="text" />
              <motion.button initial={{scale: 1}} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} transition={{type: "spring", duration: 1}} type="submit" id="submit" className="relative w-full h-[4em] m-auto mt-0 mb-0 p-0 bg-linear-45 from-violet-950 via-violet-900 to-violet-800 rounded-xl flex flex-col align-middle justify-center cursor-pointer text-white text-xl ">
                Submit Customer Info
              </motion.button>
            </form>
            <div className="relative w-[75%] min-h-[25vh] h-[25vh] m-auto mt-0 mb-0 p-0 bg-transparent flex flex-col align-center text-center justify-center">
              
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

