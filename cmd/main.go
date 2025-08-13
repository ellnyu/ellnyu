package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html; charset=utf-8")

		fmt.Fprintf(w, `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Ellnyu</title>
			<style>
				:root {
					--lightest: #f4e1d2; /* background */
					--light: #c9b3cc;    /* headings */
					--mid: #4b6573;      /* text */
					--dark: #20333b;     /* button */
					--darker: #15242a;   /* button hover */
				}
				body {
					font-family: Arial, sans-serif;
					background-color: var(--lightest);
					color: var(--mid);
					margin: 0;
					padding: 0;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					height: 100vh;
					text-align: center;
				}
				h1 {
					font-size: 3rem;
					margin-bottom: 0.5rem;
					color: var(--light);
				}
				p {
					font-size: 1.25rem;
					margin-top: 0;
				}
				.host {
					margin-top: 1rem;
					font-size: 1rem;
					color: #666;
				}
				.button {
					margin-top: 2rem;
					background: var(--dark);
					color: white;
					border: none;
					padding: 0.75rem 1.5rem;
					font-size: 1rem;
					border-radius: 8px;
					cursor: pointer;
					transition: background 0.3s;
					text-decoration: none;
				}
				.button:hover {
					background: var(--darker);
				}
			</style>
		</head>
		<body>
			<h1>Halla babyyyy boomsi</h1>
			<p>Nettsida mi lever og jeg bør jobbe med jobb og ikke dette men dgb</p>
			<div class="host">Host: %s</div>
			<a href="https://dailybunny.org/" class="button">Magisk knapp</a>
		</body>
		</html>
		`, r.Host)
	})

	log.Printf("Listening on port %s...\n", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
