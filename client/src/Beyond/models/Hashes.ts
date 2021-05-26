
import { ModelBase } from ".";

export interface IStringHash {
  [details: string] : string;
} 

export interface IString2Hash {
  [details: string] : IStringHash;
} 

export interface IStringAnyHash {
  [details: string] : any;
} 

export interface IStringArrayHash {
  [details: string] : string[];
} 

export interface INumHash {
  [details: number] : number;
} 

export interface IStringNumHash {
  [details: string] : number;
} 

export interface IStringNumOrStringHash {
  [details: string] : number | string;
} 

export interface IStringStringNumHash {
  [details: string] : IStringNumHash;
} 

export interface SmartHash {
  [details: string] : ModelBase[];
}
