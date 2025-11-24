import express from 'express'
import bcrypt from 'bcryptjs'

export const signupFnc=async(req,res)=>{
    const {}=req.body
    try{
        
    }catch(err){
        res.status(400).json({message:'Internal server error'})
    }
}

export const loginFnc=async()=>{


}