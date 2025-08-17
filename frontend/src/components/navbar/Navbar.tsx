import Link from "next/link";
import styles from "./Navbar.module.scss";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">Ellen Yu</Link>
      </div>
      <ul>
        <li><Link href="/posts">Posts</Link></li>
        <li><Link href="/suggestions">Forslaaag</Link></li>
        <li><Link href="/messages">Meldinger</Link></li>
        <li><Link href="/about">Om meg</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;

