import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.scss";

export default function About() {
  return (
    <div className={styles.appLayout}>
      <main className={styles.mainContent}>
        <h2>Om meg</h2>

        <div className={styles.profileSection}>
          <div className={styles.imageWrapper}>
          <Link href="/login">
            <Image
              src="/images/ellen.JPEG"
              alt="Ellen Yu"
              width={200}
              height={200}
              className={styles.roundedImage}
            />
          </Link>
          </div>

          <div className={styles.bioAndLinks}>
            <p className={styles.biography}>
            Hallaa, du fant sida mi! jeg aner ikke hva jeg driver med på nettsiden for dette er bare et hobbyprosjekt hvor jeg bare kuker rundt og har det gøy. Ikke særlig bra standard på noe som helst her, men jeg synes det er gøy og det er det som teller.. ehh ja kos deg på sida og skriv en melding da blir jeg glad heheh (for da vet jeg at databasen min faktisk funker?!)
            </p>

            <div className={styles.socialLinks}>
  <Link
    href="https://www.instagram.com/ellnyu"
    target="_blank"
    className={styles.socialButton}
  >
    <Image
      src="/images/instagram.png"
      alt="Instagram"
      width={24}
      height={24}
      className={styles.icon}
    />
    <span>Instagram</span>
  </Link>

  <Link
    href="https://www.linkedin.com/in/ellenyu99"
    target="_blank"
    className={styles.socialButton}
  >
    <Image
      src="/images/linkedin.png"
      alt="LinkedIn"
      width={26}
      height={26}
      className={styles.icon}
    />
    <span>LinkedIn</span>
  </Link>
</div>

          </div>
        </div>
      </main>
    </div>
  );
}

