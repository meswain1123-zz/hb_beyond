

export class HitDice {
  size: number;
  used: number;
  count: number;

  constructor(obj?: any) {
    this.size = obj ? +obj.size : 0;
    this.used = obj && obj.used ? +obj.used : 0;
    this.count = obj ? +obj.count : 0;
  }

  toDBObj = () => {
    return {
      size: this.size,
      used: this.used,
      count: this.count
    };
  }
}