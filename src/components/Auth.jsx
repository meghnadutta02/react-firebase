import React, { useState } from "react";
import { auth,googleProvider } from "../config/firebase";
import { createUserWithEmailAndPassword,signInWithPopup,signOut } from "firebase/auth";
const Auth = () => {
  const styles = "rounded-lg px-5 py-3 bg-gray-100 drop-shadow-md";
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("")
  console.log(auth?.currentUser?.email)
  const signIn=async()=>
  {
    try
    {
      await createUserWithEmailAndPassword(auth,email,password)
      console.log(auth?.currentUser?.email)
    }catch(err)
    {
      console.log(err)
    }
   
  };
  const logout=async()=>
  {
    try{
      await signOut(auth);

    }catch(err)
    {
      console.log(err)
    }
  }
  const signInWithGoogle=async()=>
  {
    try
    {
      await signInWithPopup(auth,googleProvider)
    }catch(err)
    {
      console.log(err)
    }
   
  };
  return (
    <div className="justify-center items-center sm:mt-30 mt-20 ">
      <div className="lg:w-[28%] md:w-[50%] sm:w-[70%] w-[92%] flex flex-col gap-7 mx-auto shadow-md sm:px-10 sm:pb-20 sm:pt-5 rounded-md">
        <span
          className="text-2xl text-center font-bold text-gray-500
        mb-5"
        >
          Login 
        </span>
        <input className={styles} type="email" placeholder="email" onChange={(e)=>setEmail(e.target.value)} />
        <input className={styles} type="password" placeholder="password" onChange={(e)=>setPassword(e.target.value)} />
        <button className="bg-blue-400 rounded-lg py-2 mt-5" onClick={signIn}>Sign In</button>
        <button className="bg-blue-400 rounded-lg py-2" onClick={signInWithGoogle}>Sign In With Google</button>
        <button className="bg-blue-400 rounded-lg py-2" onClick={logout}>Logout</button>
        
      </div>
    </div>
  );
};

export default Auth;
