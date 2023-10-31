import { Inject, Injectable, Logger } from '@nestjs/common'
import { RedisClientType } from 'redis'

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name)
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType,
  ) {}

  async get(key: string): Promise<string | null> {
    const keys = await this.redisClient.keys('*')
    this.logger.log(keys)
    return await this.redisClient.get(key)
  }

  async set(key: string, value: string | number, ttl?: number) {
    await this.redisClient.set(key, value)
    if (ttl)
      await this.redisClient.expire(key, ttl)
  }
}
