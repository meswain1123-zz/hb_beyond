
export class SlotLevel {
  value: -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  
  constructor(obj?: number | SlotLevel) {
    const value = obj !== undefined ? (obj instanceof SlotLevel ? obj.value : obj) : -1;
    if (value === -1 || 
      value === 0 || 
      value === 1 || 
      value === 2 || 
      value === 3 || 
      value === 4 || 
      value === 5 || 
      value === 6 || 
      value === 7 || 
      value === 8 || 
      value === 9) {
      this.value = value;
    } else {
      this.value = -1;
    }
  }
}