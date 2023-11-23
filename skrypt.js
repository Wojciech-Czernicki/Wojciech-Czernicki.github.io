document.getElementById('startButton').addEventListener('click', function () {
    // Po klikniêciu przycisku "Start", przekieruj u¿ytkownika do strony gry.
    window.location.href = 'Glowny.html';
    
    // Dodaj funkcje do sprawdzenia, czy gra zostala juz rozpoczeta
function czyGraRozpoczeta() {
    return localStorage.getItem("graRozpoczeta") === "true";
}

// Funkcja, która cofnie uzytkownika do strony glównej
function cofnijDoStronyGlownej() {
    window.location.href = "index.html";
}

// Funkcja rozpoczynajaca gre
function rozpocznijGre() {
    // Ustaw lokalne skladowanie, aby oznaczyc, ze gra zostala rozpoczeta
    localStorage.setItem("graRozpoczeta", "true");

    // Ukryj ekran poczatkowy
    document.getElementById('obrazContainer').style.display = 'none';
    document.getElementById('startButton').style.display = 'none';

    // Rozpocznij gre
    pobierzBazeDanych();
}

// Sprawdz, czy gra zostala juz rozpoczeta po zaladowaniu strony
document.addEventListener('DOMContentLoaded', function () {
    if (czyGraRozpoczeta()) {
        cofnijDoStronyGlownej();
    }
});

});
