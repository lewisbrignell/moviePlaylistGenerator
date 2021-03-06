const app = {};

app.apiKey = `aaf61b600bd7e26a96f6e5cf0dc95050`;

app.searchResults = [];

app.userPickIDs = [];

app.bigMovieList = [];

app.smallMovieList = [];

app.displaySearchResults = () => {

    $('.searchResults').empty();

    for (x = 0; x < app.searchResults.length; x++) {
        $('.searchResults').append(`
        <li value="${app.searchResults[x].id} " id="${app.searchResults[x].id}">
            <div class="actorTag animated 1 tada delay-0s">
                <div class="actorName">${app.searchResults[x].name}</div>
            </div>
        </li>`);

        if (app.searchResults[x].profile_path == null) {
            $(`.searchResults #${app.searchResults[x].id} .actorTag`).css(
                'background-image', `url(./image/defaultPerson.jpg)`
            );
        } else {
            $(`.searchResults #${app.searchResults[x].id} .actorTag`).css(
                'background-image', `url('https://image.tmdb.org/t/p/w180_and_h180_face${app.searchResults[x].profile_path}')`
            );
        }
    };
};

app.displayPlaylist = () => {

    $('.playlist').empty();

    $('.playlistSection').css('padding','50px 0')

    for (i = 0; i < app.smallMovieList.length; i++) {
        $('.playlist').append(`<li class='playlistItem' id='${i}'>
            ${app.smallMovieList[i].poster_path == null ?
                `<div class='posterContainer'>
                <img src='./image/defaultPoster.jpg'>
            </div>`
                :
                `<div class='posterContainer'>
                <img src='https://image.tmdb.org/t/p/w185_and_h278_bestv2${app.smallMovieList[i].poster_path}'>
            </div>`
            }
        
            <div class='infoTextContainer'>
                <h2>${app.smallMovieList[i].original_title}</h2>
                <div class='ratingBar'><i class="fas fa-smile"></i> Rating: ${app.smallMovieList[i].vote_average}
                    <span>${app.smallMovieList[i].release_date}</h4>
                </div>
                <p>${app.smallMovieList[i].overview}</p>
            </div>
            <div class='buttonHolder'>
                <button class='pushTop'><i class="fas fa-level-up-alt"></i></button>
                <button class='skip'><i class="fas fa-times"></i></button>
                <button class='moveUp'><i class="fas fa-chevron-up"></i></button>
                <button class='moveDown'><i class="fas fa-chevron-down"></i></button>
            </div>
        </li>`);
    };

    $("html, body").animate({ scrollTop: "1000px" });
};

app.getActors = (actorName) => {

    let peopleList = [];
    let actorList = [];
    let fiveActorsMaxList = [];

    $.ajax({
        url: `https://api.themoviedb.org/3/search/person?api_key=${app.apiKey}&language=en-US&query=${actorName}&page=1&include_adult=false`,
        method: 'GET',
        dataType: 'json',
    }).then(function (data) {
        peopleList = data.results;
    }).then(function () {
        for (person in peopleList) {
            if (peopleList[person].known_for_department == 'Acting') {
                actorList.push(peopleList[person]);
            };
        };

        if (actorList.length === 0) {
            alert('Sorry! No actors found.');
        } else if (actorList.length > 5) {
            fiveActorsMaxList = actorList.slice(0, 5);
        } else {
            fiveActorsMaxList = actorList;
        }

        $("html, body").animate({ scrollTop: "400px"});

    }).then(function () {
        app.searchResults = fiveActorsMaxList;
    }).then(function () {
        app.displaySearchResults();
    });
};

$(function () {
    $('.searchButton').on('click', function(){
        const name = $('.searchBox').val();
        app.getActors(name);
    })
   

    $('.searchResults').on('click', 'li', function () {

        app.userPickIDs = [];
        app.userPickIDs.push($(this).val());

        let selectedActor = app.searchResults.filter((human) => human.id === app.userPickIDs[0]);

        $('.selectedActor').empty().append(`
        <li value="${selectedActor[0].id} " id="${selectedActor[0].id}">
            <div class="actorTag animated 1 tada delay-0s">
                <div class="actorName">${selectedActor[0].name}</div>
            </div>
        </li>`);
        if (selectedActor[0].profile_path == null) {
            $(`.selectedActor #${selectedActor[0].id} .actorTag`).css(
                'background-image', `url(./image/defaultPerson.jpg)`
            );
        } else {
            $(`.selectedActor #${selectedActor[0].id} .actorTag`).css(
                'background-image', `url('https://image.tmdb.org/t/p/w180_and_h180_face${selectedActor[0].profile_path}')`
            );
        }
    });

    $('.playlistButton').mouseover(function () {
        $('.neon').css('animation', 'neon 1.5s ease-in-out 10 alternate');
    });

    $('.playlistButton').on('click', function () {
        $.ajax({
            url: `https://api.themoviedb.org/3/person/${app.userPickIDs[0]}/movie_credits?api_key=${app.apiKey}&language=en-US`,
            method: 'GET',
            dataType: 'json',
        }).then(function (data) {
            app.bigMovieList = data.cast;
        }).then(function(){
            app.smallMovieList = app.bigMovieList.slice(0, 10);
        }).then(function () {
            app.displayPlaylist();
        });
    });

    $('.playlist').on('click', '.skip', function() {
        let arrayLocation = $(this).parent().parent().attr('id');
        app.smallMovieList.splice(arrayLocation, 1);
        app.displayPlaylist();
    });

    $('.playlist').on('click', '.pushTop', function() {
        let arrayLocation = $(this).parent().parent().attr('id');
        let topValue = app.smallMovieList[arrayLocation];
        app.smallMovieList.splice(arrayLocation, 1);
        app.smallMovieList.unshift(topValue);
        app.displayPlaylist();
    });

    $('.playlist').on('click', '.moveUp', function(){
        let arrayLocation = parseInt($(this).parent().parent().attr('id'));
        let tem = app.smallMovieList[arrayLocation];
        app.smallMovieList[arrayLocation] = app.smallMovieList[arrayLocation - 1];
        app.smallMovieList[arrayLocation - 1] = tem;
        app.displayPlaylist();
    })

    $('.playlist').on('click', '.moveDown', function () {
        let arrayLocation = parseInt($(this).parent().parent().attr('id'));
        let tem = app.smallMovieList[arrayLocation];
        app.smallMovieList[arrayLocation] = app.smallMovieList[arrayLocation + 1];
        app.smallMovieList[arrayLocation + 1] = tem;
        app.displayPlaylist();
    })
});
