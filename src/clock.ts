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
    this.ctx.beginPath();
    this.ctx.arc(this.radius, this.radius, this.radius * 0.9, 0, 2 * Math.PI);
    this.ctx.fillStyle = 'white';
    this.ctx.fill();
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = this.radius * 0.05;
    this.ctx.stroke();
  }

  private drawNumbers() {
    this.ctx.font = `${this.radius * 0.15}px Arial`;
    this.ctx.textBaseline = 'middle';
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = '#000';

    for (let num = 1; num <= 12; num++) {
      const ang = (num * Math.PI) / 6;
      const x = this.radius + Math.sin(ang) * this.radius * 0.75;
      const y = this.radius - Math.cos(ang) * this.radius * 0.75;
      this.ctx.fillText(num.toString(), x, y);
    }
  }

  private drawTime() {
    const now = new Date();
    const hour = now.getHours() % 12;
    const minute = now.getMinutes();
    const second = now.getSeconds();

    // 時針
    this.drawHand(
      (hour * Math.PI) / 6 + (minute * Math.PI) / (6 * 60),
      this.radius * 0.5,
      this.radius * 0.07
    );

    // 分針
    this.drawHand(
      (minute * Math.PI) / 30,
      this.radius * 0.7,
      this.radius * 0.05
    );

    // 秒針
    this.drawHand(
      (second * Math.PI) / 30,
      this.radius * 0.8,
      this.radius * 0.02
    );

    // 中心の円
    this.ctx.beginPath();
    this.ctx.arc(this.radius, this.radius, this.radius * 0.05, 0, 2 * Math.PI);
    this.ctx.fillStyle = '#000';
    this.ctx.fill();
  }

  private drawHand(angle: number, length: number, width: number) {
    this.ctx.beginPath();
    this.ctx.lineWidth = width;
    this.ctx.lineCap = 'round';
    this.ctx.moveTo(this.radius, this.radius);
    this.ctx.lineTo(
      this.radius + Math.sin(angle) * length,
      this.radius - Math.cos(angle) * length
    );
    this.ctx.stroke();
  }
}
