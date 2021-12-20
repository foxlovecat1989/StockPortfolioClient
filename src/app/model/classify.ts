import { Stock } from "./Stock";

export class Classify{
  classifyId!: number;
  name!: string;

   static fromHttp(classify: Classify) : Classify{
    const newClassify = new Classify();
    newClassify.classifyId = classify.classifyId;
    newClassify.name = classify.name;

    return newClassify;
  }
}

