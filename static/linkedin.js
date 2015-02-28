var linkedinOnLoad = function () {
    if (!IN.User.isAuthorized()) {
        IN.User.authorize(authorizeCallback);
    } else {
        console.log("Already logged in");
        IN.API.Raw("/people/~?format=json").method("GET").body().result(function (person) {
            console.log("Welcome " + person.firstName + " " + person.lastName);
        });
    }
};

var authorizeCallback = function() {
    console.log('Logged in');
};