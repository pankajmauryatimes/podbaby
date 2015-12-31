package api

import (
	"github.com/danjac/podbaby/database"
	"github.com/danjac/podbaby/models"
	"github.com/unrolled/render"
	"net/http"
	"net/http/httptest"
	"testing"
)

type mockPodcastsDB struct{}

func (db *mockPodcastsDB) SelectSubscribed(_, _ int64) (*models.PodcastList, error) {
	return nil, nil
}

func (db *mockPodcastsDB) SelectByChannelID(_, _, _ int64) (*models.PodcastList, error) {
	return nil, nil
}

func (db *mockPodcastsDB) Search(_ string, _ int64) ([]models.Podcast, error) {
	return nil, nil
}

func (db *mockPodcastsDB) Create(_ *models.Podcast) error { return nil }

func (db *mockPodcastsDB) SelectBookmarked(userID, page int64) (*models.PodcastList, error) {
	result := &models.PodcastList{}
	result.Podcasts = []models.Podcast{
		models.Podcast{
			ID:    100,
			Title: "testing",
		},
	}
	result.Page = &models.Page{}
	return result, nil
}

func TestGetBookmarksIfOk(t *testing.T) {

	user := &models.User{
		ID: 10,
	}

	getContext = mockGetContextWithUser(user)

	req, _ := http.NewRequest("GET", "/", nil)
	w := httptest.NewRecorder()
	s := &Server{
		DB: &database.DB{
			Podcasts: &mockPodcastsDB{},
		},
		Render: render.New(),
	}
	s.getBookmarks(w, req)

	if w.Code != http.StatusOK {
		t.Fail()
	}

}
