// Funkcjonalnosc.js
let wprowadzonaOdpowiedz = '';
const obraz = document.getElementById('obraz');
let obecnyObrazIndex = 0;
const poprawnaOdpowiedzElement = document.getElementById('poprawnaOdpowiedz');
const wprowadzoneLiteryContainer = document.getElementById('wprowadzoneLitery');

async function pobierzBazeDanych() {
    const response = await fetch('Baza_zdjec.json');
    const data = await response.json();
    obrazy = data.obrazy;
    zaladujLosowyObraz();
}

function zaladujLosowyObraz() {
    obecnyObrazIndex = Math.floor(Math.random() * obrazy.length +1);
    zaladujObraz();
}

function zaladujObraz() {
    const aktualnyObraz = obrazy[obecnyObrazIndex];
    obraz.src = aktualnyObraz.lokalizacja;
    poprawnaOdpowiedzElement.textContent = `Poprawna Odpowiedź: ${aktualnyObraz.odpowiedz}`;
}

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
    document.getElementById('wprowadzonaOdpowiedz').textContent = wprowadzonaOdpowiedz;
}

function sprawdzOdpowiedz() {
    const odpowiedz = document.getElementById("odpowiedz").value.toLowerCase();
    const poprawnaOdpowiedz = obrazy[obecnyObrazIndex].odpowiedz.toLowerCase();

    if (odpowiedz === poprawnaOdpowiedz) {
        document.getElementById("wynik").textContent = "Odpowiedź poprawna!";
    } else {
        document.getElementById("wynik").textContent = "Odpowiedź niepoprawna. Spróbuj ponownie.";
    }

    // Przejdź do następnego obrazu
    obecnyObrazIndex++;
    if (obecnyObrazIndex < obrazy.length) {
        zaladujObraz();
        document.getElementById("odpowiedz").value = "";
        document.getElementById("wprowadzonaOdpowiedz").textContent = "";
        usunWprowadzoneLitery();
    } else {
        document.getElementById("wynik").textContent = "Gra zakończona!";
    }
}

function usunWprowadzoneLitery() {
    wprowadzoneLiteryContainer.innerHTML = '';
}

// Obsługa klawiatury
document.addEventListener('keydown', function(event) {
    if (event.key.length === 1) {
        dodajLitera(event.key.toUpperCase());
    } else if (event.key === 'Backspace') {
        usunLitera();
    } else if (event.key === 'Enter') {
        dodajLitera('Enter', event);
    }
});

// Rozpocznij grę po załadowaniu strony
document.addEventListener('DOMContentLoaded', function() {
    pobierzBazeDanych();
});
