using System.Numerics;

namespace berserk_online_server.Utils
{
    public class NumbersRange
    {
        public NumbersRange(int? from, int? to)
        {
            if (from != null)
                From = (int)from; 
            if (to != null)
                To = (int)to;
        }
        public int From { get; set; } = int.MinValue;
        public int To { get; set; } = int.MaxValue;
    }
}
