import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.scss";

export default function About() {
  return (
    <div className={styles.appLayout}>
      <main className={styles.mainContent}>
        <h2>Ellen Yu hvem er det?</h2>
        <p>En trist jente fordi siden hennes suger yay</p>

        <div>
          <Link href="/login">
            <Image
              src="/images/ellen.JPEG" // must exist in /public/images/
              alt="Ellen Yu"
              width={500}
              height={500}
              className={styles.roundedImage}
            />
          </Link>
        </div>
      </main>
    </div>
  );
}

