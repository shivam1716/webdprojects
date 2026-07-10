import React from 'react'
import { AiFillGithub } from 'react-icons/ai';

const Navbar = () => {
  return (
    <div className='navbar'>
        <div className="logo">SuDoKu</div>
        <div className="navLinks">
            <ul>
                <li><a href='https://github.com/shivam1716' target='_blank' rel='noreferrer'><AiFillGithub /> </a></li>
            </ul>
        </div>
    </div>
  )
}

export default Navbar