$(document).ready(function () {
    $('#search-button').click(function () {
        const movieTitle = $('#movie-input').val().trim();
        if (!movieTitle) {
            $('#movie-output').html('<p class="text-danger">Please enter a movie title.</p>');
            return;
        }

        const omdbApiKey = 'e849926b'; // Replace with your OMDb API key
        const omdbUrl = `https://www.omdbapi.com/?t=${encodeURIComponent(movieTitle)}&apikey=${omdbApiKey}`;

        // Clear previous outputs
        $('#movie-output').empty();
        $('#songs-output').empty();

        // Fetch Movie details from OMDb
        $.get(omdbUrl, function (data) {
            if (data.Response === "True") {
                const movieDetails = `
                    <div class="card">
                        <div class="row no-gutters">
                            <div class="col-md-4">
                                <img src="${data.Poster}" class="card-img-top" alt="${data.Title}">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <h5 class="card-title">${data.Title} (${data.Year})</h5>
                                    <p class="card-text"><strong>Director:</strong> ${data.Director}</p>
                                    <p class="card-text"><strong>Cast:</strong> ${data.Actors}</p>
                                    <p class="card-text"><strong>Genre:</strong> ${data.Genre}</p>
                                    <p class="card-text"><strong>Plot:</strong> ${data.Plot}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                $('#movie-output').html(movieDetails);
                searchSongs(movieTitle); // Trigger search for songs
            } else {
                $('#movie-output').html(`<p class="text-danger">${data.Error}</p>`);
            }
        }).fail(function() {
            $('#movie-output').html('<p class="text-danger">Failed to fetch movie data. Please try again.</p>');
        });
    });

    // Function to search YouTube for songs based on the movie title
    function searchSongs(movieTitle) {
        const youtubeApiKey = 'AIzaSyD-xONm4ji8hAxKy6BmyZlArVofDMmffF0'; // Replace with your YouTube API key
        const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(movieTitle)}+soundtrack&type=video&key=${youtubeApiKey}`;

        // Fetch song list from YouTube API
        $.get(youtubeUrl, function (data) {
            if (data.items.length > 0) {
                let songsList = '<h3>Songs from this movie:</h3><ul class="list-group">';
                data.items.forEach(item => {
                    const videoId = item.id.videoId;
                    const songTitle = item.snippet.title;
                    songsList += `
                        <li class="list-group-item">
                            <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">${songTitle}</a>
                            <button class="btn btn-sm btn-secondary play-button" data-video-id="${videoId}">Play</button>
                        </li>
                    `;
                });
                songsList += '</ul>';
                $('#songs-output').html(songsList);

                // Add click event for the play buttons
                $('.play-button').click(function () {
                    const videoId = $(this).data('video-id');
                    playSong(videoId);
                });
            } else {
                $('#songs-output').html('<p>No songs found for this movie.</p>');
            }
        }).fail(function() {
            $('#songs-output').html('<p class="text-danger">Failed to fetch song data. Please try again.</p>');
        });
    }

    // Function to play the selected song in a new tab
    function playSong(videoId) {
        window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
    }
});
