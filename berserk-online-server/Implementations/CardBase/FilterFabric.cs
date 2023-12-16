using berserk_online_server.Data_objects.Cards;
using berserk_online_server.Utils;

namespace berserk_online_server.Implementations.CardBase
{
    public static class FilterFabric
    {
        public static FilterParams Create(FilterParamsRaw param)
        {
            var filter =  new FilterParams()
            {
                Element = parseElements(param.Element),
                Elite = param.Elite,
                Rarity = param.Rarity,
                Type = param.Type,
            };
            if (param.Moves != null)
                filter.Moves = NumbersRangeMapper.FromString(param.Moves);
            if (param.Price != null)
                filter.Price = NumbersRangeMapper.FromString(param.Price);
            if (param.Health != null)
                filter.Health = NumbersRangeMapper.FromString(param.Health);
            return filter;
        }
        private static string[]? parseElements(string? elements)
        {
            return elements?.Split(',');
        }
    }
}
