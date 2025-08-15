FROM golang:1.22 AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o server .

FROM gcr.io/distroless/base-debian12
WORKDIR /app
COPY --from=builder /app/server .
EXPOSE 8080
CMD ["./server"]

