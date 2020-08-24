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

const getBooks = async ({ response }: { response: any }) => {
  response.body = await books.find({ title: { $ne: null } });
};

const getBook = async (
  { params, response }: { params: { id: string }; response: any },
) => {
  const book = await books.findOne({ _id: { $oid: params.id } });
  if (book) {
    response.status = 200;
    response.body = book;
  } else {
    response.status = 404;
    response.body = { message: `Book not found.` };
  }
};

const addBook = async (
  { request, response }: { request: any; response: any },
) => {
  const body = await request.body();
  const book: BookSchema = body.value;
  await books.insertOne(book);
  response.body = { message: "OK" };
  response.status = 200;
};

const updateBook = async (
  { params, request, response }: {
    params: { id: string };
    request: any;
    response: any;
  },
) => {
  const body = await request.body();
  const book: BookSchema = body.value;

  const { matchedCount, modifiedCount, upsertedId } = await books.updateOne(
    { _id: { $oid: params.id } },
    { $set: { title: book.title, synopsis: book.synopsis } },
  );

  if (modifiedCount > 0) {
    response.status = 200;
    response.body = { message: "OK" };
  } else {
    response.status = 404;
    response.body = { message: `Book not found` };
  }
};

const deleteBook = async (
  { params, response }: { params: { id: string }; response: any },
) => {
  const deleteCount = await books.deleteOne({ _id: { $oid: params.id } });
  if (deleteCount > 0) {
    response.body = { message: "OK" };
    response.status = 200;
  } else {
    response.status = 404;
    response.body = { message: `Book not found` };
  }
};

export { getBooks, getBook, addBook, updateBook, deleteBook };
