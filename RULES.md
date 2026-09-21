# Multiwarcaby - Rules Specification

This document is the authoritative specification of the rules of Multiwarcaby.

The game logic must follow these rules exactly. Do not introduce additional rules, mandatory captures, king pieces, hints, forced capture sequences, or other mechanics that are not described here.

---

## 1. Game Overview

Multiwarcaby is a board game for **2 to 4 players**.

The game is played on a **9 × 9 board**, containing 81 fields.

There are **76 neutral pieces** and **5 empty fields** at the beginning of the game.

The pieces are not owned by individual players. Any player can move any piece and any player can capture any piece.

A player's score is equal to the number of pieces they have captured during the game.

---

## 2. Initial Board

The board contains:

- 81 fields total,
- 76 pieces,
- 5 empty fields.

The five empty fields are:

- the four corners of the board,
- the center field.

All remaining 76 fields initially contain one neutral piece.

The pieces do not have different colors or owners.

---

## 3. Players and Turns

There can be **2, 3, or 4 players**.

Players take turns in a fixed order.

During one turn, the current player has **two moves**.

The two moves are independent unless the second move is used to continue a capture sequence.

A player must make at least one move during one turn.

A player does not have to use both moves if they choose to end their turn earlier.

---

## 4. Movement

A single move can be one of two types:

1. a normal move,
2. a capture.

### 4.1 Normal move

A piece can move by exactly **one field** in any of the 8 directions:

- up,
- down,
- left,
- right,
- up-left,
- up-right,
- down-left,
- down-right.

A normal move is legal only when the destination field is empty.

A normal move does not remove any piece.

---

## 5. Capturing

A capture is performed by jumping over one adjacent piece onto the empty field immediately behind it.

The jump is exactly **two fields** long.

Example:

```text
[P][X][ ]
```

becomes:

```text
[ ][ ][P]
```

where:

- `P` = the moving piece,
- `X` = the piece being captured,
- `[ ]` = an empty field.

The captured piece is removed from the board.

The moving piece occupies the destination field.

Captures can be performed in any of the 8 directions.

A capture is possible only when:

1. there is a piece directly adjacent to the moving piece,
2. the field immediately behind that piece is empty,
3. both fields are inside the board.

---

## 6. Captures Are Not Mandatory

A player is **never forced to capture**.

If a capture is available, the player may instead:

- perform a normal move,
- perform a capture,
- or end their turn according to the two-move rules.

There is no rule requiring the player to select a capture.

---

## 7. Capture Sequences

After performing a capture, the same piece may be able to perform another capture.

Such consecutive captures form a **capture sequence**.

A capture sequence can continue through multiple captures.

The player is **not required to perform the maximum possible number of captures**.

If another capture is available, the player may voluntarily stop the sequence.

There is no "maximum capture" rule.

There is no requirement to choose the capture sequence that removes the greatest number of pieces.

---

## 8. Two Moves Per Turn

Each turn normally consists of two independent moves.

For example, a player may perform:

```text
Move 1: normal move
Move 2: normal move
```

or:

```text
Move 1: normal move
Move 2: capture
```

or:

```text
Move 1: capture
Move 2: normal move
```

or:

```text
Move 1: capture
Move 2: capture
```

The second move may also be a continuation of a capture sequence started by the first move.

The player may voluntarily finish the turn before using both moves.

---

## 9. Preparing a Capture With the First Move

A particularly important rule is that the first move can create a capture opportunity for the second move.

For example:

```text
Move 1:
The player performs a normal move that changes the board.

Move 2:
The resulting position now allows the player to capture a piece.
```

This is a legal two-move combination.

Therefore, when determining whether a player has a possible capturing combination, the game must consider not only captures available immediately, but also captures that become available **after a legal first move**.

This rule is essential to determining the end of the game.

---

## 10. End of Game

The game does **not** end simply because there is no capture available in the current position.

