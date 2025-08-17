import styles from "./page.module.scss";

// Sample static data
const books = [
  { title: "The Hobbit", author: "J.R.R. Tolkien", rating: 4, readDate: "March 2023" },
  { title: "Pride and Prejudice", author: "Jane Austen", rating: 5, readDate: "January 2022" },
  { title: "1984", author: "George Orwell", rating: 5, readDate: "June 2021" },
  { title: "To Kill a Mockingbird", author: "Harper Lee", rating: 4, readDate: "September 2020" },
];

export default function BooksPage() {
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Bøker jeg har lest</h1>
      <div className={styles.cardsContainer}>
        {books.map((book, idx) => (
          <div key={idx} className={styles.card}>
            <h2 className={styles.bookTitle}>{book.title}</h2>
            <p className={styles.bookAuthor}>by {book.author}</p>
            <div className={styles.rating}>
              {Array.from({ length: 5 }).map((_, i) => (
                <img
                  key={i}
                  src="/images/cutepepe.png" // replace with your logo path
                  alt="rating"
                  className={
                    i < book.rating
                      ? styles.filledIcon
                      : styles.emptyIcon
                  }
                />
              ))}
            </div>
            <p className={styles.readDate}>{book.readDate}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

