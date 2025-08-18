package auth

import (
	"context"
)

type userKeyType string

var userKey = userKeyType("user")

func WithUser(ctx context.Context, claims *Claims) context.Context {
	return context.WithValue(ctx, userKey, claims)
}

func GetUser(ctx context.Context) (*Claims, bool) {
	claims, ok := ctx.Value(userKey).(*Claims)
	return claims, ok
}
