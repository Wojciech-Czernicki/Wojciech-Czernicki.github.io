// Funkcjonalnosc.js
var obrazy;
var wprowadzonaOdpowiedz = '';
var obraz = document.getElementById('obraz');
var obecnyObrazIndex = 0;
var poprawnaOdpowiedzElement = document.getElementById('poprawnaOdpowiedz');


async function pobierzBazeDanych() {
    try {
        const response = await fetch('Baza.json');
        if (!response.ok) {
            throw new Error(`Nieudane pobieranie danych. Kod odpowiedzi: ${response.status}`);
        }
        const data = await response.json();

        if (Array.isArray(data.obrazy)) {
            // Ustawienie wartoœci domyœlnych dla brakuj¹cych pól
            obrazy = data.obrazy.map(obraz => ({
                id: obraz.id || 0,
                tytul: obraz.tytul || "Brak tytu³u",
                lokalizacja: obraz.lokalizacja || "Brak lokalizacji",
                odpowiedz: obraz.odpowiedz || "Brak odpowiedzi"
            }));

            zaladujLosowyObraz();
        } else {
            throw new Error('Niepoprawny format danych w pliku JSON.');
        }
    } catch (error) {
        console.error('B³¹d pobierania danych:', error);
    }
}



function zaladujLosowyObraz() {
    const minId = 2;
    const maxId = 4;
    obecnyObrazIndex = Math.floor(Math.random() * (maxId - minId + 1)) + minId;
    zaladujObraz();
}


function zaladujObraz() {
    const aktualnyObraz = obrazy[obecnyObrazIndex];
    obraz.src = aktualnyObraz.lokalizacja;
    poprawnaOdpowiedzElement.textContent = `Poprawna OdpowiedŸ: ${aktualnyObraz.odpowiedz}`;
}
function dodajLitera(litera, event) {
    const enterKeyCode = 13;
    if (litera === 'Enter' || (event && event.keyCode === enterKeyCode)) {
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
        document.getElementById("wynik").textContent = "OdpowiedŸ poprawna!";
    } else {
        document.getElementById("wynik").textContent = "OdpowiedŸ niepoprawna. Spróbuj ponownie.";
    }

    // PrzejdŸ do nastêpnego obrazu
    obecnyObrazIndex++;
    if (obecnyObrazIndex < obrazy.length) {
        zaladujObraz();
        document.getElementById("odpowiedz").value = "";
        document.getElementById("wprowadzonaOdpowiedz").textContent = ""; // Wyczyœæ wyœwietlon¹ odpowiedŸ
    } else {
        document.getElementById("wynik").textContent = "Gra zakoñczona!";
    }
}

// Obs³uga klawiatury
document.addEventListener('keydown', function (event) {
    if (event.key.length === 1) {
        dodajLitera(event.key.toUpperCase());
    } else if (event.key === 'Backspace') {
        usunLitera();
    } else if (event.key === 'Enter') {
        dodajLitera('Enter', event);
    }
});

// Rozpocznij grê po za³adowaniu strony
document.addEventListener('DOMContentLoaded', function () {
    pobierzBazeDanych();
});

function rozpocznijGre() {
    // Ukryj ekran pocz¹tkowy
    document.getElementById('startScreen').style.display = 'none';

    // Poka¿ ekran gry
    document.getElementById('graScreen').style.display = 'flex';

    // Rozpocznij grê
    pobierzBazeDanych();
}
