import { rest } from "msw";

export const handlers = [
  rest.get("http://localhost:3002/test", (req, res, ctx) => {
    return res(ctx.json({ message: "Get data" }));
  }),
  rest.post("http://localhost:3002/test", (req, res, ctx) => {
    return res(ctx.json({ message: "Post data" }));
  }),
];
