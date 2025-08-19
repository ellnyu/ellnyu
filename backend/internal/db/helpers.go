package db

import (
	"context"
	"errors"
	"fmt"
	"github.com/jackc/pgx/v5"
	"time"
)

func GetOrCreateCategoryID(name string) (int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var id int
	err := Pool.QueryRow(ctx, `
		SELECT id
		FROM ellnyu.category
		WHERE name = $1
	`, name).Scan(&id)

	if err == nil {
		return id, nil
	}

	if !errors.Is(err, pgx.ErrNoRows) {
		return -1, fmt.Errorf("failed to lookup tag: %w", err)
	}

	err = Pool.QueryRow(ctx, `
		INSERT INTO ellnyu.category (name)
		VALUES ($1)
		RETURNING id
	`, name).Scan(&id)

	if err != nil {
		return -1, fmt.Errorf("failed to insert new tag: %w", err)
	}

	return id, nil
}

func GetOrCreateTagID(name string) (int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var id int
	err := Pool.QueryRow(ctx, `
		SELECT id
		FROM ellnyu.tags
		WHERE name = $1
	`, name).Scan(&id)

	if err == nil {
		return id, nil
	}

	if !errors.Is(err, pgx.ErrNoRows) {
		return -1, fmt.Errorf("failed to lookup tag: %w", err)
	}

	err = Pool.QueryRow(ctx, `
		INSERT INTO ellnyu.tags (name)
		VALUES ($1)
		RETURNING id
	`, name).Scan(&id)

	if err != nil {
		return -1, fmt.Errorf("failed to insert new tag: %w", err)
	}

	return id, nil
}
