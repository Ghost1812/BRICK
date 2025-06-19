// Importa as três cenas principais do jogo
import { MenuScene } from './cena_menu.js';
import { MainScene } from './cena_game.js';
import { GameOverScene } from './cena_game_over.js';

// Configuração geral do jogo Phaser
const config = {
  type: Phaser.AUTO, // Usa WebGL se disponível, senão fallback para Canvas
  width: 800,        // Largura da tela do jogo
  height: 600,       // Altura da tela do jogo
  backgroundColor: '#000000', // Cor de fundo do jogo (preto)

  physics: {
    default: 'arcade', // Usa o motor de física "arcade"
    arcade: {
      debug: false,    // Mostra ou não os corpos de colisão (false = não)
      gravity: { y: 0 } // Sem gravidade vertical (para jogos tipo Arkanoid)
    }
  },

  scale: {
    mode: Phaser.Scale.FIT,          // Escala para caber na tela do dispositivo
    autoCenter: Phaser.Scale.CENTER_BOTH // Centraliza o jogo no ecrã
  },

  scene: [MenuScene, MainScene, GameOverScene] // Ordem em que as cenas são carregadas
};

// Cria uma nova instância do jogo com a configuração acima
new Phaser.Game(config);
