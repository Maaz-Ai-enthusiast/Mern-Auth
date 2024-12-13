import { useNavigate } from "react-router-dom"
import {assets} from "../assets/assets"
import { useContext } from "react"
import { AppContent } from "../context/AppContext"

import axios from "axios"
import { toast } from "react-toastify"

function NavBar() {

    const navigate=useNavigate ()
const {userData,backendUrl,setUserData,setIsLogin} =useContext(AppContent)

const logout=async()=>{

try {
  axios.defaults.withCredentials=true
  const {data}=await axios.post(backendUrl+'/api/auth/logout')
  data.success && setIsLogin(false) 
  data.success &&  setUserData(false)
  navigate('/')
  
} catch (error) {
  toast.error(error.message)
}

}


// send verify email otp

const sendVerifyEmailOtp=async()=>{

try {
  axios.defaults.withCredentials=true
  const {data}=await axios.post(backendUrl+'/api/auth/send-verify-otp')
  if(data.success){
    navigate('/verify-email')
    toast.success("Verification OTP sent successfully")
  }
  else {
    toast.error("Failed to send verification OTP")
  }
  
} catch (error) {
  toast.error(error.message)
}

}

  return (
    <div 
    className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0 bg-gray-200"
    >
      <img src={assets.logo
      } alt="logo"
      className="w-28 sm:w-32"
      />
 {userData ? (
  <div
    className="w-12 h-8 flex justify-center items-center rounded-full bg-black text-white relative group"
  >
    {userData.name[0].toUpperCase()}
    <div
      className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10"
    >
      <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
        {
          !userData.isAccountVerified && <li
          onClick={sendVerifyEmailOtp}
          className="py-1 px-2 cursor-pointer hover:bg-gray-200">
          Verify Email
        </li>
        }
        <li className="pr-10 py-1 px-2 cursor-pointer hover:bg-gray-200"
        onClick={logout}>
          Logout
        </li>
      </ul>
    </div>
  </div>
) : (
  <button
    onClick={() => navigate('/login')}
    className="flex items-center gap-2 border border-gray-500 px-6 py-2 text-gray-800 rounded-full hover:bg-slate-100 hover:gap-3 transition-all duration-300 ease-in-out"
  >
    Login
    <img src={assets.arrow_icon} alt="arrow_icon" />
  </button>
)}




    </div>
  )
}

export default NavBar