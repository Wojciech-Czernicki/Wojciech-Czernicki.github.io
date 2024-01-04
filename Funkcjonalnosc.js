// Funkcjonalnosc.js
var obrazy;
var wprowadzonaOdpowiedz = '';
var obraz = document.getElementById('obraz');
var obecnyObrazIndex = 0;
var poprawnaOdpowiedzElement = document.getElementById('poprawnaOdpowiedz');
var serduszkaContainer = document.getElementById('serduszkaContainer');
var iloscNiepoprawnychOdpowiedzi = 0; 
const maksymalnaIloscNiepoprawnychOdpowiedzi = 5; 
var liczbaPoprawnychOdpowiedzi = 0;
var czyGraZakonczona = false;

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
    obecnyObrazIndex = losujNastepnyObrazIndex();
    zaladujObraz();
}

function zaladujObraz() {
    const aktualnyObraz = obrazy[obecnyObrazIndex];
    obraz.src = aktualnyObraz.lokalizacja;
    poprawnaOdpowiedzElement.textContent = `Poprawna OdpowiedŸ: ${aktualnyObraz.odpowiedz}`;
}

function losujNastepnyObrazIndex() {
    const minId = 0; // Zmieniono na 0, aby zacz¹æ od pierwszego elementu tablicy
    const maxId = obrazy.length - 1; // Ustawienie maksymalnego indeksu na d³ugoœæ tablicy minus jeden
    let losowyIndex;
    do {
        losowyIndex = Math.floor(Math.random() * (maxId - minId + 1)) + minId;
    } while (losowyIndex === obecnyObrazIndex); 

    return losowyIndex;
}

function aktualizujSerduszka() {
    const serduszka = document.querySelectorAll('.serduszko');

    // Ukryj serduszka w zaleznosci od liczby blednych odpowiedzi
    for (let i = 0; i < serduszka.length; i++) {
        if (i < iloscNiepoprawnychOdpowiedzi) {
            serduszka[i].style.display = 'none'; // Ukryj serduszko
        } else {
            serduszka[i].style.display = 'inline-block'; // Pokaz serduszko
        }
    }
}

function ukryjObraz() {
    obraz.style.display = 'none';
}

function pokazObraz() {
    obraz.style.display = 'block';
}

function wyswietlOknoPorazki() {
    const oknoPorazki = document.getElementById('oknoPorazki');
    oknoPorazki.style.display = 'flex';
}

// Funkcja ukrywajaca okno po przegranej
function ukryjOknoPorazki() {
    const oknoPorazki = document.getElementById('oknoPorazki');
    oknoPorazki.style.display = 'none';
}

// Funkcja restartujaca gre po przegranej
function zagrajPonownie() {
location.reload()
}

// Funkcja zakonczajaca gre i wracajaca do indexu po przegranej
function zakoncz() {
    czyGraZakonczona = false;
    ukryjOknoPorazki();
    obecnyObrazIndex = 0;
    iloscNiepoprawnychOdpowiedzi = 0;

    window.location.href = 'index.html'; // Bezpoœrednie przekierowanie
}
function resetujSerduszka() {
    const serduszka = document.querySelectorAll('.serduszko');
    serduszka.forEach(serduszko => {
        serduszko.style.display = 'inline-block';
    });
}


// Funkcja wywolujaca sie po zdobyciu 5 poprawnych odpowiedzi
function wyswietlOknoZwyciestwa() {
    const oknoZwyciestwa = document.getElementById('oknoZwyciestwa');
    oknoZwyciestwa.style.display = 'flex';
}

// Funkcja ukrywajaca okno po zwyciestwie
function ukryjOknoZwyciestwa() {
    const oknoZwyciestwa = document.getElementById('oknoZwyciestwa');
    oknoZwyciestwa.style.display = 'none';
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
    if (czyGraZakonczona) {
        return;
    }

    const odpowiedz = wprowadzonaOdpowiedz.toUpperCase();
    const poprawnaOdpowiedz = obrazy[obecnyObrazIndex].odpowiedz.toUpperCase();

    if (odpowiedz === poprawnaOdpowiedz) {
        document.getElementById("wynik").textContent = "Odpowiedz poprawna!";
        liczbaPoprawnychOdpowiedzi++;

        if (liczbaPoprawnychOdpowiedzi >= 5) {
            document.getElementById("wynik").textContent = "Gra zakonczona!";
            czyGraZakonczona = true;
            wyswietlOknoZwyciestwa();
        } else {
            zaladujLosowyObraz();
            document.getElementById("odpowiedz").value = "";
            wprowadzonaOdpowiedz = "";
            document.getElementById("wynik").textContent = "";
            aktualizujSerduszka();
        }
    } else {
        iloscNiepoprawnychOdpowiedzi++;
        if (iloscNiepoprawnychOdpowiedzi >= maksymalnaIloscNiepoprawnychOdpowiedzi) {
            document.getElementById("wynik").textContent = "Przekroczyles limit niepoprawnych odpowiedzi. Gra zakonczona!";
            czyGraZakonczona = true;
            wyswietlOknoPorazki();
        } else {
            document.getElementById("wynik").textContent = "Odpowiedz niepoprawna. Spróbuj ponownie.";
            aktualizujSerduszka();
        }
    }
}



// ObsÅ‚uga klawiatury
document.addEventListener('keydown', function (event) {
    // Akceptuj litery, cyfry i spacjê
    if ((event.key.length === 1 && /^[a-z0-9 ]$/i.test(event.key)) || event.key === 'Backspace' || event.key === 'Enter') {
        if (event.key === 'Enter') {
            sprawdzOdpowiedz();
        } else if (event.key === 'Backspace') {
            usunLitera();
        } else {
            dodajLitera(event.key.toUpperCase());
        }
    }
});

// Rozpocznij grê po za³adowaniu strony
document.addEventListener('DOMContentLoaded', function () {
    pobierzBazeDanych();
});

function rozpocznijGre() {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('graScreen').style.display = 'flex';
    pobierzBazeDanych();
}
