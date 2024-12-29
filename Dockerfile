FROM node:20-alpine AS build

WORKDIR /app
COPY package* ./
RUN npm install
COPY . .
RUN npm run build


FROM node:20-alpine AS production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=build --chown=nextjs:nodejs /app/.next ./.next
COPY --from=build --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=build --chown=nextjs:nodejs /app/public ./public

USER nextjs

ENV NODE_ENV production
ENV PORT 3000
EXPOSE 3000

CMD ["npm", "run", "start"]