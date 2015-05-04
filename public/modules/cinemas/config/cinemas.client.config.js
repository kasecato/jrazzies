'use strict';

// Configuring the Articles module
angular.module('cinemas').run(['Menus',
    function (Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Cinemas', 'cinemas', 'dropdown', '/cinemas(/create)?');
        Menus.addSubMenuItem('topbar', 'cinemas', 'List Cinemas', 'cinemas');
        Menus.addSubMenuItem('topbar', 'cinemas', 'New Cinema', 'cinemas/create');
    }
]);
