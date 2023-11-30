var obrazy;
var wprowadzonaOdpowiedz = '';
var obraz = document.getElementById('obraz');
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

    // Dodaj sprawdzenie, czy element istnieje, zanim spróbujesz go zaktualizowac
    if (poprawnaOdpowiedzElement) {
        poprawnaOdpowiedzElement.textContent = `Poprawna Odpowiedz: ${aktualnyObraz.odpowiedz}`;
    }
}

// Reszta kodu bez zmian
