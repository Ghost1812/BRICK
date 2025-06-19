// Lista de frases provocadoras que serão escolhidas aleatoriamente para o ecrã de Game Over
const SUBTITULOS_GAMEOVER = [
  "Just close the game at this point",
  "Maybe Pong is more your speed",
  "You had one job...",
  "Recalibrating your skills... nope, still bad",
  "Imagine losing in a rectangle game",
  "BRICK: 1 | You: 0",
  "Don't cry. It’s just data.",
  "That brick really showed you",
  "You died as you lived: bouncing aimlessly",
  "Try again, but maybe with talent this time"
];

// Cena de Game Over
export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
    this.hue = 0;           // Valor da tonalidade (HSL) para o contorno arco-íris
    this.contorno = null;   // Referência ao objeto gráfico do contorno
  }

  create() {
    const { width, height } = this.scale;

    // Garante que a textura "bola" existe (usada nas partículas)
    if (!this.textures.exists('bola')) {
      const gfx = this.add.graphics();
      gfx.fillStyle(0xffffff, 1);
      gfx.fillCircle(10, 10, 10);
      gfx.generateTexture('bola', 20, 20);
      gfx.destroy();
    }

    // Efeito de partículas no fundo (ambiente suave)
    this.add.particles(0, 0, 'bola', {
      x: { min: 0, max: width },
      y: { min: 0, max: height },
      speedY: { min: -5, max: -15 },
      lifespan: 6000,
      scale: { start: 0.1, end: 0 },
      quantity: 1,
      frequency: 120,
      alpha: { start: 0.1, end: 0 },
      blendMode: 'ADD'
    });

    // Texto principal "GAME OVER"
    const titulo = this.add.text(width / 2, height / 3.2, 'GAME OVER', {
      fontSize: '52px',
      fill: '#ff3333',
      fontFamily: 'Courier New',
      stroke: '#ffffff',
      strokeThickness: 2,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: '#ff00ff',
        blur: 5,
        fill: true
      }
    }).setOrigin(0.5);

    // Animação de flutuação no título
    this.tweens.add({
      targets: titulo,
      y: titulo.y - 10,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Frase provocadora aleatória como subtítulo
    const frase = Phaser.Utils.Array.GetRandom(SUBTITULOS_GAMEOVER);
    const subtitulo = this.add.text(width / 2, height / 2.1, frase, {
      fontSize: '22px',
      fill: '#ff99ff',
      fontFamily: 'monospace',
      fontStyle: 'italic',
      shadow: {
        offsetX: 0,
        offsetY: 0,
        color: '#ff33cc',
        blur: 6,
        fill: true
      }
    }).setOrigin(0.5);

    // Animação de movimento suave no subtítulo
    this.tweens.add({
      targets: subtitulo, 
      y: subtitulo.y + 10,
      duration: 1600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Botão "RECOMEÇAR" que reinicia o jogo
    const botaoRecomecar = this.add.text(width / 2, height / 1.7, 'RECOMEÇAR', {
      fontSize: '28px',
      fill: '#ffffff',
      fontFamily: 'Courier New'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    // Animação de piscar no botão de recomeçar
    this.tweens.add({
      targets: botaoRecomecar,
      alpha: { from: 1, to: 0.5 },
      duration: 600,
      yoyo: true,
      repeat: -1
    });

    // Eventos de interação do botão "RECOMEÇAR"
    botaoRecomecar.on('pointerover', () => botaoRecomecar.setStyle({ fill: '#dddddd' }));
    botaoRecomecar.on('pointerout', () => botaoRecomecar.setStyle({ fill: '#ffffff' }));
    botaoRecomecar.on('pointerdown', () => {
      this.scene.start('MainScene');
    });

    // Botão adicional para voltar ao Menu principal
    const botaoMenu = this.add.text(width / 2, height / 1.5, 'MENU', {
      fontSize: '24px',
      fill: '#ffff99',
      fontFamily: 'Courier New'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    // Animação de piscar no botão do menu
    this.tweens.add({
      targets: botaoMenu,
      alpha: { from: 1, to: 0.6 },
      duration: 600,
      yoyo: true,
      repeat: -1
    });

    // Eventos de interação do botão "MENU"
    botaoMenu.on('pointerover', () => botaoMenu.setStyle({ fill: '#ffffff' }));
    botaoMenu.on('pointerout', () => botaoMenu.setStyle({ fill: '#ffff99' }));
    botaoMenu.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });

    // Criação do objeto gráfico para o contorno
    this.contorno = this.add.graphics();
  }

  update() {
    // Atualiza a cor do contorno com base no ciclo HSL
    this.hue = (this.hue + 1) % 360;
    const cor = Phaser.Display.Color.HSLToColor(this.hue / 360, 1, 0.5).color;

    // Redesenha o contorno com a nova cor
    this.contorno.clear();
    this.contorno.lineStyle(4, cor);
    this.contorno.strokeRect(0, 0, this.scale.width, this.scale.height);
  }
}
