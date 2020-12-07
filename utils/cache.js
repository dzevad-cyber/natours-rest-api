import mongoose from 'mongoose';
import redis from 'redis';
import util from 'util';

const redisURL = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisURL);

client.hget = util.promisify(client.hget);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || '');

  return this;
};

mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }

  const key = JSON.stringify({
    collection: this.mongooseCollection.name,
    ...this.getFilter(),
  });

  const cachedData = await client.hget(this.hashKey, key);
  if (cachedData) {
    const doc = JSON.parse(cachedData);

    return Array.isArray(doc)
      ? doc.map(d => new this.model(d))
      : new this.model(doc);
  }

  const result = await exec.apply(this, arguments);

  client.hmset(this.hashKey, key, JSON.stringify(result), 'EX', 10);

  return result;
};

export const clearHash = hashKey => {
  client.del(JSON.stringify(hashKey));
};
