export type Language = 'pl' | 'en'

export const messages = {
  pl: {
    navigation: {
      play: 'Zagraj',
      rules: 'Zasady gry',
      ranking: 'Ranking',
      settings: 'Ustawienia',

      signIn: 'Zaloguj się',
      register: 'Zarejestruj się',

      openMenu: 'Otwórz menu',
      home: 'Strona główna Multiwarcabów',
      github: 'Repozytorium GitHub',
    },

    settings: {
      title: 'Ustawienia',
      appName: 'Multiwarcaby',

      language: {
        title: 'Język',
        description: 'Wybierz język interfejsu.',
        polish: 'Polski',
        english: 'English',
      },

      theme: {
        title: 'Tryb',
        description: 'Dostosuj wygląd aplikacji.',
        light: 'Jasny',
        dark: 'Ciemny',
        system: 'System',
      },

      close: 'Zamknij',
    },

    newGame: {
      title: 'Nowa gra',
      appName: 'Multiwarcaby',

      mode: {
        title: 'Tryb gry',
        description: 'Wybierz rozgrywkę lokalną, pojedynek z botem lub symulację.',
        pvp: '2 Graczy (1v1)',
        bot: 'Gra z Botem',
        simulation: 'Symulacja (Bot vs Bot)',
      },

      difficulty: {
        title: 'Poziom bota',
        description: 'Wybierz strategię podejmowania decyzji przez bota.',
        easy: 'Łatwy (1 ruch)',
        hard: 'Trudny (2 ruchy)',
      },

      simulation: {
        bot1Title: 'Bot 1 (zaczyna)',
        bot1Description: 'Wybierz strategię dla pierwszego bota.',
        bot2Title: 'Bot 2',
        bot2Description: 'Wybierz strategię dla drugiego bota.',
        tieBreakTitle: 'Rozstrzyganie remisów',
        tieBreakDescription: 'Sprawdź deterministyczność lub losuj spośród równie dobrych ruchów.',
        deterministic: 'Deterministyczne',
        random: 'Losowe',
      },

      starter: {
        title: 'Kto zaczyna',
        description: 'Ustal, kto wykona pierwszy ruch w partii.',
        human: 'Ty',
        bot: 'Bot',
        random: 'Losowo',
      },

      cancel: 'Anuluj',
      start: 'Rozpocznij grę',
    },

    game: {
      player: (player: number) => `Gracz ${player}`,

      bot: {
        human: 'Ty',
        name: 'Bot',
        easyShort: 'Łatwy',
        hardShort: 'Trudny',
        thinking: 'Bot analizuje ruch...',
        simThinking: (name: string) => `${name} analizuje ruch...`,
      },

      status: {
        currentTurn: 'Aktualna tura',
        scores: 'Wyniki',

        move: (move: number) => `Ruch ${move} / 2`,

        captureSequenceActive: 'Seria bić aktywna',
      },

      controls: {
        turnStarted: 'Rozpoczynasz turę!',
        endSequence: 'Zakończ serię',
        endTurn: 'Zakończ turę',
      },

      captured: {
        pieces: (count: number) => `Zbite pionki: ${count}`,
      },

      result: {
        gameOver: 'Koniec gry',
        draw: 'Remis',
        winner: (player: number) => `Wygrywa Gracz ${player}`,
        winnerName: (name: string) => `Wygrywa: ${name}`,
        newGame: 'Nowa gra',
      },

      announcement: {
        playerStartsTurn: (player: number) => `Gracz ${player}. rozpoczyna turę.`,

        playerEndsTurn: (player: number) => `Gracz ${player}. zakończył turę.`,

        playerStartsCaptureSequence: (player: number) => `Gracz ${player}. rozpoczyna serię bić!`,

        playerSecondMove: (player: number) => `Gracz ${player}. wykonuje 2. ruch.`,

        playerWins: (player: number) => `Gracz ${player}. wygrywa!`,

        draw: 'Gra zakończyła się remisem!',

        byName: {
          startsTurn: (name: string) => `${name} rozpoczyna turę.`,
          endsTurn: (name: string) => `${name} kończy turę.`,
          startsCaptureSequence: (name: string) => `${name} rozpoczyna serię bić!`,
          secondMove: (name: string) => `${name} wykonuje 2. ruch.`,
          wins: (name: string) => `${name} wygrywa!`,
        },
      },

      feedback: {
        destinationOccupied: 'Pole docelowe jest zajęte.',
        invalidSource: 'Nie można wykonać ruchu z tego pola.',
        invalidDestination: 'Nieprawidłowe pole docelowe.',
        invalidMove: 'Ten ruch jest niedozwolony.',
        noMovesLeft: 'Wykorzystano już oba ruchy.',
        mustMakeMove: 'Najpierw wykonaj co najmniej jeden ruch.',
        gameFinished: 'Gra została już zakończona.',
      },
    },

    footer: {
      copyright: 'Blablabla copyright',
    },
  },

  en: {
    navigation: {
      play: 'Play',
      rules: 'Game rules',
      ranking: 'Ranking',
      settings: 'Settings',

      signIn: 'Sign in',
      register: 'Register',

      openMenu: 'Open menu',
      home: 'Multiwarcaby home',
      github: 'GitHub repository',
    },

    settings: {
      title: 'Settings',
      appName: 'Multiwarcaby',

      language: {
        title: 'Language',
        description: 'Choose the interface language.',
        polish: 'Polski',
        english: 'English',
      },

      theme: {
        title: 'Theme',
        description: 'Customize the appearance of the application.',
        light: 'Light',
        dark: 'Dark',
        system: 'System',
      },

      close: 'Close',
    },

    newGame: {
      title: 'New game',
      appName: 'Multiwarcaby',

      mode: {
        title: 'Game mode',
        description: 'Choose a local match, play against the bot, or run a simulation.',
        pvp: '2 Players (1v1)',
        bot: 'Play vs Bot',
        simulation: 'Simulation (Bot vs Bot)',
      },

      difficulty: {
        title: 'Bot difficulty',
        description: 'Choose the bot decision strategy.',
        easy: 'Easy (1 move)',
        hard: 'Hard (2 moves)',
      },

      simulation: {
        bot1Title: 'Bot 1 (starts)',
        bot1Description: 'Choose strategy for the first bot.',
        bot2Title: 'Bot 2',
        bot2Description: 'Choose strategy for the second bot.',
        tieBreakTitle: 'Tie-breaking',
        tieBreakDescription: 'Test determinism or randomize among equally good moves.',
        deterministic: 'Deterministic',
        random: 'Random',
      },

      starter: {
        title: 'First move',
        description: 'Choose who makes the opening move.',
        human: 'You',
        bot: 'Bot',
        random: 'Random',
      },

      cancel: 'Cancel',
      start: 'Start game',
    },

    game: {
      player: (player: number) => `Player ${player}`,

      bot: {
        human: 'You',
        name: 'Bot',
        easyShort: 'Easy',
        hardShort: 'Hard',
        thinking: 'Bot is thinking...',
        simThinking: (name: string) => `${name} is thinking...`,
      },

      status: {
        currentTurn: 'Current turn',
        scores: 'Scores',

        move: (move: number) => `Move ${move} / 2`,

        captureSequenceActive: 'Capture sequence active',
      },

      controls: {
        turnStarted: 'Your turn!',
        endSequence: 'End sequence',
        endTurn: 'End turn',
      },

      captured: {
        pieces: (count: number) => `Captured pieces: ${count}`,
      },

      result: {
        gameOver: 'Game over',
        draw: 'Draw',
        winner: (player: number) => `Player ${player} wins`,
        winnerName: (name: string) => `${name} wins`,
        newGame: 'New game',
      },

      announcement: {
        playerStartsTurn: (player: number) => `Player ${player} starts their turn.`,

        playerEndsTurn: (player: number) => `Player ${player} ends their turn.`,

        playerStartsCaptureSequence: (player: number) =>
          `Player ${player} starts a capture sequence!`,

        playerSecondMove: (player: number) => `Player ${player} makes their second move.`,

        playerWins: (player: number) => `Player ${player} wins!`,

        draw: 'The game ended in a draw!',

        byName: {
          startsTurn: (name: string) => `${name} starts the turn.`,
          endsTurn: (name: string) => `${name} ends the turn.`,
          startsCaptureSequence: (name: string) => `${name} starts a capture sequence!`,
          secondMove: (name: string) => `${name} makes a second move.`,
          wins: (name: string) => `${name} wins!`,
        },
      },

      feedback: {
        destinationOccupied: 'The destination square is occupied.',
        invalidSource: 'A move cannot be made from this square.',
        invalidDestination: 'Invalid destination square.',
        invalidMove: 'This move is not allowed.',
        noMovesLeft: 'Both moves have already been used.',
        mustMakeMove: 'Make at least one move first.',
        gameFinished: 'The game has already ended.',
      },
    },

    footer: {
      copyright: 'Blablabla copyright',
    },
  },
} as const
