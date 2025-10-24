import React from 'react'
import "./Navbar.css"
import { Link } from 'react-router-dom';
export default function Navbar(props) {
  console.log(props.varone);
  return (
    <>
    <nav className="navbar navbar-custom navbar-expand-lg">
  <div className="container-fluid">
    <a className="navbar-brand" href="/">
      <img src={require('../shield-cat-solid (1).png')} alt="Logo" width="30" height="30" className="d-inline-block align-text-top"/>
    </a>
    <a className="navbar-brand head" href="/">PYHOOMA</a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" aria-current="page" href="/">Home</a>
        </li>
        <li className="nav-item">
        <Link className="nav-link" to="/keygenerator">Key Generator</Link>
        </li>
        <li className="nav-item">
        <Link className="nav-link" to="/encrypter">Encrypter</Link>
        </li>
        <li className="nav-item">
        <Link className="nav-link" to="/decrypter">Decrypter</Link>
        </li>
      </ul>
    </div>
  </div>
</nav>
    </>
  )
}




