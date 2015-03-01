var linkedinOnLoad = function () {
    if (!IN.User.isAuthorized()) {
        IN.User.authorize(function () {
            console.log('Logging in to LinkedIn');
            loggedInCallback();
        });
    } else {
        console.log("Already logged in to LinkedIn");
        loggedInCallback();
    }
};

var loggedInCallback = function () {
    console.log("Logged in to LinkedIn");
    console.log(IN.User);
    // TODO: replace ID dynamically
    // TODO: DOESN'T WORK!
    IN.API.Raw("/people-search?keywords=orange%20shake&sort=connections?format=json").method("GET").body().result(function (person) {
        console.log(person);
        $('#linkedin-name').text(person.firstName + " " + person.lastName);
        $('#linkedin-headline').text(person.headline);
    });
};