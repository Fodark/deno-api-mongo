import { MongoClient } from "https://deno.land/x/mongo@v0.10.1/mod.ts";

const client = new MongoClient();
client.connectWithUri("mongodb://root:password@172.21.0.2:27017");

interface BookSchema {
  _id: { $oid: string };
  title: string;
  synopsis: string;
}

const db = client.database("test");
const books = db.collection<BookSchema>("books");

books.deleteMany({});

await books.insertMany([
  {
    title: "Weapons of math destruction",
    synopsis: "Big data can be bad",
  },
  {
    title: "Social Physics",
    synopsis: "Sociology done right",
  },
  {
    title: "Harry Potter",
    synopsis: "100 points to Gryffindor",
  },
]);
