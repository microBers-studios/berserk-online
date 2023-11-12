using berserk_online_server.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using System.Collections;

namespace berserk_online_server.Facades
{
    public class Cache<TKey, TValue> : ICache<TKey, TValue>
    {
        private readonly IMemoryCache _memoryCache;
        public Cache(IMemoryCache memoryCache)
        {
            _memoryCache = memoryCache;
        }
        public TValue Get(TKey key)
        {
            var value = (TValue) _memoryCache.Get(key);
            if (value == null)
            {
                throw new ArgumentNullException(nameof(value));
            }
            return value;
        }

        public void Remove(TKey key)
        {
            _memoryCache.Remove(key);
        }

        public void Set(TKey key, TValue value)
        {
            _memoryCache.Set(key, value, DateTimeOffset.Now.AddMinutes(15));
        }

        public bool TryGet(TKey key, out TValue value)
        {
            value = (TValue) _memoryCache.Get(key);
            return value != null;
        }
    }
}
