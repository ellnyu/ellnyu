package main

import (
	"fmt"
	"html"
	"log"
	"net/http"
	"os"
	"sync"
)

var (
	messages []string
	mu       sync.Mutex
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html; charset=utf-8")

		// Handle form submission
		if r.Method == http.MethodPost {
			r.ParseForm()
			msg := r.FormValue("message")
			if msg != "" {
				mu.Lock()
				messages = append(messages, html.EscapeString(msg))
				mu.Unlock()
			}
			http.Redirect(w, r, "/", http.StatusSeeOther)
			return
		}

		// HTML output
		fmt.Fprintf(w, `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Ellnyu</title>
			<style>
				:root {
					--lightest: #f4e1d2;
					--light: #c9b3cc;
					--mid: #4b6573;
					--dark: #20333b;
					--darker: #15242a;
				}
				body {
					font-family: Arial, sans-serif;
					background-color: var(--lightest);
					color: var(--mid);
					margin: 0;
					padding: 20px;
					text-align: center;
				}
				h1 { color: var(--light); }
				form {
					margin-top: 20px;
				}
				input[type=text] {
					padding: 10px;
					width: 300px;
					border: 1px solid var(--mid);
					border-radius: 5px;
				}
				button {
					padding: 10px 15px;
					background: var(--dark);
					color: white;
					border: none;
					border-radius: 5px;
					cursor: pointer;
				}
				button:hover {
					background: var(--darker);
				}
				.messages {
					margin-top: 30px;
					text-align: left;
					max-width: 400px;
					margin-left: auto;
					margin-right: auto;
				}
				.message {
					background: white;
					padding: 10px;
					border-radius: 5px;
					margin-bottom: 10px;
					box-shadow: 0 2px 4px rgba(0,0,0,0.1);
				}
			</style>
		</head>
		<body>
			<h1>Halla babyyyy boomsi</h1>
			<p>Nettsida mi lever, og nå kan du legge igjen en melding:</p>

			<form method="POST" action="/">
				<input type="text" name="message" placeholder="Skriv en melding..." required />
				<button type="submit">Post</button>
			</form>

			<div class="messages">
				<h2>Meldinger:</h2>
				%s
			</div>
		</body>
		</html>
		`, renderMessages())
	})

	log.Printf("Listening on port %s...\n", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

func renderMessages() string {
	mu.Lock()
	defer mu.Unlock()
	if len(messages) == 0 {
		return "<p>Ingen meldinger ennå.</p>"
	}
	htmlStr := ""
	for _, m := range messages {
		htmlStr += fmt.Sprintf("<div class='message'>%s</div>", m)
	}
	return htmlStr
}

