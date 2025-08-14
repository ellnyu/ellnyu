package instagram

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func GetInstagramUser(token string) (map[string]interface{}, error) {
	url := fmt.Sprintf("https://graph.instagram.com/me?fields=id,username&access_token=%s", token)

	resp, err := http.Get(url)
	if err != nil {
		return nil, fmt.Errorf("failed to call Instagram API: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("Instagram API error: %s", resp.Status)
	}

	var result map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, fmt.Errorf("failed to parse response: %w", err)
	}

	return result, nil
}
