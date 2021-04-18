

/**
 * This represents a single group of coinage (cp, sp, ep, gp, pp, etc).
 */
export class Money {
  type: string;
  count: number;

  constructor(obj?: any) {
    this.type = obj ? obj.type : "cp";
    this.count = obj ? obj.count : 0;
  }

  toDBObj = () => {
    return {
      type: this.type,
      count: this.count
    };
  }
}