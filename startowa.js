document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startButton');

    startButton.addEventListener('click', function() {
        // Po klikni�ciu przycisku, przekieruj do strony gry
        window.location.href = 'gra.html';
    });
});
