// Funkcjonalnosc.js
var obrazy;
var wprowadzonaOdpowiedz = '';
var obraz = document.getElementById('obraz');
var obecnyObrazIndex = 0;
var poprawnaOdpowiedzElement = document.getElementById('poprawnaOdpowiedz');
var iloscNiepoprawnychOdpowiedzi = 0;
const maksymalnaIloscNiepoprawnychOdpowiedzi = 5;

async function pobierzBazeDanych() {
    try {
        const response = await fetch('Baza.json');
        if (!response.ok) {
            throw new Error(`Nieudane pobieranie danych. Kod odpowiedzi: ${response.status}`);
        }
        const data = await response.json();

        if (Array.isArray(data.obrazy)) {
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
    const minId = 2;
    const maxId = 26;
    obecnyObrazIndex = Math.floor(Math.random() * (maxId - minId + 1)) + minId;
    zaladujObraz();
}

function zaladujObraz() {
    const aktualnyObraz = obrazy[obecnyObrazIndex];
    obraz.src = aktualnyObraz.lokalizacja;
    poprawnaOdpowiedzElement.textContent = `Poprawna Odpowiedz: ${aktualnyObraz.odpowiedz}`;

    const odpowiedzInput = document.getElementById("odpowiedz");
    odpowiedzInput.value = wprowadzonaOdpowiedz;

    odpowiedzInput.addEventListener("input", function (event) {
        wprowadzonaOdpowiedz = event.target.value.toUpperCase();
        aktualizujWprowadzonaOdpowiedz();
    });

    odpowiedzInput.addEventListener("keydown", function (event) {
        if (event.key === 'Enter') {
            sprawdzOdpowiedz();
        }
    });
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
    const odpowiedz = wprowadzonaOdpowiedz;
    const poprawnaOdpowiedz = obrazy[obecnyObrazIndex].odpowiedz.toUpperCase();

    console.log("odpowiedz:", odpowiedz);
    console.log("poprawnaOdpowiedz:", poprawnaOdpowiedz);

    if (odpowiedz === poprawnaOdpowiedz) {
        document.getElementById("wynik").textContent = "Odpowiedz poprawna!";
        
        obecnyObrazIndex++;
        if (obecnyObrazIndex < obrazy.length) {
            zaladujObraz();
            document.getElementById("odpowiedz").value = "";
            wprowadzonaOdpowiedz = "";
            document.getElementById("wprowadzonaOdpowiedz").textContent = "";
            document.getElementById("wynik").textContent = "";
        } else {
            document.getElementById("wynik").textContent = "Gra zakonczona!";
        }
    } else {
        iloscNiepoprawnychOdpowiedzi++;

        if (iloscNiepoprawnychOdpowiedzi >= maksymalnaIloscNiepoprawnychOdpowiedzi) {
            document.getElementById("wynik").textContent = "Przekroczyles limit niepoprawnych odpowiedzi. Gra zakonczona!";
        } else {
            document.getElementById("wynik").textContent = "Odpowiedz niepoprawna. Spróbuj ponownie.";
        }
    }
}

document.addEventListener('keydown', function (event) {
    if (event.key.length === 1) {
        dodajLitera(event.key.toUpperCase());
    } else if (event.key === 'Backspace') {
        usunLitera();
    } else if (event.key === 'Enter') {
        dodajLitera('Enter', event);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    pobierzBazeDanych();
});

function rozpocznijGre() {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('graScreen').style.display = 'flex';
    pobierzBazeDanych();
}
