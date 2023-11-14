namespace berserk_online_server.Interfaces
{
    public interface ICache<TKey, TValue>
    {
        TValue Get(TKey key);
        void Set(TKey key, TValue value);
        void Remove(TKey key);
        bool TryGet(TKey key, out TValue value);
    }
}
