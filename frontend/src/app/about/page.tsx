import Image from 'next/image';
import styles from "./page.module.scss";

export default function About() {
  return (
    <div className={styles.appLayout}>
      <main className={styles.mainContent}>
        <h2>Ellen Yu hvem er det?</h2>
          <p>En trist jente fordi siden hennes suger yay</p>


            <Image
          src="/images/ellen.JPEG" // path in public folder
          alt="Ellen Yu"
          className={styles.roundedImage}
        />
      </main>
    </div>
  );
}

