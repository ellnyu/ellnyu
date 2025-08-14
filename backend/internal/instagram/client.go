package instagram

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type Client struct {
	Token  string
	UserID string
}

func NewClient(token, userID string) *Client {
	return &Client{Token: token, UserID: userID}
}

func (c *Client) GetStories() ([]Story, error) {
	url := fmt.Sprintf(
		"https://graph.instagram.com/%s/stories?fields=id,media_url,caption&access_token=%s",
		c.UserID,
		c.Token,
	)

	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("Instagram API error: %s", resp.Status)
	}

	var storiesResp StoriesResponse
	if err := json.NewDecoder(resp.Body).Decode(&storiesResp); err != nil {
		return nil, err
	}

	return storiesResp.Data, nil
}
