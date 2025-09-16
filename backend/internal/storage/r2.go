package storage

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

type R2 struct {
	Client *minio.Client
	Bucket string
}

func NewR2(endpoint, accessKey, secretKey, bucket string) (*R2, error) {
	client, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKey, secretKey, ""),
		Secure: true,
	})
	if err != nil {
		return nil, err
	}

	// Make sure bucket exists
	ctx := context.Background()
	exists, err := client.BucketExists(ctx, bucket)
	if err != nil {
		return nil, err
	}
	if !exists {
		if err := client.MakeBucket(ctx, bucket, minio.MakeBucketOptions{}); err != nil {
			return nil, err
		}
		log.Println("Created bucket:", bucket)
	}

	return &R2{Client: client, Bucket: bucket}, nil
}

func (r2 *R2) UploadStoryMedia(ctx context.Context, storyID string, mediaType string, url string) (string, error) {
	resp, err := http.Get(url)
	if err != nil {
		return "", fmt.Errorf("failed to fetch media: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("bad status downloading media: %s", resp.Status)
	}

	var ext string
	switch mediaType {
	case "IMAGE":
		ext = ".jpg"
	case "VIDEO":
		ext = ".mp4"
	default:
		ext = ""
	}

	objectName := storyID + ext

	_, err = r2.Client.PutObject(ctx, r2.Bucket, objectName, resp.Body, resp.ContentLength, minio.PutObjectOptions{
		ContentType: resp.Header.Get("Content-Type"),
	})
	if err != nil {
		return "", fmt.Errorf("failed to upload to R2: %w", err)
	}

	// Public URL depends on how you configure R2 bucket
	// (with a custom domain via Cloudflare Pages/Workers)
	publicURL := fmt.Sprintf("https://%s.r2.cloudflarestorage.com/%s/%s", "<accountid>", r2.Bucket, objectName)

	return publicURL, nil
}
