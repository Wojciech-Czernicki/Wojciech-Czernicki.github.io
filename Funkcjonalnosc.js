// Funkcjonalnosc.js
var obrazy;
var wprowadzonaOdpowiedz = '';
var obraz = document.getElementById('obraz');
var obecnyObrazIndex = 0;
var poprawnaOdpowiedzElement = document.getElementById('poprawnaOdpowiedz');

let wprowadzonaOdpowiedz = '';
const obraz = document.getElementById('obraz');
let obecnyObrazIndex = 0;
const poprawnaOdpowiedzElement = document.getElementById('poprawnaOdpowiedz');
const wprowadzoneLiteryContainer = document.getElementById('wprowadzoneLitery');

async function pobierzBazeDanych() {
    try {
        const response = await fetch('Baza.json');
        if (!response.ok) {
            throw new Error(`Nieudane pobieranie danych. Kod odpowiedzi: ${response.status}`);
        }
        const data = await response.json();

        if (Array.isArray(data.obrazy)) {
            // Ustawienie warto�ci domy�lnych dla brakuj�cych p�l
            obrazy = data.obrazy.map(obraz => ({
                id: obraz.id || 0,
                tytul: obraz.tytul || "Brak tytu�u",
                lokalizacja: obraz.lokalizacja || "Brak lokalizacji",
                odpowiedz: obraz.odpowiedz || "Brak odpowiedzi"
            }));

            zaladujLosowyObraz();
        } else {
            throw new Error('Niepoprawny format danych w pliku JSON.');
        }
    } catch (error) {
        console.error('B��d pobierania danych:', error);
    }
    const response = await fetch('Baza_zdjec.json');
    const data = await response.json();
    obrazy = data.obrazy;
    zaladujLosowyObraz();
}



function zaladujLosowyObraz() {
    const minId = 1;
    const maxId = 4;
    obecnyObrazIndex = Math.floor(Math.random() * (maxId - minId + 1)) + minId;
    obecnyObrazIndex = Math.floor(Math.random() * obrazy.length);
    zaladujObraz();
}


function zaladujObraz() {
    const aktualnyObraz = obrazy[obecnyObrazIndex];
    obraz.src = aktualnyObraz.lokalizacja;
    poprawnaOdpowiedzElement.textContent = `Poprawna Odpowied�: ${aktualnyObraz.odpowiedz}`;
    poprawnaOdpowiedzElement.textContent = `Poprawna Odpowiedź: ${aktualnyObraz.odpowiedz}`;
}
function dodajLitera(litera, event) {
    const enterKeyCode = 13;
    if (litera === 'Enter' || (event && event.keyCode === enterKeyCode)) {

function dodajLitera(litera) {
    const enterKeyCode = 13; // Kod klawisza Enter
    if (litera === 'Enter' || event.keyCode === enterKeyCode) {
        sprawdzOdpowiedz();
        return;
    }
    if (wprowadzonaOdpowiedz.length < 25) {
        wprowadzonaOdpowiedz += litera;
        aktualizujWprowadzonaOdpowiedz();
        dodajDoWprowadzonychLiter(litera);
    }
}

function dodajDoWprowadzonychLiter(litera) {
    const literaElement = document.createElement('div');
    literaElement.classList.add('wprowadzona-litera');
    literaElement.textContent = litera;
    wprowadzoneLiteryContainer.appendChild(literaElement);
}

function usunLitera() {
    wprowadzonaOdpowiedz = wprowadzonaOdpowiedz.slice(0, -1);
    aktualizujWprowadzonaOdpowiedz();
    usunZwprowadzonychLiter();
}

function usunZwprowadzonychLiter() {
    const ostatniaLitera = wprowadzoneLiteryContainer.lastElementChild;
    if (ostatniaLitera) {
        wprowadzoneLiteryContainer.removeChild(ostatniaLitera);
    }
}

function aktualizujWprowadzonaOdpowiedz() {
    const poprawnaOdpowiedz = obrazy[obecnyObrazIndex].odpowiedz.toLowerCase();

    if (odpowiedz === poprawnaOdpowiedz) {
        document.getElementById("wynik").textContent = "Odpowied� poprawna!";
        document.getElementById("wynik").textContent = "Odpowiedź poprawna!";
    } else {
        document.getElementById("wynik").textContent = "Odpowied� niepoprawna. Spr�buj ponownie.";
        document.getElementById("wynik").textContent = "Odpowiedź niepoprawna. Spróbuj ponownie.";
    }

    // Przejd� do nast�pnego obrazu
    // Przejdź do następnego obrazu
    obecnyObrazIndex++;
    if (obecnyObrazIndex < obrazy.length) {
        zaladujObraz();
        document.getElementById("odpowiedz").value = "";
        document.getElementById("wprowadzonaOdpowiedz").textContent = ""; // Wyczy�� wy�wietlon� odpowied�
        document.getElementById("wprowadzonaOdpowiedz").textContent = "";
        usunWprowadzoneLitery();
    } else {
        document.getElementById("wynik").textContent = "Gra zako�czona!";
        document.getElementById("wynik").textContent = "Gra zakończona!";
    }
}

// Obs�uga klawiatury
document.addEventListener('keydown', function (event) {
function usunWprowadzoneLitery() {
    wprowadzoneLiteryContainer.innerHTML = '';
}

// Obsługa klawiatury
document.addEventListener('keydown', function(event) {
    if (event.key.length === 1) {
        dodajLitera(event.key.toUpperCase());
    } else if (event.key === 'Backspace') {
    }
});

// Rozpocznij gr� po za�adowaniu strony
document.addEventListener('DOMContentLoaded', function () {
// Rozpocznij grę po załadowaniu strony
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
