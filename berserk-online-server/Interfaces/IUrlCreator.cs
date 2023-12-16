using berserk_online_server.Implementations;

namespace berserk_online_server.Interfaces
{
    public interface IUrlCreator
    {
        string Create(string token, FrontendUrlType type);
    }
}
