import express from 'express'
import jwt from 'jsonwebtoken'

export const jwtMiddleware=async(req,res,next)=>{
    const header=req.headers.authorization
    if (!header) {
    return res.status(401).json({ message: 'Token missing' })
  }
  const token=header.split(' ')[1]
    try {
    let jwt_secret='dfsdfsdfsdf'
    const decoded = jwt.verify(token, jwt_secret)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ message: 'User-session expired' })
  }
}