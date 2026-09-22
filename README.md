# Multiwarcaby

Multiwarcaby to webowa wersja autorskiej gry planszowej opartej na neutralnych pionkach, swobodnym ruchu w 8 kierunkach oraz wielokrotnych biciach.

Projekt powstaje w **Vue 3 + TypeScript + Vite** i działa obecnie w pełni po stronie przeglądarki — bez backendu, bazy danych i kont użytkowników.

🌐 **Wersja online:** https://multiwarcaby-v2.pages.dev/

---

## 🎮 O grze

Plansza ma rozmiar **9 × 9** i na początku zawiera:

- 76 neutralnych pionków,
- 5 pustych pól,
- puste cztery narożniki oraz środek planszy.

Pionki nie należą do żadnego gracza. Każdy gracz może poruszyć dowolny pionek oraz zbić dowolny pionek.

W trakcie swojej tury gracz może wykonać maksymalnie **dwa ruchy**, a po rozpoczęciu bicia może kontynuować serię kolejnych bić tym samym pionkiem.

Punkty zdobywa się poprzez zbijanie pionków.

Pełna i nadrzędna specyfikacja zasad znajduje się w pliku [`RULES.md`](./RULES.md).

---

## ✨ Aktualne funkcje

- plansza 9 × 9,
- lokalna rozgrywka dla 2 graczy,
- ruchy w 8 kierunkach,
- zwykłe ruchy i bicia,
- serie bić,
- dwa ruchy na turę,
- możliwość wcześniejszego zakończenia tury,
- naliczanie punktów,
- wykrywanie końca gry,
- remis i zwycięstwo,
- animacje ruchów,
- animacje zbitych pionków,
- stosy zbitych pionków,
- komunikaty o aktualnym przebiegu tury,
- responsywny interfejs desktop/mobile,
- brak wymaganej rejestracji i backendu.

---

## 🧠 Architektura

Logika gry jest oddzielona od interfejsu użytkownika.

```text
Vue UI
  │
  ▼
Game Engine (TypeScript)
  ├── Board
  ├── Move validation
  ├── Captures
  ├── Capture sequences
  ├── Turn handling
  ├── Score
  └── Game-over detection
```

Vue odpowiada za prezentację stanu gry i obsługę interakcji użytkownika, natomiast zasady oraz walidacja ruchów należą do lokalnego silnika w:

```text
src/engine/
```

Dzięki temu UI nie implementuje zasad gry niezależnie od engine.

---

## 🛠 Technologie

- **Vue 3**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **Vitest**
- **ESLint**
- **Prettier**

Hosting wersji produkcyjnej:

- **Cloudflare Pages**

---

## 📁 Struktura projektu

Najważniejsze katalogi:

```text
src/
├── components/     # komponenty UI
├── engine/         # logika i zasady gry
├── styles/         # globalne style i tokeny
├── types/          # typy widoku
├── views/          # główne widoki aplikacji
└── App.vue

RULES.md            # nadrzędna specyfikacja zasad
```

---

## 🚀 Uruchomienie lokalne

### Wymagania

Projekt wymaga Node.js zgodnego z konfiguracją w `package.json`.

### Instalacja zależności

```bash
npm install
```

### Uruchomienie środowiska developerskiego

```bash
npm run dev
```

Po uruchomieniu Vite wyświetli lokalny adres aplikacji.

---

## 📦 Build produkcyjny

```bash
npm run build
```

Build wykonuje sprawdzenie typów i generuje gotową aplikację produkcyjną w katalogu:

```text
dist/
```

Podgląd lokalnego builda:

```bash
npm run preview
```

---

## 🧪 Testy i jakość kodu

Testy jednostkowe:

```bash
npm run test:unit
```

Lint:

```bash
npm run lint
```

Formatowanie:

```bash
npm run format
```

---

## ☁️ Deployment

Projekt jest wdrażany automatycznie z brancha `main` przez **Cloudflare Pages**.

Schemat deploymentu:

```text
GitHub
  ↓
Cloudflare Pages
  ↓
npm run build
  ↓
dist/
  ↓
wersja produkcyjna
```

Każdy poprawnie zbudowany commit na branchu produkcyjnym może zostać automatycznie opublikowany.

---

## 📱 Mobile

Interfejs jest responsywny i dostosowany do urządzeń mobilnych.

Aktualna wersja działa bez instalacji bezpośrednio w przeglądarce. W przyszłości projekt może zostać rozszerzony o tryb PWA lub opakowany jako aplikacja mobilna.

---

## 🗺 Planowane rozszerzenia

Przykładowe kierunki dalszego rozwoju:

- dopracowanie grafiki pionków i planszy,
- nowe oznaczenia planszy,
- tryb ciemny,
- PWA / instalacja na ekranie głównym,
- obsługa 3–4 graczy w interfejsie,
- tryb single player z botem,
- multiplayer online,
- konta użytkowników i ranking.

---

## 📜 Zasady

Implementacja gry musi być zgodna z [`RULES.md`](./RULES.md).

Nie należy dodawać mechanik niewystępujących w specyfikacji, takich jak obowiązkowe bicie, damki, własność pionków czy automatyczne podpowiedzi ruchów, chyba że zostaną później jawnie dodane do zasad projektu.

---

## 👤 Autor

Projekt rozwijany przez **Gilomyk**.

Repozytorium:

https://github.com/Gilomyk/multiwarcaby_v2
