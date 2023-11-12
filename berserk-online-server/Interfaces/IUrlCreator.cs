using berserk_online_server.Facades;

namespace berserk_online_server.Interfaces
{
    public interface IUrlCreator
    {
        string Create(string token, FrontendUrlType type);
    }
}
