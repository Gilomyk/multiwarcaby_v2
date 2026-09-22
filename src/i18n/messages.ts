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

    game: {
      player: (player: number) => `Gracz ${player}`,

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
        newGame: 'Nowa gra',
      },

      announcement: {
        playerStartsTurn: (player: number) => `Gracz ${player}. rozpoczyna turę.`,

        playerEndsTurn: (player: number) => `Gracz ${player}. zakończył turę.`,

        playerStartsCaptureSequence: (player: number) => `Gracz ${player}. rozpoczyna serię bić!`,

        playerSecondMove: (player: number) => `Gracz ${player}. wykonuje 2. ruch.`,

        playerWins: (player: number) => `Gracz ${player}. wygrywa!`,

        draw: 'Gra zakończyła się remisem!',
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

    game: {
      player: (player: number) => `Player ${player}`,

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
