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
    czyGraZakonczona = false;
    ukryjOknoPorazki();
    iloscNiepoprawnychOdpowiedzi = 0;
    obecnyObrazIndex = 0;
    zaladujLosowyObraz();
    aktualizujSerduszka();
    pokazObraz();
    location.reload();
}

// Funkcja zakonczajaca gre i wracajaca do indexu po przegranej
function zakoncz() {
    czyGraZakonczona = false;
    ukryjOknoPorazki();
    obecnyObrazIndex = 0;
    iloscNiepoprawnychOdpowiedzi = 0;
    document.getElementById('startScreen').style.display = 'flex';
    document.getElementById('graScreen').style.display = 'none';

    setTimeout(function() {
        window.location.href = 'index.html';
    }, 1000); // Przekierowanie po 1 sekundzie
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

// Funkcja restartujaca gre po zwyciestwie
function zagrajPonownieZwyciestwo() {
    czyGraZakonczona = false;
    ukryjOknoZwyciestwa();
    iloscNiepoprawnychOdpowiedzi = 0;
    obecnyObrazIndex = 0;
    zaladujLosowyObraz();
    aktualizujSerduszka();
    pokazObraz();
    location.reload();
}

// Funkcja zakonczajaca gre i wracajaca do indexu po zwyciestwie
function zakonczZwyciestwo() {
    czyGraZakonczona = false;
    ukryjOknoZwyciestwa();
    obecnyObrazIndex = 0;
    iloscNiepoprawnychOdpowiedzi = 0;
    document.getElementById('startScreen').style.display = 'flex';
    document.getElementById('graScreen').style.display = 'none';
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
    // Sprawdz, czy gra jest zakonczona
    if (czyGraZakonczona) {
        return;
    }

    const odpowiedz = wprowadzonaOdpowiedz.toUpperCase();
    const poprawnaOdpowiedz = obrazy[obecnyObrazIndex].odpowiedz.toUpperCase();

    console.log("odpowiedz:", odpowiedz);
    console.log("poprawnaOdpowiedz:", poprawnaOdpowiedz);

    if (odpowiedz === poprawnaOdpowiedz) {
        document.getElementById("wynik").textContent = "Odpowiedz poprawna!";

        // Zwieksz licznik poprawnych odpowiedzi
        liczbaPoprawnychOdpowiedzi++;

        if (liczbaPoprawnychOdpowiedzi >= 5) {
            document.getElementById("wynik").textContent = "Gra zakonczona!";
            czyGraZakonczona = true;
            wyswietlOknoZwyciestwa(); // Wyswietl okno po zdobyciu 5 poprawnych odpowiedzi
        } else {
            // Przejdz do nastepnego obrazu po krótkim opóznieniu
            obecnyObrazIndex++;
            if (obecnyObrazIndex < obrazy.length) {
                zaladujObraz();
                document.getElementById("odpowiedz").value = "";
                wprowadzonaOdpowiedz = ""; // Zeruj przechowywana odpowiedz
                document.getElementById("wynik").textContent = ""; // Wyczysc komunikat o wyniku
                aktualizujSerduszka(); // Aktualizuj widocznosc serduszek
            } else {
                document.getElementById("wynik").textContent = "Gra zakonczona!";
                czyGraZakonczona = true;
                wyswietlOknoZwyciestwa(); // Wyswietl okno po zdobyciu 5 poprawnych odpowiedzi
            }
        }
    } else {
        iloscNiepoprawnychOdpowiedzi++;

        if (iloscNiepoprawnychOdpowiedzi >= maksymalnaIloscNiepoprawnychOdpowiedzi) {
            document.getElementById("wynik").textContent = "Przekroczyles limit niepoprawnych odpowiedzi. Gra zakonczona!";
            czyGraZakonczona = true;
            wyswietlOknoPorazki(); // Wyswietl okno po przegranej
        } else {
            document.getElementById("wynik").textContent = "Odpowiedz niepoprawna. Spróbuj ponownie.";
            aktualizujSerduszka(); // Aktualizuj widocznosc serduszek
        }
    }
}


// ObsÅ‚uga klawiatury
document.addEventListener('keydown', function (event) {
    if (event.key.length === 1 && /^[a-z]$/i.test(event.key)) { // Dodano warunek, aby akceptowaæ tylko litery
        dodajLitera(event.key.toUpperCase());
    } else if (event.key === 'Backspace') {
        usunLitera();
    } else if (event.key === 'Enter') {
        sprawdzOdpowiedz();
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
