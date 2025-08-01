import { Request, Response } from 'express';
import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, uname, email, phone, password } = req.body;

    if (!name || !uname || !email || !phone || !password) {
      return res.status(400).json({ msg: 'Missing Required Field' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'An account with this email already exists.' });
    }

    const takenUsername = await User.findOne({ uname });
    if(takenUsername) {
        return res.status(400).json({ msg: 'Username already taken by another user' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      uname,
      email,
      phone,
      password: hashedPassword
    });

    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    return res.status(201).json({
      token,
      user: {
        id: newUser._id,
        uname: newUser.uname,
        name: newUser.name,
        phone: newUser.phone,
        email: newUser.email,
        role: newUser.role,
        verified: newUser.verified
      }
    });
  } catch (err: any) {
    console.error('Signup Error:', err.message);
    return res.status(500).json({ msg: 'Something went wrong, Cody. It’s not you, it’s the server.' });
  }
};

export const login = async (req: Request,res: Response) => {
        const {email, password} = req.body;
        
        if(!email || !password) {
            return res.status(400).json({msg: 'Email and Password are required'});
        }
        
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(404).json({ msg: 'User Not Found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(401).json({msg: 'Invlaid Credentials'});
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET!,
            { expiresIn: '1h' }
        );
    
    return res.status(200).json({
        token,
        user : {
            id: user._id,
            uname: user.uname,
            name: user.name,
            phone: user.phone,
            email: user.email,
            role: user.role,
            verified: user.verified
        }
    });
}
