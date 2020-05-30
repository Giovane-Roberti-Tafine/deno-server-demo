import { Application, Router } from 'https://deno.land/x/oak@v4.0.0/mod.ts';

type Book = {
    id: number;
    title: string;
    author: string;
};

const books: Book[] = [
    {
        id: 1,
        title: 'The Test',
        author: 'Giovane Roberti Tafine',
    },
];

const app = new Application();

// Logger
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    console.log(`${ctx.request.method} ${ctx.request.url} - ${ms}ms`);
});

const router = new Router();

router
    .get('/', (context) => {
        context.response.body = 'Welcome to Deno 🦕';
    })
    .get('/book', (context) => {
        context.response.body = books;
    })
    .get('/book/:id', (context) => {
        if (context.params && context.params.id) {
            const id = context.params.id;
            context.response.body = books.find((book) => book.id === parseInt(id));
        }
    })
    .post('/book', async (context) => {
        const body = await context.request.body();
        if (!body.value.title || !body.value.author) {
            context.response.status = 400;
            return;
        }
        const newBook: Book = {
            id: books.length + 1,
            title: body.value.title,
            author: body.value.author,
        };
        books.push(newBook);
        context.response.status = 201;
    });

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
