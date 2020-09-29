# --- base the node ---
# @see: https://codefresh.io/docker-tutorial/node_docker_multistage/
#
# to build and publish use
#   docker buildx build --push --platform linux/amd64,linux/arm64 -t jaaltrch/my-midi .
# to run
#   docker pull jaaltrch/my-midi
#   docker run -p 8080:80 -d --rm --name my-midi jaaltrch/my-midi
FROM node:current-alpine AS base

WORKDIR /ws/my-midi
COPY package.json .

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
RUN npm run build

# --- image
FROM nginx:alpine AS runtime

COPY --from=release /ws/my-midi/build /usr/share/nginx/html