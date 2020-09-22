# --- base the node ---
# @see: https://codefresh.io/docker-tutorial/node_docker_multistage/
FROM node:14.11-alpine3.12 AS base

RUN apk add --no-cache tini

WORKDIR /ws/my-midi
COPY package.json .

ENTRYPOINT ["/sbin/tini", "--"]

# --- extend the dependencies ---
FROM base AS dependencies
# install node packages
RUN npm set progress=false && npm config set depth 0
RUN npm install --only=production 
# copy production node_modules aside
RUN cp -R node_modules prod_node_modules
# install ALL node_modules, including 'devDependencies'
RUN npm install

# --- test
FROM dependencies AS test
COPY . .
RUN CI=true npm test

# --- release
FROM base AS release
# copy production node_modules
COPY --from=dependencies /ws/my-midi/prod_node_modules ./node_modules
# copy app sources
COPY . .
# expose port and define CMD
EXPOSE 3000
CMD npm start