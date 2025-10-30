export class Clock {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private radius: number;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.setCanvasSize();
    this.radius = this.canvas.width / 2;

    window.addEventListener('resize', () => {
      this.setCanvasSize();
      this.radius = this.canvas.width / 2;
    });
  }

  private setCanvasSize() {
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.95;
    this.canvas.width = size;
    this.canvas.height = size;
  }

  public start() {
    this.animate();
  }

  private animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.draw();
    requestAnimationFrame(() => this.animate());
  }

  private draw() {
    this.drawFace();
    this.drawNumbers();
    this.drawTime();
  }

  private drawFace() {
    // 外側の影
    this.ctx.beginPath();
    this.ctx.arc(this.radius, this.radius, this.radius * 0.9, 0, 2 * Math.PI);
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    this.ctx.shadowBlur = this.radius * 0.05;
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = this.radius * 0.02;
    this.ctx.fillStyle = 'white';
    this.ctx.fill();
    this.ctx.shadowColor = 'transparent';

    // 枠線
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
    this.ctx.lineWidth = this.radius * 0.02;
    this.ctx.stroke();

    // 目盛りを描画
    this.drawTicks();
  }

  private drawTicks() {
    for (let i = 0; i < 60; i++) {
      const angle = (i * Math.PI) / 30;
      const isHourTick = i % 5 === 0;

      const startRadius = this.radius * (isHourTick ? 0.75 : 0.8);
      const endRadius = this.radius * 0.85;

      const x1 = this.radius + Math.sin(angle) * startRadius;
      const y1 = this.radius - Math.cos(angle) * startRadius;
      const x2 = this.radius + Math.sin(angle) * endRadius;
      const y2 = this.radius - Math.cos(angle) * endRadius;

      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.strokeStyle = isHourTick ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.3)';
      this.ctx.lineWidth = isHourTick ? this.radius * 0.008 : this.radius * 0.004;
      this.ctx.stroke();
    }
  }

  private drawNumbers() {
    this.ctx.font = `300 ${this.radius * 0.12}px 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif`;
    this.ctx.textBaseline = 'middle';
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';

    for (let num = 1; num <= 12; num++) {
      const ang = (num * Math.PI) / 6;
      const x = this.radius + Math.sin(ang) * this.radius * 0.65;
      const y = this.radius - Math.cos(ang) * this.radius * 0.65;
      this.ctx.fillText(num.toString(), x, y);
    }
  }

  private drawTime() {
    const now = new Date();
    const hour = now.getHours() % 12;
    const minute = now.getMinutes();
    const second = now.getSeconds();
    const millisecond = now.getMilliseconds();

    // 時針
    this.drawHand(
      (hour * Math.PI) / 6 + (minute * Math.PI) / (6 * 60),
      this.radius * 0.5,
      this.radius * 0.035,
      'rgba(0, 0, 0, 0.8)'
    );

    // 分針
    this.drawHand(
      (minute * Math.PI) / 30 + (second * Math.PI) / (30 * 60),
      this.radius * 0.7,
      this.radius * 0.025,
      'rgba(0, 0, 0, 0.7)'
    );

    // 秒針（赤色でマテリアルデザイン風）
    this.drawHand(
      (second * Math.PI) / 30 + (millisecond * Math.PI) / (30 * 1000),
      this.radius * 0.8,
      this.radius * 0.008,
      '#F44336'
    );

    // 中心の円（影付き）
    this.ctx.beginPath();
    this.ctx.arc(this.radius, this.radius, this.radius * 0.04, 0, 2 * Math.PI);
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    this.ctx.shadowBlur = this.radius * 0.02;
    this.ctx.fillStyle = '#F44336';
    this.ctx.fill();
    this.ctx.shadowColor = 'transparent';

    // 中心の小さな白い円
    this.ctx.beginPath();
    this.ctx.arc(this.radius, this.radius, this.radius * 0.015, 0, 2 * Math.PI);
    this.ctx.fillStyle = 'white';
    this.ctx.fill();
  }

  private drawHand(angle: number, length: number, width: number, color: string, tailLength: number = 0) {
    this.ctx.beginPath();
    this.ctx.lineWidth = width;
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = color;

    // 針の後ろ側
    if (tailLength !== 0) {
      this.ctx.moveTo(
        this.radius - Math.sin(angle) * tailLength,
        this.radius + Math.cos(angle) * tailLength
      );
    } else {
      this.ctx.moveTo(this.radius, this.radius);
    }

    // 針の前側
    this.ctx.lineTo(
      this.radius + Math.sin(angle) * length,
      this.radius - Math.cos(angle) * length
    );
    this.ctx.stroke();
  }
}
