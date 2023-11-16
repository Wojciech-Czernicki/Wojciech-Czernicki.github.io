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
    poprawnaOdpowiedzElement.textContent = `Poprawna Odpowied�: ${aktualnyObraz.odpowiedz}`;
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
        document.getElementById("wynik").textContent = "Odpowiedź poprawna!";
        
        // Przejdź do następnego obrazu po krótkim opóźnieniu
        setTimeout(() => {
            obecnyObrazIndex++;
            if (obecnyObrazIndex < obrazy.length) {
                zaladujObraz();
                document.getElementById("odpowiedz").value = "";
                document.getElementById("wprowadzonaOdpowiedz").textContent = ""; // Wyczyść wyświetloną odpowiedź
                document.getElementById("wynik").textContent = ""; // Wyczyść komunikat o wyniku
            } else {
                document.getElementById("wynik").textContent = "Gra zakończona!";
            }
        }, 1000); // Opóźnienie 1000 milisekund (1 sekunda)
    } else {
        document.getElementById("wynik").textContent = "Odpowiedź niepoprawna. Spróbuj ponownie.";
    }
}


// Przejdź do następnego obrazu
obecnyObrazIndex++;
if (obecnyObrazIndex < obrazy.length) {
    zaladujObraz();
    document.getElementById("odpowiedz").value = "";
    document.getElementById("wprowadzonaOdpowiedz").textContent = ""; // Wyczyść wyświetloną odpowiedź
    document.getElementById("wynik").textContent = ""; // Wyczyść komunikat o wyniku
} else {
    document.getElementById("wynik").textContent = "Gra zakończona!";
}

}

// Obs�uga klawiatury
document.addEventListener('keydown', function (event) {
    if (event.key.length === 1) {
        dodajLitera(event.key.toUpperCase());
    } else if (event.key === 'Backspace') {
        usunLitera();
    } else if (event.key === 'Enter') {
        dodajLitera('Enter', event);
    }
});

// Rozpocznij gr� po za�adowaniu strony
document.addEventListener('DOMContentLoaded', function () {
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
