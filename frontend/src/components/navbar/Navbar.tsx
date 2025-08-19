"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./Navbar.module.scss";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => setIsOpen(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">ellnyu</Link>
      </div>

      {/* Hamburger button (only visible on mobile) */}
      <button
        className={styles.hamburger}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>

      <ul className={`${styles.navLinks} ${isOpen ? styles.open : ""}`}>
        <li><Link href="/posts" onClick={handleClose}>Posts</Link></li>
        <li><Link href="/suggestions" onClick={handleClose}>Forslaaag</Link></li>
        <li><Link href="/blog" onClick={handleClose}>Innlegg</Link></li>
        <li><Link href="/books" onClick={handleClose}>Bøker</Link></li>
        <li><Link href="/messages" onClick={handleClose}>Meldinger</Link></li>
        <li><Link href="/travels" onClick={handleClose}>Reise</Link></li>
        <li><Link href="/about" onClick={handleClose}>Om meg</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;

