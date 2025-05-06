import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

const books = [
  { title: "1984", author: "George Orwell", isbn: "9780451524935" },
  {
    title: "Gone with the Wind",
    author: "Margaret Mitchell",
    isbn: "9780452593935",
  },
  { title: "Atomic habits", author: "James Clear", isbn: "9781451673319" },
];

const server = fastify({
  logger: true,
});

await server.register(fastifyCors);
await server.register(fastifySwagger);
await server.register(fastifySwaggerUi);

server.get(
  "/api/books",
  {
    schema: {
      tags: ["Books"],
      querystring: {
        type: "object",
        properties: {
          searchByName: {
            type: "string",
            minLength: 2,
            maxLength: 15,
          },
        },
        additionalProperties: false,
      },
      response: {
        200: {
          type: "array",
          items: {
            type: "object",
            required: ["isbn", "title", "author"],
            properties: {
              isbn: {
                type: "string",
              },
              title: {
                type: "string",
              },
              author: {
                type: "string",
              },
            },
          },
        },
      },
    },
  },
  (request, reply) => {
    const searchByTitle = request.query.searchByTitle;

    if (searchByTitle) {
      reply.send(
        books.filter((book) => {
          return book.title.toLowerCase().includes(searchByTitle.toLowerCase());
        }),
      );
    }

    reply.send(books);
  },
);

server.post(
  "/api/books",
  {
    schema: {
      tags: ["Books"],
      body: {
        type: "object",
        properties: {
          title: {
            type: "string",
            minLength: 5,
          },
          author: {
            type: "string",
            minLength: 5,
          },
        },
        additionalProperties: false,
      },
      response: {
        201: {
          type: "object",
          required: ["isbn", "title", "author"],
          properties: {
            isbn: {
              type: "string",
            },
            title: {
              type: "string",
            },
            author: {
              type: "string",
            },
          },
        },
      },
    },
  },
  (request, reply) => {
    const body = request.body;
    const newBook = body;

    books.push(newBook);
    reply.send(newBook);
  },
);

server.listen({
  port: 4500,
});
