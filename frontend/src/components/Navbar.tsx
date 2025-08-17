import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.scss"; // using SCSS module

const Navbar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>Ellen Yu</div>
      <ul>
        <li><Link to="/">Hjem baby</Link></li>
        <li><Link to="/posts">Posts</Link></li>
        <li><Link to="/about">Om meg</Link></li>
        <li><Link to="/suggestions">Forslaaag</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;

