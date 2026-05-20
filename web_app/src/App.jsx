import { useEffect, useState } from 'react'
import './App.css'
import {motion} from 'framer-motion'
import axios from 'axios'
import $ from 'jquery'
import { initializeApp } from 'firebase/app'
import {} from 'firebase/app-check'
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "",
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
    const arr = ["api_playground", "api_usage", "api_billing", "api_keys", "api_docs"]

    for(let i = 0; i != arr.length; i++){
      if(arr[i] == name){
        document.getElementById(arr[i]).style.display = "flex"
        continue
      }
      document.getElementById(arr[i]).style.display = "none"
    }

  }
  return(
    <div className="relative w-full h-fit m-auto p-0 bg-transparent flex flex-col align-middle ">
      <motion.nav initial={{height: 10 + "vh"}} className="fixed top-0 left-0 w-full z-100 m-auto mt-0 mb-0 p-0 bg-transparent flex flex-col align-middle ">
        <div className="relative w-full min-h-[10vh] h-[10vh] m-auto mt-0 mb-0 p-0 bg-transparent flex flex-row align-middle justify-center text-center ">
          <ul className="relative w-[50%] h-full m-auto p-0 bg-transparent flex flex-row align-middle justify-start text-start ">
            <h1 className="text-2xl text-white font-medium ml-[5%] mr-0 flex flex-col align-middle justify-center text-center  ">
              Budify API
            </h1>
          </ul>
          <ul className="relative w-[50%] h-full m-auto p-0 bg-transparent flex flex-row align-middle justify-end text-end ">
            <motion.button initial={{scale: 1}} whileTap={{scale: 1.1}} whileHover={{scale: 0.9}} transition={{type: "spring", duration: 1}} className="relative rounded-full shadow-xs shadow-black z-101 w-[10em] h-[80%] cursor-pointer m-auto ml-0 mr-[5%] p-0 flex flex-col align-middle justify-center text-center text-xl text-white font-medium " >
              + Buy Pro
            </motion.button>
            <motion.button initial={{scale: 1}} whileTap={{scale: 1.1}} whileHover={{scale: 0.9}} transition={{type: "spring", duration: 1}} className="relative rounded-full shadow-xs shadow-black z-101 w-[10em] h-[80%] cursor-pointer m-auto ml-0 mr-[5%] p-0 flex flex-col align-middle justify-center text-center text-xl text-white font-medium " >
              Login Page
            </motion.button>
            <div onClick={active? () => setActive(false) : () => setActive(true)} onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)} className="relative z-101 w-[3em] h-[50%] cursor-pointer m-auto ml-0 mr-[5%] p-0 bg-transparent flex flex-col align-middle justify-center text-center ">
              <motion.div initial={{width: 50 + "%"}} animate={{width: hover? 50 + "%" : 100 + "%"}} className="relative w-[50%] h-[0.3em] ml-auto mr-0 m-auto p-0 bg-white rounded-md flex flex-col align-middle justify-center text-center "></motion.div>
              <motion.div initial={{width: 75 + "%"}} animate={{width: hover? 75 + "%" : 75 + "%"}} className="relative w-[75%] h-[0.3em] ml-auto mr-0 m-auto p-0 bg-white rounded-md flex flex-col align-middle justify-center text-center "></motion.div>
              <motion.div initial={{width: 100 + "%"}} animate={{width: hover? 100 + "%" : 50 + "%"}} className="relative w-full h-[0.3em] ml-auto mr-0 m-auto p-0 bg-white rounded-md flex flex-col align-middle justify-center text-center "></motion.div>
            </div>
          </ul>
        </div>
        <motion.ul id="bar" initial={{display: "flex", translateX: 100 + "%"}} animate={{translateX: active? 0 + "%" : 100 + "%"}} className="fixed w-[45vh] h-screen z-100 top-0 right-0 m-auto mt-0 mb-0 p-0 bg-transparent flex-col align-middle gap-2 ">
          <div className="nav_items relative w-[90%] min-h-[9vh] h-[9vh] m-auto mt-[35%] mb-0 p-0 rounded-full shadow-black shadow-xs flex flex-col align-middle justify-center text-xl text-center cursor-pointer">
            <li className="text-white text-xl relative w-full h-full m-auto p-0 bg-transparent flex flex-col align-middle justify-center" onClick={(e) => {e.preventDefault(); Get_navbar_options("api_playground")}} ><a href="#api_playground">API Playground</a></li>
          </div>
          <div className="nav_items relative w-[90%] min-h-[9vh] h-[9vh] m-auto mt-0 mb-0 p-0 rounded-full shadow-black shadow-xs flex flex-col align-middle justify-center text-xl text-center cursor-pointer">
            <li className="text-white text-xl relative w-full h-full m-auto p-0 bg-transparent flex flex-col align-middle justify-center" onClick={(e) => {e.preventDefault(); Get_navbar_options("api_docs")}} ><a href="#api_docs">API Docs</a></li>
          </div>
          <div className="nav_items relative w-[90%] min-h-[9vh] h-[9vh] m-auto mt-0 mb-0 p-0 rounded-full shadow-black shadow-xs flex flex-col align-middle justify-center text-xl text-center cursor-pointer">
            <li className="text-white text-xl relative w-full h-full m-auto p-0 bg-transparent flex flex-col align-middle justify-center" onClick={(e) => {e.preventDefault(); Get_navbar_options("api_usage")}} ><a href="#api_usage">API Usage</a></li>
          </div>
          <div className="nav_items relative w-[90%] min-h-[9vh] h-[9vh] m-auto mt-0 mb-0 p-0 rounded-full shadow-black shadow-xs flex flex-col align-middle justify-center text-xl text-center cursor-pointer">
            <li className="text-white text-xl relative w-full h-full m-auto p-0 bg-transparent flex flex-col align-middle justify-center" onClick={(e) => {e.preventDefault(); Get_navbar_options("api_keys")}} ><a href="#api_keys">API Keys</a></li>
          </div>
          <div className="nav_items relative w-[90%] min-h-[9vh] h-[9vh] m-auto mt-0 mb-0 p-0 rounded-full shadow-black shadow-xs flex flex-col align-middle justify-center text-xl text-center cursor-pointer">
            <li className="text-white text-xl relative w-full h-full m-auto p-0 bg-transparent flex flex-col align-middle justify-center" onClick={(e) => {e.preventDefault(); Get_navbar_options("api_billing")}} ><a href="#api_billing">API Billing</a></li>
          </div>
        </motion.ul>
      </motion.nav>
      <div className="relative w-[95%] h-[10vh] max-h-[10vh] m-auto mt-[2%] p-0 flex flex-col align-middle overflow-y-auto overflow-x-hidde"></div>
      <div id="backgroundCover" className="relative opacity-[0.9] w-[95%] h-[360vh] max-h-[90vh] m-auto p-0 rounded-2xl flex flex-col align-middle overflow-y-auto overflow-x-hidden"></div>
      <main id="api_playground" className="relative z-99 -translate-y-full w-[95%] h-[90vh] max-h-[90vh] m-auto p-0 rounded-t-2xl flex flex-col align-middle overflow-y-auto overflow-x-hidden " >
        <div className="relative w-[95%] h-fit min-h-fit m-auto mt-0 mb-0 p-0 bg-transparent flex flex-col align-middle justify-center text-center gap-2  ">
          <div id="playground_title" className="relative w-full h-[20vh] overflow-y-auto m-auto mt-[2%] mb-0 p-0 bg-transparent flex flex-col align-middle ">
            <h1 className="relative w-full h-fit m-auto mt-0 mb-0 p-0 flex flex-row align-middle justify-center text-white text-4xl font-medium ">
              API Playground
            </h1>
            <p className="relative w-full h-fit m-auto mt-[1%] mb-0 p-0 flex flex-row align-middle justify-center text-white text-2xl font-light ">
              Try The Budify API For Free <br />
              Budify For Price Discovery
            </p>
          </div>
          <div className="relative w-[99%] h-fit m-auto p-0 bg-transparent flex flex-col lg:flex-row-reverse align-middle justify-center text-center ">
            <div id="response_output" className="relative  w-full lg:w-[50%] h-[40vh] lg:h-[70vh] m-auto mt-0 mb-[4%] p-0 bg-black flex flex-col align-middle justify-center text-center ">
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
            <form method="GET" onSubmit={(e) => {e.preventDefault(); Get_Test_Budify()}} action="" className="relative w-full lg:w-[50%] h-[70vh] overflow-y-auto m-auto mt-0 mb-0 p-0 bg-transparent flex flex-col align-middle gap ">
              <div className="relative w-full h-[25%] min-h-[25%] m-auto mt-0 mb-0 p-0 bg-transparent flex flex-col align-middle justify-center text-center  ">
                <h1 className="relative w-full lg:w-[90%] h-fit m-auto p-0 flex flex-row align-middle justify-start text-start text-white text-2xl font-medium ">
                  Budget Item Input 
                </h1>
                <input id="item" required placeholder="Enter A Item e.g Rent, Food, Internet" type="text" className="relative w-full lg:w-[90%] h-[3em] m-auto mt-[1%] p-0 rounded-2xl shadow-gray-950 shadow-xs flex flex-col align-middle justify-center text-center text-white text-xl " />
              </div>
              <div className="relative w-full h-[25%] min-h-[25%] m-auto mt-0 mb-0 p-0 bg-transparent flex flex-col align-middle justify-center text-center  ">
                <h1 className="relative w-full lg:w-[90%] h-fit m-auto p-0 flex flex-row align-middle justify-start text-start text-white text-2xl font-medium ">
                  City Input 
                </h1>
                <input id="city" required placeholder="Enter A City e.g London, New York City" type="text" className="relative w-full lg:w-[90%] h-[3em] m-auto mt-[1%] p-0 rounded-2xl shadow-gray-950 shadow-xs flex flex-col align-middle justify-center text-center text-white text-xl " />
              </div>
              <div className="relative w-full h-[25%] min-h-[25%] m-auto mt-0 mb-0 p-0 bg-transparent flex flex-col align-middle justify-center text-center  ">
                <h1 className="relative w-full lg:w-[90%] h-fit m-auto p-0 flex flex-row align-middle justify-start text-start text-white text-2xl font-medium ">
                  Household Input 
                </h1>
                <input id="people" required placeholder="How Many Housemates?" type="number" className="relative w-full lg:w-[90%] h-[3em] m-auto mt-[1%] p-0 rounded-2xl shadow-gray-950 shadow-xs flex flex-col align-middle justify-center text-center text-white text-xl  " />
              </div>
              <div className="relative w-full lg:w-[90%] h-[25%] min-h-[25%] m-auto mt-0 mb-0 p-0 bg-transparent flex flex-col align-middle justify-center text-center  ">
                <motion.button initial={{scale: 1}} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} transition={{type: "spring", duration: 1}} type="submit" className="relative border-white border border-dashed w-full h-[60%] cursor-pointer m-auto p-0 bg-black rounded-full font-medium text-xl text-white ">
                  Press To Estimate Cost
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <main id="api_docs" className="relative w-[95%] h-[90vh] max-h-[90vh] -translate-y-full rounded-t-2xl m-auto p-0 bg-transparent hidden flex-col align-middle gap-5 overflow-y-auto overflow-x-hidden ">
        <div className="relative w-[90%] min-h-[15vh] h-[15vh] m-auto mt-[1%] mb-0 p-0 bg-transparent flex flex-col align-middle justify-center text-center ">
          <h1 className="text-4xl font-medium text-white flex flex-row align-middle justify-start text-start relative w-[90%] h-fit m-auto p-0 ">
            Budify Docs
          </h1>
          <p className="text-xl text-gray-300 flex flex-row align-middle justify-start text-start relative w-[90%] h-fit m-auto p-0  ">
            Get Started With The Budify API
          </p>
        </div>
        <div className="relative w-[90%] min-h-[20vh] h-[20vh] m-auto mt-[2%] mb-0 p-0 bg-transparent flex flex-col align-middle justify-center text-center ">
          <h1 className="text-3xl text-white flex flex-row align-middle justify-start text-start relative w-[90%] h-fit m-auto p-0 ">
            Introduction
          </h1> <br />
          <p className="text-xl text-gray-300 flex flex-row align-middle justify-start text-start relative w-[90%] h-fit m-auto p-0  ">
            Budify API For Finding Prices In Different Cities <br />
            Budify API Uses Brave Search And Other Search APIs To Find Price Data <br />
            The API Also Uses Gemini To Summarize The Search Data Found On Brave And Gives A Short Summary Of The Item
          </p>
        </div>
        <div className="relative w-[90%] min-h-[40vh] h-[40vh] m-auto mt-[2%] mb-0 p-0 bg-transparent flex flex-col align-middle ">
          <h1 className="text-3xl text-white flex flex-row align-middle justify-start text-start relative w-[90%] h-fit m-auto mt-0 mb-0 p-0 ">
            Use Cases
          </h1>
          <p className="text-2xl text-gray-300 flex flex-col align-middle justify-start text-start font-medium relative w-[90%] h-fit m-auto mt-[1%] mb-0 p-0 ">
            <li className="text-xl text-gray-300 flex flex-row align-middle justify-start text-start font-medium relative w-full h-fit m-auto p-0 ">
              Developing Budget Apps To Help Your Paycheck <br /> E.g Apps That Need Easy To Use Cost Of Living Data And Price Data 
            </li> <br />
            <li className="text-xl text-gray-300 flex flex-row align-middle justify-start text-start font-medium relative w-full h-fit m-auto p-0 ">
              Finding Average And Median Price Data <br /> E.g Search Rent, New York City, 2 Housemates
            </li> <br />
            <li className="text-xl text-gray-300 flex flex-row align-middle justify-start text-start font-medium relative w-full h-fit m-auto p-0 ">
              For Data Science And Charts About Cost Of Living In Cities <br /> E.g Youtube Videos on Cost Of Living And Prices <br /> Essays About The Cost Of Living And Powerpoints
            </li> <br />
          </p>
        </div>
        <div className="relative w-[80%] min-h-[50vh] h-[50vh] m-auto mt-0 mb-0 p-0 bg-transparent flex flex-row align-middle justify-start text-start">
          <div className="relative w-[80%] min-h-[35vh] h-[35vh] m-auto mr-0 ml-0 p-0 border-gray-500 border border-solid bg-transparent flex flex-col align-middle justify-center text-center">

          </div>
        </div>
      </main>
      <main id="api_usage" className="relative w-[95%] h-[90vh] max-h-[90vh] -translate-y-full rounded-t-2xl m-auto p-0 bg-transparent hidden flex-col align-middle justify-center text-center ">
        <div className="relative w-full h-[20%] m-auto p-0 bg-transparent flex flex-col align-middle justify-center text-center ">
          <h1 className="text-4xl text-white flex flex-row align-middle justify-start text-start relative w-[90%] h-fit m-auto p-0 ">
            Budify Usage
          </h1>
        </div>
        <div className="relative w-full h-[80%] m-auto p-0 bg-transparent flex flex-col align-middle justify-center text-center ">

        </div>
      </main>
      <main id="api_keys" className="relative w-[95%] h-[90vh] max-h-[90vh] -translate-y-full rounded-t-2xl m-auto p-0 bg-transparent hidden flex-col align-middle justify-center text-center ">
        <div className="relative w-full h-[20%] m-auto p-0 bg-transparent flex flex-col align-middle justify-center text-center ">
          <h1 className="text-4xl text-white flex flex-row align-middle justify-start text-start relative w-[90%] h-fit m-auto p-0 ">
            Budify Keys
          </h1>
        </div>
        <div className="relative w-full h-[80%] m-auto p-0 bg-transparent flex flex-col align-middle justify-center text-center ">

        </div>
      </main>
      <main id="api_billing" className="relative w-[95%] h-[90vh] max-h-[90vh] -translate-y-full rounded-t-2xl m-auto p-0 bg-transparent hidden flex-col align-middle justify-center text-center ">
        <div className="relative w-full h-[20%] m-auto p-0 bg-transparent flex flex-col align-middle justify-center text-center ">
          <h1 className="text-4xl text-white flex flex-row align-middle justify-start text-start relative w-[90%] h-fit m-auto p-0 ">
            Budify Billing
          </h1>
        </div>
        <div className="relative w-full h-[80%] m-auto p-0 bg-transparent flex flex-col align-middle justify-center text-center ">

        </div>
      </main>
    </div>
  )
}

