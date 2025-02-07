<script setup>
import ButtonIcon from "./ButtonIcon.vue";

const emit = defineEmits(["onClick"]);
const props = defineProps({
  enabled: {
    type: Boolean,
    default: true
  },
  small: {
    type: Boolean,
    default: false
  },
  emoji: {
    type: String,
    default: "twemoji:writing-hand"
  }
});

const emojis = [
  "twemoji:writing-hand", "twemoji:cold-face", "twemoji:beating-heart", "twemoji:goat", "twemoji:loudly-crying-face", "twemoji:wrapped-gift", "twemoji:thumbs-up", "twemoji:fire",
  "twemoji:sparkles", "twemoji:clapping-hands", "twemoji:smiling-face-with-heart-eyes", "twemoji:thinking-face", "twemoji:crying-face", "twemoji:partying-face", "twemoji:sun", "twemoji:baby-angel", "twemoji:smiling-face-with-hearts",
  "twemoji:flushed-face", "twemoji:folded-hands", "twemoji:ice-hockey", "twemoji:rocket", "twemoji:brain", "twemoji:exploding-head", "twemoji:grinning-face", "twemoji:grimacing-face", "twemoji:winking-face",
  "twemoji:zipper-mouth-face", "twemoji:eyes", "twemoji:alien", "twemoji:robot", "twemoji:ghost", "twemoji:pile-of-poo", "twemoji:skull", "twemoji:alien-monster", "twemoji:spider",
  "twemoji:cat-face", "twemoji:dog-face", "twemoji:unicorn-face", "twemoji:fox-face", "twemoji:elephant", "twemoji:tiger-face", "twemoji:lion-face", "twemoji:martial-arts-uniform", "twemoji:penguin",
  "twemoji:snake", "twemoji:chicken", "twemoji:duck", "twemoji:owl", "twemoji:butterfly", "twemoji:bouquet", "twemoji:blossom", "twemoji:snowflake", "twemoji:rainbow",
  "twemoji:mountain", "twemoji:sunrise", "twemoji:cityscape", "twemoji:bridge-at-night", "twemoji:airplane", "twemoji:train", "twemoji:automobile", "twemoji:hourglass", "twemoji:alarm-clock",
  "twemoji:watch", "twemoji:money-bag", "twemoji:credit-card", "twemoji:shopping-cart", "twemoji:camera-with-flash", "twemoji:loudspeaker", "twemoji:moai", "twemoji:safety-vest", "twemoji:bicycle", "twemoji:droplet"
];

</script>
<template>
  <div class="dropdown d-inline-flex align-items-center">
    <button class="btn btn-soft-primary dropdown-toggle" :class="[
      { disabled: !props.enabled },
      small ? 'btn-xs dropdown-toggle-sm' : 'dropdown-toggle-default'
    ]" type="button" id="EmojiDropdown" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      <iconify-icon :icon="props.emoji" class="inline emoji-selected" noobserver />
    </button>
    <div class="dropdown-menu dropdown-area dropdown-menu-md-end" aria-labelledby="EmojiDropdown">
      <div class="emoji-grid">
        <ButtonIcon v-for="emo in emojis" :key="emo" class="emoji-item" @on-click="emit('onClick', emo)">
          <iconify-icon :icon="emo" class="d-block" noobserver />
        </ButtonIcon>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dropdown-toggle {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dropdown-toggle-default {
  width: 32px;
  height: 32px;
}

.dropdown-toggle-sm {
  width: 26.4px;
  height: 26.4px;
}

.emoji-selected {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.2rem;
}

/* Si se necesita ajustar el tamaño del emoji según el tamaño del botón */
.dropdown-toggle-sm .emoji-selected {
  font-size: 1rem;
}

.dropdown-toggle-default .emoji-selected {
  font-size: 1.2rem;
}

.dropdown-area {
  min-width: 16rem;
  padding: 0.5rem;
  overflow-y: auto;
  overflow-x: hidden;
  height: 300px;
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 0.25rem;
}

.emoji-item {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
  transition: background-color 0.2s;
  width: 32px;
  height: 32px;
}

.emoji-item:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>