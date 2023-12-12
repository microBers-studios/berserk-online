namespace berserk_online_server.Utils
{
    public static class NumbersRangeMapper
    {
        public static NumbersRange FromString(string range)
        {
            if (isRange(range))
            {
                return parseRange(range);
            }
            return charToRange(range);
        }
        private static NumbersRange parseRange(string range)
        {
            string[] values = range.Split('-');
            int.TryParse(values[0], out int from);
            int.TryParse(values[1], out int to);
            return new NumbersRange(from, to);
        }
        private static bool isRange(string str)
        {
            return str.Contains('-');
        }
        private static NumbersRange charToRange(string number)
        {
            return new NumbersRange(int.Parse(number), int.Parse(number));
        }
    }
}
