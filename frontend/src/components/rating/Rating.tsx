'use client';
import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Rating.module.scss";

type RatingProps = {
  initialRating?: number;
  maxRating?: number;
  onChange?: (rating: number) => void;
};

export default function Rating({ initialRating = 0, maxRating = 5, onChange }: RatingProps) {
  const [rating, setRating] = useState(initialRating);

  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  const handleClick = (index: number) => {
    setRating(index);
    onChange?.(index);
  };

  return (
    <div className={styles.ratingContainer}>
      {Array.from({ length: maxRating }).map((_, i) => {
        const index = i + 1;
        return (
          <Image
            key={index}
            src="/images/cutepepe.png"
            alt={`Rating ${index}`}
            width={24}
            height={24}
            className={index <= rating ? styles.filledIcon : styles.emptyIcon}
            onClick={() => handleClick(index)}
            style={{ cursor: "pointer" }}
          />
        );
      })}
    </div>
  );
}

