// Funkcjonalnosc.js
var obrazy;
var wprowadzonaOdpowiedz = '';
var obraz = document.getElementById('obraz');
var obecnyObrazIndex = 0;
var poprawnaOdpowiedzElement = document.getElementById('poprawnaOdpowiedz');
var iloscNiepoprawnychOdpowiedzi = 0; // Dodaj zmienna do sledzenia liczby niepoprawnych odpowiedzi
const maksymalnaIloscNiepoprawnychOdpowiedzi = 5; // Ustaw maksymalna ilosc niepoprawnych odpowiedzi

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
    const minId = 2;
    const maxId = 26;
    obecnyObrazIndex = Math.floor(Math.random() * (maxId - minId + 1)) + minId;
    zaladujObraz();
}


function zaladujObraz() {
    obecnyObrazIndex = losujNastepnyObrazIndex();
    const aktualnyObraz = obrazy[obecnyObrazIndex];
    obraz.src = aktualnyObraz.lokalizacja;
    poprawnaOdpowiedzElement.textContent = `Poprawna Odpowiedź: ${aktualnyObraz.odpowiedz}`;
}

function losujNastepnyObrazIndex() {
    const minId = 2;
    const maxId = 26;
    let losowyIndex;
    do {
        losowyIndex = Math.floor(Math.random() * (maxId - minId + 1)) + minId;
    } while (losowyIndex === obecnyObrazIndex); // Unikaj powtarzania sie tego samego obrazu

    return losowyIndex;
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
    const odpowiedz = wprowadzonaOdpowiedz.toUpperCase();
    const poprawnaOdpowiedz = obrazy[obecnyObrazIndex].odpowiedz.toUpperCase();

    console.log("odpowiedz:", odpowiedz);
    console.log("poprawnaOdpowiedz:", poprawnaOdpowiedz);

    if (odpowiedz === poprawnaOdpowiedz) {
        document.getElementById("wynik").textContent = "Odpowiedz poprawna!";
        
        // Przejdz do nastepnego obrazu po kr�tkim op�znieniu
        obecnyObrazIndex++;
        if (obecnyObrazIndex < obrazy.length) {
            zaladujObraz();
            document.getElementById("odpowiedz").value = "";
            wprowadzonaOdpowiedz = ""; // Zeruj przechowywana odpowiedz
            document.getElementById("wynik").textContent = ""; // Wyczysc komunikat o wyniku
        } else {
            document.getElementById("wynik").textContent = "Gra zakonczona!";
        }
    } else {
        iloscNiepoprawnychOdpowiedzi++;

        if (iloscNiepoprawnychOdpowiedzi >= maksymalnaIloscNiepoprawnychOdpowiedzi) {
            document.getElementById("wynik").textContent = "Przekroczyles limit niepoprawnych odpowiedzi. Gra zakonczona!";
        } else {
            document.getElementById("wynik").textContent = "Odpowiedz niepoprawna. Spr�buj ponownie.";
        }
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

function rozpocznijGre() {
    // Ukryj ekran początkowy
    document.getElementById('startScreen').style.display = 'none';

    // Pokaż ekran gry
    document.getElementById('graScreen').style.display = 'flex';

    // Rozpocznij grę
    pobierzBazeDanych();
}
