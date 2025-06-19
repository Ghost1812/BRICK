const SUBTITULOS = [
  "// TODO: Add Game",
  "Probably Broken",
  "BOUNCE.EXE",
  "Press Start to Cry",
  "404: Fun Not Found",
  "Ball Goes Bonk",
  "Unoriginal Bouncer",
  "This Is Not Fun",
  "PlayTest V0.000000000000001",
  "Ultimate Brick Face-Off",
  "Hope Is a Brick",
  "You Miss, You Die",
  "Build Failed",
  "I Made This in 4 Hours",
  "Skill Issue",
  "Git Gud or Quit"
];

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
    this.hue = 0;           // Para animar o contorno com cor arco-íris
    this.contorno = null;   // Gráfico para desenhar o contorno
  }

  create() {
    const { width, height } = this.scale;

    // Gera a textura da bola caso ainda não exista
    if (!this.textures.exists('bola')) {
      const gfx = this.add.graphics();
      gfx.fillStyle(0xffffff, 1);
      gfx.fillCircle(10, 10, 10);
      gfx.generateTexture('bola', 20, 20);
      gfx.destroy();
    }

    // Partículas suaves de fundo com a textura da bola
    this.add.particles(0, 0, 'bola', {
      x: { min: 0, max: width },
      y: { min: 0, max: height },
      speedY: { min: -10, max: -20 },
      lifespan: 4000,
      scale: { start: 0.1, end: 0 },
      quantity: 1,
      frequency: 100,
      alpha: { start: 0.2, end: 0 },
      blendMode: 'ADD'
    });

    // Título principal do menu com efeito de sombra e contorno
    const titulo = this.add.text(width / 2, height / 3.5, 'BRICK: The Game', {
      fontSize: '48px',
      fill: '#ffffff',
      fontFamily: 'monospace',
      stroke: '#00ffff',
      strokeThickness: 2,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: '#00ffcc',
        blur: 4,
        fill: true
      }
    }).setOrigin(0.5);

    // Animação de flutuação no eixo Y
    this.tweens.add({
      targets: titulo,
      y: titulo.y - 10,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Seleciona um subtítulo aleatório da lista
    const frase = Phaser.Utils.Array.GetRandom(SUBTITULOS);

    // Criação do subtítulo, mais afastado do botão
    const subtitulo = this.add.text(width / 2, height / 2.4, frase, {
      fontSize: '22px',
      fill: '#ffff00',
      fontFamily: 'monospace',
      fontStyle: 'italic',
      shadow: {
        offsetX: 0,
        offsetY: 0,
        color: '#ffee55',
        blur: 6,
        fill: true
      }
    }).setOrigin(0.5);

    // Animação de flutuação para o subtítulo também
    this.tweens.add({
      targets: subtitulo,
      y: subtitulo.y + 10,
      duration: 1600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Botão "JOGAR" com animação de pulsar
    const botao = this.add.text(width / 2, height / 1.8, 'JOGAR', {
      fontSize: '32px',
      fill: '#00ff00',
      fontFamily: 'monospace'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.tweens.add({
      targets: botao,
      scale: 1.05,
      duration: 500,
      yoyo: true,
      repeat: -1
    });

    // Interações com o botão
    botao.on('pointerover', () => botao.setStyle({ fill: '#66ff66' }));
    botao.on('pointerout', () => botao.setStyle({ fill: '#00ff00' }));
    botao.on('pointerdown', () => {
      this.scene.start('MainScene');
    });

    // Gráfico para desenhar o contorno arco-íris
    this.contorno = this.add.graphics();
  }

  update() {
    // Atualiza o contorno colorido com efeito arco-íris animado
    this.hue = (this.hue + 1) % 360;
    const cor = Phaser.Display.Color.HSLToColor(this.hue / 360, 1, 0.5).color;

    this.contorno.clear();
    this.contorno.lineStyle(4, cor);
    this.contorno.strokeRect(0, 0, this.scale.width, this.scale.height);
  }
}
