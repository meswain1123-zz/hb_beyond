
/**
 * This is a simple increasing of an Ability Score.
 * It has an amount and options.  
 * If the options only has one in it, then it automatically uses it.
 */
export class ASIFeature {
  id: number;
  amount: number;
  options: string[];

  constructor(obj?: any) {
    this.id = obj ? obj.id : -1;
    this.amount = obj ? obj.amount : 1;
    this.options = obj ? [...obj.options] : [];
  }

  toDBObj = () => {
    return {
      amount: this.amount,
      options: [...this.options]
    };
  }

  copy(copyMe: ASIFeature): void {
    this.id = copyMe.id;
    this.amount = copyMe.amount;
    this.options = [...copyMe.options];
  }
}