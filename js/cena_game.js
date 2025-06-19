// Importa o objeto global que armazena o estado persistente (ex: vidas)
import { JogoGlobal } from './globals.js';

export class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
    // Objetos e variáveis de estado
    this.bola = null;
    this.raquete = null;
    this.blocos = null;
    this.textoVidas = null;
    this.gameOver = false;
    this.perda = null;
    this.nivelAtual = 1;
    this.totalBlocos = 0;
    this.hue = 0;
    this.contorno = null;
  }

  create() {
    // Vidas persistentes entre níveis (vindas de JogoGlobal)
    this.vidas = JogoGlobal.vidas;
    this.gameOver = false;

    // Geração aleatória do layout (nível) entre 1 e 10
    this.nivelAtual = Phaser.Math.Between(1, 10);

    // Criação da textura da raquete (100x20px azul)
    const gfx = this.add.graphics();
    gfx.fillStyle(0x0000ff, 1);
    gfx.fillRect(0, 0, 100, 20);
    gfx.generateTexture('raquete', 100, 20);
    gfx.clear();

    // Raquete física no jogo
    this.raquete = this.physics.add.image(400, 550, 'raquete').setImmovable(true);
    this.raquete.body.allowGravity = false;

    // Criação da bola branca
    const gfx2 = this.add.graphics();
    gfx2.fillStyle(0xffffff, 1);
    gfx2.fillCircle(10, 10, 10);
    gfx2.generateTexture('bola', 20, 20);
    gfx2.destroy();

    // Bola física
    this.bola = this.physics.add.image(400, 300, 'bola');
    this.bola.setDisplaySize(20, 20);
    this.bola.setCollideWorldBounds(true);
    this.bola.setBounce(1);
    this.bola.setVelocity(250, -250); // Velocidade inicial

    // Tamanho dos blocos
    const blockWidth = 64;
    const blockHeight = 24;

    // Criação de textura para blocos (se ainda não existir)
    if (!this.textures.exists('bloco')) {
      const gfx3 = this.add.graphics();
      gfx3.fillStyle(0xff0000, 1);
      gfx3.fillRect(0, 0, blockWidth, blockHeight);
      gfx3.generateTexture('bloco', blockWidth, blockHeight);
      gfx3.destroy();
    }

    // Geração dos layouts dos níveis
    const xOff = 80, yOff = 50, w = 64, h = 24, space = 2;
    const gen = (fn) => {
      const list = [];
      for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 10; x++) {
          if (fn(x, y)) list.push([xOff + x * (w + space), yOff + y * (h + space)]);
        }
      }
      return list;
    };

    // Diferentes padrões de níveis
    const niveis = {
      1: gen(() => true),
      2: gen((x, y) => x === y || x === 9 - y),
      3: gen((x, y) => (x + y) % 2 === 0),
      4: gen((x, y) => y % 2 === 0),
      5: gen((x, y) => x % 2 === 0),
      6: gen((x, y) => x < 5),
      7: gen((x, y) => x >= 5),
      8: gen((x, y) => y === 0 || y === 3),
      9: gen((x, y) => x > 2 && x < 7 && y > 0 && y < 3),
      10: gen((x, y) => (x + y) % 3 === 0)
    };

    // Blocos físicos adicionados ao mundo
    this.blocos = this.physics.add.staticGroup();
    const blocosSelecionados = niveis[this.nivelAtual] || niveis[1];
    this.totalBlocos = blocosSelecionados.length;

    blocosSelecionados.forEach(([x, y]) => {
      this.blocos.create(x, y, 'bloco');
    });

    // Colisões
    this.physics.add.collider(this.bola, this.raquete);
    this.physics.add.collider(this.bola, this.blocos, this.destruirBloco, null, this);

    // Texto com contador de vidas
    this.textoVidas = this.add.text(10, 10, 'Vidas: ' + this.vidas, {
      fontSize: '20px',
      fill: '#ffffff'
    });

    // Zona de perda (em baixo do ecrã)
    this.perda = this.add.rectangle(400, 599, 800, 2, 0xff00ff).setOrigin(0.5, 0.5);
    this.physics.add.existing(this.perda, true);
    this.perda.visible = false;

    // Verifica se a bola colide com a zona de perda
    this.physics.add.overlap(this.bola, this.perda, this.perderVida, null, this);

    // Movimento da raquete pelo rato
    this.input.on('pointermove', pointer => {
      this.raquete.x = Phaser.Math.Clamp(pointer.x, 50, 750);
    });

    // Criar contorno arco-íris
    this.contorno = this.add.graphics();
  }

  // Quando o jogador perde a bola
  perderVida() {
    if (this.gameOver) return;

    JogoGlobal.vidas--;            // Atualiza o número global de vidas
    this.vidas = JogoGlobal.vidas; // Atualiza o valor local

    if (this.vidas > 0) {
      // Reinicia bola e atualiza texto
      this.bola.setPosition(400, 300);
      this.bola.setVelocity(250, -250);
      this.textoVidas.setText('Vidas: ' + this.vidas);
    } else {
      // GAME OVER
      this.textoVidas.setText('Vidas: 0');
      this.gameOver = true;
      JogoGlobal.vidas = 3; // Reset global de vidas para próxima partida

      this.bola.disableBody(true, true);
      this.time.delayedCall(1000, () => {
        this.scene.start('GameOverScene');
      });
    }
  }

  // Quando a bola destrói um bloco
  destruirBloco(bola, bloco) {
    bloco.destroy();

    const blocosRestantes = this.blocos.countActive();
    if (blocosRestantes === 0) {
      // Passa para o próximo nível mantendo vidas
      this.time.delayedCall(1000, () => {
        this.scene.start('MainScene');
      });
    } else {
      // Aumenta a velocidade da bola dinamicamente
      const percent = 1 - blocosRestantes / this.totalBlocos;
      const speed = 250 + percent * 150;
      const angle = this.bola.body.velocity.clone().normalize();
      this.bola.setVelocity(angle.x * speed, angle.y * speed);
    }
  }

  update() {
    // Animação do contorno arco-íris
    this.hue = (this.hue + 1) % 360;
    const cor = Phaser.Display.Color.HSLToColor(this.hue / 360, 1, 0.5).color;
    this.contorno.clear();
    this.contorno.lineStyle(4, cor);
    this.contorno.strokeRect(0, 0, this.scale.width, this.scale.height);
  }
}
