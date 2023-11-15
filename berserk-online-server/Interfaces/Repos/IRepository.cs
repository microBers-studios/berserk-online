namespace berserk_online_server.Interfaces.Repos
{
    public interface IRepository<T>
    {
        T Get(string id);
        void Update(T entity);
        void Delete(string id);
        void Add(T entity);
    }
}
