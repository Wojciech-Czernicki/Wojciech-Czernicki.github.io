// Funkcjonalnosc.js
var obrazy;
var wprowadzonaOdpowiedz = '';
var obraz = document.getElementById('obraz');
var obecnyObrazIndex = 0;
var poprawnaOdpowiedzElement = document.getElementById('poprawnaOdpowiedz');
const wprowadzoneLiteryContainer = document.getElementById('wprowadzoneLitery');

async function pobierzBazeDanych() {
    try {
        const response = await fetch('Baza.json');
        if (!response.ok) {
            throw new Error(`Nieudane pobieranie danych. Kod odpowiedzi: ${response.status}`);
        }
        const data = await response.json();

        if (Array.isArray(data.obrazy)) {
            // Ustawienie wartosci domyslnych dla brakujacych pól
            obrazy = data.obrazy.map(obraz => ({
                id: obraz.id || 0,
                tytul: obraz.tytul || "Brak tytulu",
                lokalizacja: obraz.lokalizacja || "Brak lokalizacji",
                odpowiedz: obraz.odpowiedz || "Brak odpowiedzi"
            }));

            zaladujLosowyObraz();
        } else {
            throw new Error('Niepoprawny format danych w pliku JSON.');
        }
    } catch (error) {
        console.error('Blad pobierania danych:', error);
    }
}

function zaladujLosowyObraz() {
    obecnyObrazIndex = Math.floor(Math.random() * obrazy.length);
    zaladujObraz();
}

function zaladujObraz() {
    const aktualnyObraz = obrazy[obecnyObrazIndex];
    obraz.src = aktualnyObraz.lokalizacja;
    poprawnaOdpowiedzElement.textContent = `Poprawna Odpowiedz: ${aktualnyObraz.odpowiedz}`;
}

function dodajLitera(litera, event) {
    const enterKeyCode = 13; // Kod klawisza Enter
    if (litera === 'Enter' || (event && event.keyCode === enterKeyCode)) {
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
    const odpowiedz = wprowadzonaOdpowiedz.toLowerCase();

    if (odpowiedz === poprawnaOdpowiedz) {
        document.getElementById("wynik").textContent = "Odpowiedz poprawna!";
    } else {
        document.getElementById("wynik").textContent = "Odpowiedz niepoprawna. Spróbuj ponownie.";
    }

    obecnyObrazIndex++;
    if (obecnyObrazIndex < obrazy.length) {
        zaladujObraz();
        document.getElementById("odpowiedz").value = "";
        aktualizujWprowadzonaOdpowiedz();
        usunWprowadzoneLitery();
    } else {
        document.getElementById("wynik").textContent = "Gra zakonczona!";
    }
}

document.addEventListener('keydown', function (event) {
    if (event.key.length === 1) {
        dodajLitera(event.key.toUpperCase(), event);
    } else if (event.key === 'Backspace') {
        usunLitera();
    }
});

document.addEventListener('DOMContentLoaded', function () {
    pobierzBazeDanych();
});

function usunWprowadzoneLitery() {
    wprowadzoneLiteryContainer.innerHTML = '';
}
