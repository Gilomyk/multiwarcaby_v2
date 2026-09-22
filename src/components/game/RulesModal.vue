<template>
  <div class="rules-overlay" @click.self="emit('close')">
    <section class="rules-modal" role="dialog" aria-modal="true" aria-labelledby="rules-title">
      <header class="rules-modal__header">
        <div>
          <span class="rules-modal__eyebrow">Multiwarcaby</span>
          <h2 id="rules-title">Zasady gry</h2>
        </div>

        <button
          class="rules-modal__close-icon"
          type="button"
          aria-label="Zamknij"
          @click="emit('close')"
        >
          ×
        </button>
      </header>

      <div class="rules-modal__content">
        <section class="rules-section">
          <h3>🎲 Przygotowanie gry</h3>
          <p>
            Gra składa się z kwadratowej planszy o 81 polach i 76 pionków. Przed przystąpieniem do
            gry pionki w liczbie 76 umieszcza się na wszystkich polach planszy z wyjątkiem 4
            narożnych i jednego leżącego w środku. W multiwarcabach wszystkie pionki są wspólne i są
            tego samego koloru. Czas rozegrania jednej partii ustalony eksperymentalnie wynosi około
            18 minut.
          </p>
        </section>

        <section class="rules-section">
          <h3>🎯 Cel i ruchy</h3>
          <p>
            Celem graczy jest zbicie jak największej liczby pionków. Po umieszczeniu na planszy
            wszystkich pionków zawodnicy wykonują nimi na przemian po dwa ruchy. Może to być
            przesunięcie pionka o jedną pozycję lub przeskoczenie pionka/pionków i jego zbicie tak
            jak w klasycznych warcabach. Pionkami można się poruszać po wszystkich 81 polach.
          </p>
        </section>

        <section class="rules-section">
          <h3>♟️ Zbijanie i zakończenie gry</h3>
          <p>
            Zbijanie i przesuwanie pionków odbywa się według zasady stosowanej w klasycznych
            warcabach, przy czym w multiwarcabach ruchy (przesuwanie i przeskakiwanie) można
            wykonywać we wszystkich możliwych kierunkach tj. do góry, do dołu i na boki, a więc
            pionowo i poziomo oraz po obu przekątnych (na ukos).
          </p>

          <p>
            Gra kończy się w momencie kiedy zbicie pozostałych na planszy pionków staje się
            niemożliwe. Po zakończeniu gry każdy zawodnik liczy swoje pionki. O kolejności zajętych
            miejsc decyduje liczba zdobytych pionków. Wygrywa ten zawodnik, który zdobędzie ich
            najwięcej.
          </p>
        </section>
      </div>

      <footer class="rules-modal__footer">
        <AppButton variant="primary" @click="emit('close')"> Zamknij </AppButton>
      </footer>
    </section>
  </div>
</template>

<script setup lang="ts">
import AppButton from '@/components/ui/AppButton.vue'

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<style scoped>
.rules-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 24px;

  background: rgba(5, 12, 24, 0.72);
  backdrop-filter: blur(4px);
}

.rules-modal {
  width: min(720px, 100%);
  max-height: min(82vh, 760px);

  display: flex;
  flex-direction: column;

  background: var(--color-surface-dark);
  color: var(--color-text-light);

  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;

  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);

  overflow: hidden;
}

.rules-modal__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  padding: 22px 24px 16px;

  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.rules-modal__eyebrow {
  display: block;
  margin-bottom: 4px;

  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.rules-modal__header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.rules-modal__close-icon {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 0;
  border-radius: 50%;

  background: transparent;
  color: var(--color-text-light);

  font-size: 1.6rem;
  line-height: 1;

  cursor: pointer;
}

.rules-modal__close-icon:hover {
  background: rgba(255, 255, 255, 0.08);
}

.rules-modal__content {
  overflow-y: auto;

  padding: 20px 24px;

  display: flex;
  flex-direction: column;
  gap: 22px;
}

.rules-section h3 {
  margin: 0 0 8px;

  font-size: 1rem;
  color: var(--color-text-light);
}

.rules-section p {
  margin: 0;

  color: var(--color-text-nav);
  line-height: 1.65;
  font-size: 0.94rem;
}

.rules-section p + p {
  margin-top: 12px;
}

.rules-modal__footer {
  display: flex;
  justify-content: flex-end;

  padding: 16px 24px;

  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

@media (max-width: 600px) {
  .rules-overlay {
    padding: 12px;
  }

  .rules-modal {
    max-height: 88svh;
  }

  .rules-modal__header {
    padding: 18px 18px 14px;
  }

  .rules-modal__content {
    padding: 16px 18px;
    gap: 18px;
  }

  .rules-modal__footer {
    padding: 14px 18px;
  }

  .rules-section p {
    font-size: 0.88rem;
  }
}
</style>
