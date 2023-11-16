// Funkcjonalnosc.js
var wprowadzonaOdpowiedz = '';
var obraz = document.getElementById('obraz');
var obecnyObrazIndex = 0;
var poprawnaOdpowiedzElement = document.getElementById('poprawnaOdpowiedz');

async function pobierzBazeDanych() {
    const response = await fetch('Baza_zdjec.json');
    const data = await response.json();
    obrazy = data.obrazy;
    zaladujLosowyObraz();
}

function zaladujLosowyObraz() {
    obecnyObrazIndex = Math.floor(Math.random() * obrazy.length);
    zaladujObraz();
}

function zaladujObraz() {
    const aktualnyObraz = obrazy[obecnyObrazIndex];
    obraz.src = aktualnyObraz.lokalizacja;
    poprawnaOdpowiedzElement.textContent = `Poprawna Odpowied�: ${aktualnyObraz.odpowiedz}`;
}

function dodajLitera(litera) {
    const enterKeyCode = 13; // Kod klawisza Enter
    if (litera === 'Enter' || event.keyCode === enterKeyCode) {
        sprawdzOdpowiedz();
        return;
    }

    if (wprowadzonaOdpowiedz.length < 25) {
        wprowadzonaOdpowiedz += litera;
        aktualizujWprowadzonaOdpowiedz();
    }
}

function usunLitera() {
    wprowadzonaOdpowiedz = wprowadzonaOdpowiedz.slice(0, -1);
    aktualizujWprowadzonaOdpowiedz();
}

function aktualizujWprowadzonaOdpowiedz() {
    document.getElementById('wprowadzonaOdpowiedz').textContent = wprowadzonaOdpowiedz;
}

function sprawdzOdpowiedz() {
    const odpowiedz = document.getElementById("odpowiedz").value.toLowerCase();
    const poprawnaOdpowiedz = obrazy[obecnyObrazIndex].odpowiedz.toLowerCase();

    if (odpowiedz === poprawnaOdpowiedz) {
        document.getElementById("wynik").textContent = "Odpowied� poprawna!";
    } else {
        document.getElementById("wynik").textContent = "Odpowied� niepoprawna. Spr�buj ponownie.";
    }

    // Przejd� do nast�pnego obrazu
    obecnyObrazIndex++;
    if (obecnyObrazIndex < obrazy.length) {
        zaladujObraz();
        document.getElementById("odpowiedz").value = "";
        document.getElementById("wprowadzonaOdpowiedz").textContent = ""; // Wyczy�� wy�wietlon� odpowied�
    } else {
        document.getElementById("wynik").textContent = "Gra zako�czona!";
    }
}

// Obs�uga klawiatury
document.addEventListener('keydown', function(event) {
    if (event.key.length === 1) {
        dodajLitera(event.key.toUpperCase());
    } else if (event.key === 'Backspace') {
        usunLitera();
    } else if (event.key === 'Enter') {
        dodajLitera('Enter', event);
    }
});

// Rozpocznij gr� po za�adowaniu strony
document.addEventListener('DOMContentLoaded', function() {
    pobierzBazeDanych();
});

function rozpocznijGre() {
    // Ukryj ekran pocz�tkowy
    document.getElementById('startScreen').style.display = 'none';
    
    // Poka� ekran gry
    document.getElementById('graScreen').style.display = 'flex';

    // Rozpocznij gr�
    pobierzBazeDanych();
}