document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startButton');

    startButton.addEventListener('click', function() {
        // Po klikniêciu przycisku, przekieruj do strony gry
        window.location.href = 'gra.html';
    });
});
