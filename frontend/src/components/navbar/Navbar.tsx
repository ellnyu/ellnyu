"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./Navbar.module.scss";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

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
        <li><Link href="/posts">Posts</Link></li>
        <li><Link href="/suggestions">Forslaaag</Link></li>
        <li><Link href="/blog">Innlegg</Link></li>
        <li><Link href="/books">Bøker</Link></li>
        <li><Link href="/messages">Meldinger</Link></li>
        <li><Link href="/about">Om meg</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;

