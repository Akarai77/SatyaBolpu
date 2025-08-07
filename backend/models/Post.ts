
export interface IPost extends Document {
  mainTitle: string;
  shortTitle: string;
  culture: "daivaradhane" | "nagaradhane" | "yakshagana" | "kambala";
  description: string;
  image: string;
  content: string;
}
