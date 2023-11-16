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
            // Ustawienie wartości domyślnych dla brakujących pól
            obrazy = data.obrazy.map(obraz => ({
                id: obraz.id || 0,
                tytul: obraz.tytul || "Brak tytułu",
                lokalizacja: obraz.lokalizacja || "Brak lokalizacji",
                odpowiedz: obraz.odpowiedz || "Brak odpowiedzi"
            }));

            zaladujLosowyObraz();
        } else {
            throw new Error('Niepoprawny format danych w pliku JSON.');
        }
    } catch (error) {
        console.error('Błąd pobierania danych:', error);
    }
}



function zaladujLosowyObraz() {
    const minId = 1;
    const maxId = 4;
    obecnyObrazIndex = Math.floor(Math.random() * (maxId - minId + 1)) + minId;
    zaladujObraz();
}


function zaladujObraz() {
    const aktualnyObraz = obrazy[obecnyObrazIndex];
    obraz.src = aktualnyObraz.lokalizacja;
    poprawnaOdpowiedzElement.textContent = `Poprawna Odpowiedź: ${aktualnyObraz.odpowiedz}`;
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
        document.getElementById("wynik").textContent = "Odpowiedz poprawna!";
        
        // Przejdz do nastepnego obrazu po krótkim opóznieniu
        // Przejdz do nastepnego obrazu
obecnyObrazIndex++;
if (obecnyObrazIndex < obrazy.length) {
    zaladujObraz();
    document.getElementById("odpowiedz").value = "";
    document.getElementById("wprowadzonaOdpowiedz").textContent = ""; // Wyczysc wyswietlona odpowiedz
    document.getElementById("wynik").textContent = ""; // Wyczysc komunikat o wyniku
} else {
    document.getElementById("wynik").textContent = "Gra zakonczona!";
}
 // Opóznienie 1000 milisekund (1 sekunda)
    } else {
        document.getElementById("wynik").textContent = "Odpowiedz niepoprawna. Spróbuj ponownie.";
    }
}



// Obsługa klawiatury
document.addEventListener('keydown', function (event) {
    if (event.key.length === 1) {
        dodajLitera(event.key.toUpperCase());
    } else if (event.key === 'Backspace') {
        usunLitera();
    } else if (event.key === 'Enter') {
        dodajLitera('Enter', event);
    }
});

// Rozpocznij grę po załadowaniu strony
document.addEventListener('DOMContentLoaded', function () {
    pobierzBazeDanych();
});

