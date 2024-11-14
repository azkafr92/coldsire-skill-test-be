# Multi-stage building

# Stage 1:
# - init project
# - install dev dependencies
# - build production code
FROM node:20-alpine3.18 AS development

WORKDIR /app

COPY package*.json ./

RUN npm install --only=development

COPY . .

RUN npm run build

# Step 2:
# - init project
# - install production dependencies
# - copy and run production code
FROM node:20-alpine3.18 AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

RUN apk add bind-tools

COPY --from=development /app/dist ./dist

CMD ["node", "dist/main"]