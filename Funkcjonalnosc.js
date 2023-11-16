// Funkcjonalnosc.js
let obrazy;
let wprowadzonaOdpowiedz = '';
let obraz = document.getElementById('obraz');
let obecnyObrazIndex = 0;
let poprawnaOdpowiedzElement = document.getElementById('poprawnaOdpowiedz');
const wprowadzoneLiteryContainer = document.getElementById('wprowadzoneLitery');

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('DOMContentLoaded', pobierzBazeDanych);

async function pobierzBazeDanych() {
    try {
        const response = await fetch('Baza.json');
        if (!response.ok) {
            throw new Error(`Nieudane pobieranie danych. Kod odpowiedzi: ${response.status}`);
        }
        const data = await response.json();

        if (Array.isArray(data.obrazy)) {
            obrazy = data.obrazy.map(({ id = 0, tytul = "Brak tytulu", lokalizacja = "Brak lokalizacji", odpowiedz = "Brak odpowiedzi" }) => ({
                id,
                tytul,
                lokalizacja,
                odpowiedz
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
    const { lokalizacja, odpowiedz } = obrazy[obecnyObrazIndex];
    obraz.src = lokalizacja;
    poprawnaOdpowiedzElement.textContent = `Poprawna Odpowiedz: ${odpowiedz}`;
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

    const wynikElement = document.getElementById("wynik");
    wynikElement.textContent = odpowiedz === poprawnaOdpowiedz ? "Odpowiedz poprawna!" : "Odpowiedz niepoprawna. Spróbuj ponownie.";

    obecnyObrazIndex++;
    if (obecnyObrazIndex < obrazy.length) {
        zaladujObraz();
        document.getElementById("odpowiedz").value = "";
        aktualizujWprowadzonaOdpowiedz();
        usunWprowadzoneLitery();
    } else {
        wynikElement.textContent = "Gra zakonczona!";
    }
}

function handleKeyDown(event) {
    if (event.key.length === 1) {
        dodajLitera(event.key.toUpperCase(), event);
    } else if (event.key === 'Backspace') {
        usunLitera();
    }
}

function usunWprowadzoneLitery() {
    wprowadzoneLiteryContainer.innerHTML = '';
}