The game ends only when the current player has **no legal two-move combination that allows a capture**.

This means the game must consider both:

### Case A - Capture immediately available

If the player can perform a capture as part of their available moves, the game continues.

### Case B - No immediate capture, but capture can be prepared

If the player can perform a legal first move which creates a capture available for the second move, the game continues.

Example:

```text
Position before turn
        ↓
Legal first move
        ↓
New board position
        ↓
Legal capture available
```

This means the game must continue.

### Case C - No capturing combination

If there is no legal sequence of the player's two moves that allows any capture, the game ends.

In other words, the game-ending condition is:

> There is no legal two-move sequence available to the current player that contains a capture.

The implementation must check possible first moves and the resulting board states when determining this condition at the beginning of the round.

---

## 11. Score

Every captured piece increases the capturing player's score by **1**.

Example:

```text
Player A captures one piece.
Player A score: +1
```

A capture sequence can therefore increase the score multiple times.

Pieces captured by a player remain counted in that player's score even though the pieces are removed from the board.

---

## 12. Neutral Pieces

All pieces are neutral.

There is no concept of:

- player's own piece,
- opponent's piece,
- piece ownership,
- piece color belonging to a player.

Any player can move any piece.

Any player can capture any piece.

The player's identity affects only:

- whose turn it is,
- who receives the score for a capture.

---

## 13. No Hints or Automatic Assistance

The game does not automatically tell the player which moves are legal.

There are no mandatory visual hints for:

- available moves,
- available captures,
- best moves,
- longest capture sequences.

The UI may later visually distinguish a selected piece or an action currently being performed, but the game must not force or suggest a particular move.

---

## 14. Winning / Draw

The game ends when the current player has no legal two-move combination allowing a capture.

The final scores are the number of pieces captured by each player.

If the final state does not produce a unique winner according to the implemented scoring result, the game is treated as a **draw with no winner**.

Do not introduce additional tie-breaking rules unless they are explicitly added to this specification.

---

## 15. Board Boundaries

A move or capture is legal only if every required field lies within the 9 × 9 board.

A piece cannot:

- move outside the board,
- jump outside the board,
- capture a piece outside the board.

---

## 16. Important Implementation Requirements

The game engine must be responsible for determining whether a move is legal.

The UI must not implement game rules independently.

The recommended separation is:

```text
UI (Vue)
    |
    v
Game Engine (TypeScript)
    |
    +-- Board
    +-- Pieces
    +-- Move validation
    +-- Capture detection
    +-- Capture sequences
    +-- Turn handling
    +-- Score
    +-- Game-over detection
```

The Vue components should request actions from the game engine rather than deciding whether those actions are legal.

For example:

```ts
game.makeMove(from, to)
```

The game engine should determine:

- whether the move is legal,
- whether it is a normal move or capture,
- whether a piece must be removed,
- whether the player still has another move,
- whether a capture sequence can continue,
- whether the turn can end,
- whether the game has ended.

---

## 17. Critical Rule for Game-Over Detection

Game-over detection must not simply check:

```text
"Is there currently a capture?"
```

Instead, it must evaluate whether the current player has any legal two-move combination that allows a capture.

Conceptually:

```text
for every legal first move:
    apply first move

    if the resulting position allows a capture:
        game continues

    otherwise:
        evaluate other legal first moves
```

An immediately available capture also means that a capturing combination exists.

The exact implementation strategy is up to the developer, but the resulting behavior must follow this specification.

---

## 18. Rules That Must NOT Be Added

Unless explicitly requested later, do not add:

- mandatory captures,
- mandatory maximum captures,
- kings,
- promotion,
- piece ownership,
- different piece types,
- diagonal-only movement,
- player-specific pieces,
- automatic move suggestions,
- AI behavior,
- additional win conditions,
- additional draw conditions,
- chess/check-like mechanics,
- timers,
- penalties for ending a capture sequence early.

These are not part of the current ruleset.
