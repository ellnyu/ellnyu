import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.scss"; // using SCSS module

const Navbar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">Ellen Yu</Link>
      </div>
      <ul>
        <li><Link to="/instagram-posts">Posts</Link></li>
        <li><Link to="/forslag">Forslaaag</Link></li>
        <li><Link to="/meldinger">Meldinger</Link></li>
        <li><Link to="/om-meg">Om meg</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;

