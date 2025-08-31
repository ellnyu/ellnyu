// "use client";
//
// import { useRef } from "react";
// // import styles from "./ImageUploader.module.scss";
//
// type ImageUploaderProps = {
//   images: string[];
//   onChange: (images: string[]) => void;
// };
//
// export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
//   const fileInputRef = useRef<HTMLInputElement | null>(null);
//
//   const handleFiles = (files: FileList | null) => {
//     if (!files) return;
//     const newImages: string[] = [];
//     Array.from(files).forEach((file) => {
//       const url = URL.createObjectURL(file); // local preview
//       newImages.push(url);
//     });
//     onChange([...images, ...newImages]);
//   };
//
//   const handleRemove = (url: string) => {
//     onChange(images.filter((img) => img !== url));
//   };
//
//   const handleClick = () => {
//     fileInputRef.current?.click();
//   };
//
//   return (
//     <div
//       className={styles.uploader}
//       onClick={handleClick}
//       onDragOver={(e) => e.preventDefault()}
//       onDrop={(e) => {
//         e.preventDefault();
//         handleFiles(e.dataTransfer.files);
//       }}
//     >
//       <input
//         type="file"
//         multiple
//         accept="image/*"
//         ref={fileInputRef}
//         style={{ display: "none" }}
//         onChange={(e) => handleFiles(e.target.files)}
//       />
//
//       <p className={styles.hint}>Click or drag & drop images here</p>
//
//       {images.length > 0 && (
//         <div className={styles.previewGrid}>
//           {images.map((url, idx) => (
//             <div key={url + idx} className={styles.previewItem}>
//               <img src={url} alt={`upload-${idx}`} />
//               <button
//                 type="button"
//                 className={styles.removeButton}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleRemove(url);
//                 }}
//               >
//                 ✕
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
//
